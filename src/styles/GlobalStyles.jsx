import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
export const globalStyles = StyleSheet.create({
  button: {
    backgroundColor: '#047B4D',
    padding: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
});
