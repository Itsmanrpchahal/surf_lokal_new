import { createStackNavigator } from '@react-navigation/stack';
import Login from '../container/Login/Login';
import Colors from '../utils/Colors';
import TabNavigator from './TabNavigator';
import AppIntro from '../container/AppIntro/AppIntro';
import OtpScreen from '../container/OtpScreen/OtpScreen';
import ViewPropertiy from '../container/ViewPropertiy/ViewPropertiy';
import ViewPropertiyImage from '../container/ViewPropertiyImage/ViewPropertiyImage';
import ViewImage from '../container/ViewImage/ViewImage';
import Register from '../container/Register/Register';
import ForgotPassword from '../container/ForgotPassword/ForgotPassword';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import ChatSearch from '../container/Chat/ChatSearch';
import SingleImage from '../container/ViewImage/SingleImage';
import Videoplay from '../container/ViewPropertiy/Videoplay';
import Leaderboard from '../container/MyRewards/Leaderboard';
import Challenges from '../container/MyRewards/Challenges';

import Schoolinfo from '../container/ViewPropertiy/Schoolinfo';

import RecycleBin from '../container/RecycleBin/RecycleBin';
import ViewProperty2 from '../container/ViewPropertiy/ViewProperty2';
import BookaTour from '../container/Chat/BookaTour';
import ChatHistory from '../container/ChatHistory/ChatHistory';


const Stack = createStackNavigator();

const StackNavigator = () => {
  const [route, setRoute] = useState(null);
  const changeScreen = async () => {
    const value = await AsyncStorage.getItem('userId');
    if (value != null && value != '') {
      setRoute('Tabs');
    } else {
      setRoute('Login');
    }
  };

  useEffect(() => {
  }, [])
  useEffect(() => {
    changeScreen();
  }, []);

  return route != null ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.white },
      }}
      initialRouteName={'Login'}
    >
      <Stack.Screen name="BookaTour" component={BookaTour} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="AppIntro" component={AppIntro} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ViewPropertiy" component={ViewPropertiy} />
      <Stack.Screen name="ViewProperty2" component={ViewProperty2} />
      <Stack.Screen name="ViewPropertiyImage" component={ViewPropertiyImage} />
      <Stack.Screen name="ViewImage" component={ViewImage} />
      <Stack.Screen name="ChatSearch" component={ChatSearch} />
      <Stack.Screen name="SingleImage" component={SingleImage} />
      <Stack.Screen name="Videoplay" component={Videoplay} />
      <Stack.Screen name="Challenges" component={Challenges} />
      <Stack.Screen name="Leaderboard" component={Leaderboard} />

      <Stack.Screen name="Schoolinfo" component={Schoolinfo} />

      <Stack.Screen name="RecycleBin" component={RecycleBin} />
      <Stack.Screen name="ChatHistory" component={ChatHistory} />

    </Stack.Navigator>
  ) : null;
};
export default StackNavigator;
