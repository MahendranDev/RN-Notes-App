import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/GlobalStyles';
const CommonButton = ({ title = "Sign In", onPress, style, textStyle }) => {
    return (
        <TouchableOpacity style={[globalStyles.button, style]} onPress={onPress}>
        <Text style={[globalStyles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    )
  };
  export default CommonButton;