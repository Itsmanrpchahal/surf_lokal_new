import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import Splash from './src/components/Splash';
import {SafeAreaView} from 'react-native-safe-area-context';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import Colors from './src/utils/Colors';
// Add Firebase
import firebase from '@react-native-firebase/app';

const App = () => {
  const [splash, setSplash] = useState(true);
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
  if (splash == true) {
    return <Splash />;
  } else {
    
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: Colors.primaryBlue,
        }}>
        <Provider store={store}>
          <NavigationContainer>
            <StackNavigator />
            
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    );
  }
};

export default App;
