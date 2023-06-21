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
    changeScreen();
  }, []);

  return route != null ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.white },
      }}
      initialRouteName={route}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="AppIntro" component={AppIntro} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ViewPropertiy" component={ViewPropertiy} />
      <Stack.Screen name="ViewPropertiyImage" component={ViewPropertiyImage} />
      <Stack.Screen name="ViewImage" component={ViewImage} />
      <Stack.Screen name="ChatSearch" component={ChatSearch} />
    </Stack.Navigator>
  ) : null;
};
export default StackNavigator;
