import React, { useState, useEffect } from 'react';
import StackNavigator from './src/navigation/StackNavigator';
import { View, StyleSheet, Text } from 'react-native';
import Splash from './src/components/Splash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import Colors from './src/utils/Colors';
import Loader from "./src/components/Loader"
// Add Firebase
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { navigationRef } from './src/navigation/RootNavigation';
import axios from 'axios';
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});


const App = () => {
  const [loading, setLoading] = useState(false);

  const [splash, setSplash] = useState(true);
  const setToken = async () => {
    const fcmtoken = await messaging().getToken()
    axios.interceptors.request.use(function (config) {
      config.headers['security_key'] = 'SurfLokal52';
      config.headers['access_token'] = store?.getState().loginUser.loginData.metadata?.[fcmtoken].toString();
      return config;
    });
     console.log("setToken ", store?.getState().loginUser)
  }
  setToken()

  // axios.interceptors.request.use(function (config) {
  //   config.headers['security_key'] = 'SurfLokal52';
  //   config.headers['access_token'] = store?.getState().loginUser.loginData.metadata?.[fcmtoken].toString();
  //   return config;
  // });


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
//   if (splash == true) {
//     return <Splash />;
//   } else {
    

//     return (
//       <SafeAreaView
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           backgroundColor: Colors.primaryBlue,
//         }}>
//         <Provider store={store}>
//           <NavigationContainer ref={navigationRef} >
//             <HandleDeepLinking />

//             <StackNavigator />

//           </NavigationContainer>
//         </Provider>
//       </SafeAreaView >
//     );
//   }
// };

if (splash) {
  return <Splash />;
} else {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.primaryBlue,
      }}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          {/* Only render loader if loading is true */}
          {/* {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loader />
            </View>
          ) : ( */}
            <StackNavigator />
          {/* )} */}
        </NavigationContainer>
      </Provider>
    </SafeAreaView>
  );
}
};

export default App;






