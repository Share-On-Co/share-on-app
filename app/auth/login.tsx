import React, {useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { Button, Provider as PaperProvider, DefaultTheme, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLoginPress = async () => {
    return;
  };

  useEffect(() => {
    const checkLoggedIn = async () => { 
    const loggedIn = await AsyncStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
      navigation.navigate('chat');
    }
  }
  checkLoggedIn();
  }, []);

  const handleLoginPress = async () => {
    // make a GET request to https://mongodb-vercel-app.vercel.app/api/auth/login
    const response = await fetch(`https://mongodb-rag-vercel-inquiry-share-onorg-share-ons-projects.vercel.app/api/auth/login/?username=${email}&password=${password}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const user = await response.json();
    const id = user.id;
    navigation.navigate('chat', { id: id });
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <Image
              style={styles.logo}
              source={require('../../assets/images/shareon.jpeg')}
            />
            <Text style={styles.title}>Share-On</Text>
            <Text style={styles.subtitle}>empowering teen mental health with AI</Text>
            <View style={styles.inputContainer}>
              <TextInput
                mode='outlined'
                value={email}
                onChangeText={text => setEmail(text)}
                outlineStyle={{borderRadius: 15, backgroundColor: '#eee', shadowColor: '#000', borderColor: '#eee', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2}}
                style={styles.input}
                placeholder='Email'
                cursorColor='#BF1B1B'
                selectionColor='#BF1B1B'
                activeOutlineColor='#BF1B1B'
                autoCapitalize='none'
              />
              <TextInput
                mode='outlined'
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                style={styles.input}
                placeholder='Password'
                outlineStyle={{borderRadius: 15, backgroundColor: '#eee', shadowColor: '#000', borderColor: '#eee', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2}}
                cursorColor='#BF1B1B'
                selectionColor='#BF1B1B'
                activeOutlineColor='#BF1B1B'
                autoCapitalize='none'
              />
              <TouchableOpacity onPress={handleLoginPress} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("auth/register")}> 
                <Text style={styles.registerText}>Don't have an account?</Text>
              </TouchableOpacity>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>
              <TouchableOpacity onPress={handleGoogleLoginPress} style={styles.googleButton}>
                <Image source={require('../../assets/images/google.png')} />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  innerContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  logo: {
    marginBottom: height * 0.02,
    width: width,
    height: height * 0.15,
    resizeMode: 'contain',
  },
  title: {
    color: '#000',
    fontSize: height * 0.04,
    marginTop: height * 0.02,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#000',
    fontSize: height * 0.025,
    marginTop: height * 0.01,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginTop: height * 0.03,
  },
  input: {
    marginBottom: height * 0.02,
    borderRadius: 15,
    backgroundColor: '#eee',
    shadowColor: '#000',
    borderColor: '#eee',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: '#BF1B1B',
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: height * 0.025,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#666',
    fontSize: height * 0.02,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: 'black',
  },
  dividerText: {
    width: 50,
    textAlign: 'center',
    fontSize: height * 0.03,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#BF1B1B',
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: height * 0.02,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: height * 0.025,
    marginLeft: 10,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
