import React, { useState, useEffect } from 'react';
import Splash from './src/components/Splash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import StackNavigator from './src/navigation/StackNavigator'
import axios from 'axios';
import { QueryClientProvider, QueryClient } from 'react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'react-native';
import Colors from './src/utils/Colors';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const queryClient = new QueryClient();

const App = () => {
  const [splash, setSplash] = useState(true);
  const setToken = async () => {
    const fcmtoken = await messaging().getToken()
    axios.interceptors.request.use(function (config) {
      config.headers['security_key'] = 'SurfLokal52';
      config.headers['access_token'] = store?.getState()?.loginUserReducer?.loginData?.metadata?.[fcmtoken].toString();
      return config;
    });
    console.log("setToken ", store?.getState()?.loginUserReducer?.loginData?.metadata?.[fcmtoken].toString())
  }
  setToken()

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.notification.title) {
      }
      console.log('Notiction App Open1', remoteMessage.notification)
    })
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage.notification) {
        console.log('Notiction App.js on Quit State')
      }
    })

  }, [])


  useEffect(() => {
    const firebaseConfig = {
      apiKey: 'AIzaSyCDtrP8Z7W5KUIfIYCLyKSgu4mK11na41M',
      authDomain: 'surflokalcrm.firebaseapp.com',
      projectId: 'surflokalcrm',
      storageBucket: 'surflokalcrm.appspot.com',
      messagingSenderId: '763888395949',
      appId: '1:763888395949:web:df7c02aa8bdbfb4d4b8824',
      measurementId: 'G-0HG1JK5CE9',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    setTimeout(() => {
      setSplash(false);
    }, 3000);
  });
  if (splash) {
    return <Splash />;
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
        <StatusBar style="light" backgroundColor={Colors.PrimaryColor} />
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <StackNavigator />
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </SafeAreaView>
    );
  }
};

export default App;






