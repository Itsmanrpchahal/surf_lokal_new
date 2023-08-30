import React from 'react';
import { useEffect, useState } from 'react';
import { SignedInStack, SignedOutStack } from './AppNavigation';
import AsyncStorage from '@react-native-community/async-storage';

const AuthNavigation = () => {

  const [ currentToken, setCurrentToken ] = useState(null);
  const getAccessToken = async () => {
    const access_token = await AsyncStorage.getItem('access_token');
    setCurrentToken(access_token);
     console.log("current Access Token",currentToken)
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  return (
    <>
      {currentToken ? <SignedInStack /> : <SignedOutStack />}
    </>
  );
};

export default AuthNavigation;