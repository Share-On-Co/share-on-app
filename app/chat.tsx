import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, useWindowDimensions } from 'react-native';
import { Button, Dialog, PaperProvider, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatbotScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading status
  const flatListRef = useRef(null);
  const [visible, setVisible] = React.useState(false);
  const [matchedUser, setMatchedUser] = React.useState('');

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  let userId = route.params?.id;

  const getResponse = async () => {
    const requestBody = {
      messages: messages.map((message) => ({ content: message.text })),
    };

    const response = await fetch(`https://mongodb-rag-vercel-inquiry-share-onorg-share-ons-projects.vercel.app/api/chat/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'responseType': 'stream',
      },
      body: JSON.stringify(requestBody),
      reactNative: { textStreaming: true },
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let botMessage = '';
    const botMessageId = Date.now().toString();
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: botMessageId, text: '', sender: 'bot' },
    ]);

    const processStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botMessage += chunk;

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: botMessage } : msg
          )
        );
      }
    };

    await processStream();
  };
  const storeData = async () => {
    await AsyncStorage.setItem('userId', `${userId}`);
  }
  useEffect(() => {

    storeData();
    if (messages.length > 1 && messages[messages.length - 1].sender === 'user') {
      getResponse();
    }
  }, [messages]);

  useEffect(() => {
    if (flatListRef.current !== null) {
      (flatListRef.current as any).scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleMatch = async () => {
    setLoading(true); // Set loading to true when the button is clicked
    try {
      let numberId = parseInt(userId ?? '0');
      console.log(numberId);
      const response = await fetch(`https://mongodb-rag-vercel-inquiry-share-onorg-share-ons-projects.vercel.app/api/match/?id=${numberId}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
       });
      const match = await response.json();
      const userName = match.name;
      setMatchedUser(userName);
      showDialog();
    } catch (error) {
      console.error('Error fetching match:', error);
    } finally {
      setLoading(false); // Reset loading to false after fetching is done
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const { height: screenHeight } = useWindowDimensions();
  const keyboardVerticalOffset = screenHeight * 0.2; // Adjust this multiplier based on your design needs

  return (
    <PaperProvider>
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
      <Portal>
          <Dialog visible={visible}>
            <Dialog.Title>Matched!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">You have been matched with: {matchedUser}</Text>
            </Dialog.Content>
            <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <TouchableOpacity onPress={handleMatch} style={styles.matchButton} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.matchButtonText}>Match</Text>
          )}
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
        />
        <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={20}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  chatContainer: {
    marginTop: 10,
    padding: 10,
    paddingBottom: 20, // Padding at the bottom of the chat
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0084ff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  matchButton: {
    position: 'relative', // Relative position
    marginRight: 10, // Margin to push it from the right
    backgroundColor: '#0084ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  matchButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ChatbotScreen;
