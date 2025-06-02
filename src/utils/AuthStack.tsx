import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import NotesList from '../screens/notes/NotesList';
import Signin from '../screens/signin/Signin';
const AppStack: any = createStackNavigator();
const AuthStack = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name={'Signin'}
        component={Signin}
        options={{headerShown: false}}></AppStack.Screen>
      <AppStack.Screen
        name={'NotesList'}
        component={NotesList}
        options={{headerShown: false}}></AppStack.Screen>
    </AppStack.Navigator>
  );
};

export default AuthStack;
