import React, { useState, useEffect } from 'react';
import Splash from './src/components/Splash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
// Add Firebase
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AuthNavigation from './src/navigation/AuthNavigation';
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});


const App = () => {
  const [splash, setSplash] = useState(true);
  const setToken = async () => {
    const fcmtoken = await messaging().getToken()
    axios.interceptors.request.use(function (config) {
      config.headers['security_key'] = 'SurfLokal52';
      config.headers['access_token'] = store?.getState().loginUser.loginData.metadata?.[fcmtoken].toString();
      return config;
    });
     console.log("setToken ", store?.getState().loginUser.loginData.metadata?.[fcmtoken].toString())
  }
  setToken()

  const HandleDeepLinking = () => {
    const navigation = useNavigation()

    const handleDynamicLinks = async (link) => {
      let productId = link.url.split('=').pop()
      navigation.navigate('ViewPropertiy', { ID: productId });
    }
   
    useEffect(() => {
      const unsubscribe = dynamicLinks().onLink(handleDynamicLinks)
      return () => unsubscribe()
    }, [])

    return null
  }
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
    <SafeAreaView style={{ flex: 1}}>
      <Provider store={store}>
         <AuthNavigation/>
      </Provider>
    </SafeAreaView>
  );
}
};

export default App;






