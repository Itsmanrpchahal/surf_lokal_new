import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import Styles from './Styles';
import AppIntroSlider from 'react-native-app-intro-slider';

import { color } from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import { CommonActions, StackActions } from '@react-navigation/native';
const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab1 : Images.slideImage0,
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    image: DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab2 : Images.slideImage1,
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab3 : Images.slideImage2,
    backgroundColor: '#22bcb5',
  },
  {
    key: 4,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab4 : Images.lastscreen,
    backgroundColor: 'black',
  },

  // {
  //   key: 5,
  //   title: 'Title 2',
  //   text: 'Other cool stuff',
  //   image: Images.slide5,
  //   backgroundColor: '#febe29',
  // },
];
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

export default function AppIntro({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const renderItem = ({ item }) => {
    return <Image style={{ height: screenHeight, width: screenWidth }} source={item.image} />;
  };
  const onDone = () => {

    const resetAction = CommonActions.reset({
      index: 1,
      routes: [{ name: 'Tabs', params: { screen: 'Home' } }]
    });
    navigation.dispatch(resetAction);
  };

  const renderNext = () => {
    return (
      <Text style={{ color: Colors.PrimaryColor, marginRight: 16, fontSize: 16, marginTop: 10 }}
      >Next</Text>
    )
  }

  const renderDone = () => {
    return (
      <TouchableOpacity onPress={() => { onDone() }}>
        <Text style={{ color: Colors.PrimaryColor, marginRight: 16, fontSize: 16, marginTop: 10 ,opacity:0}}
        >Done</Text>
      </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView
      style={{
        height: screenHeight,
        width: screenWidth,
        justifyContent: 'center',

        //backgroundColor: Colors.primaryBlue,
      }}>
      <AppIntroSlider renderItem={renderItem}
        data={slides}
        activeDotStyle={{ backgroundColor: Colors.PrimaryColor }}
        dotClickEnabled={true}
        renderDoneButton={renderDone}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  image: {
    width: screenWidth,

    height: screenWidth,
   resizeMode:"contain"

  },
});
