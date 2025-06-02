import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';
import { collection, getDocs,addDoc } from 'firebase/firestore';
import { db } from '../../utils/FirebaseConfig';
import { navigate } from '../../utils/Utils';
import { globalStyles } from '../../styles/GlobalStyles';
import CommonButton from '../../components/commoncomponents/CommonButton';
const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);

      let isValidUser = false;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`${doc.id} => ${doc.data()}`);
        console.log('name is',data.name,'pass',data.password);
        if (data.name === username && data.password === password) {
          isValidUser = true;
          setUsername('');
          setPassword('');
          navigate('NotesList', { userId: doc.id });
        }
      });

      if (!isValidUser) {
        Alert.alert('Login Failed', 'Invalid username or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <ImageBackground
    source={require('../../../assets/images/commonbackground.png')}
    resizeMode="cover"
    style={globalStyles.imageBackground}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      <CommonButton onPress={handleLogin}/>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
 
});
