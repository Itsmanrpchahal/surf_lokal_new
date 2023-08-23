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
import LottieView from 'lottie-react-native';
import { color } from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import { CommonActions, StackActions } from '@react-navigation/native';
const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab1 : Images.firstscreen,
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    image: DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab2 : Images.secondscreen,
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab3 : Images.tutorial3,
    backgroundColor: '#22bcb5',
    renderContent: () => (
      <View style={{ flex: 1 }}>
        <Image
          style={{ height: screenHeight, width: screenWidth, position: 'absolute', top: 0, left: 0,resizeMode:"stretch" }}
          source={Images.tutorial3}// Replace with your image path
        />
        <LottieView
          style={{ height: screenHeight, width: screenWidth }}
          source={require('../../assets/animations/SwipeRight.json')}
          autoPlay
          loop
        />
      </View>
    ),
  },
  {
    key: 4,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: DeviceInfo.getDeviceType() === 'Tablet' ? Images.tab4 : Images.tutorial4,
    renderContent: () => (
      <View style={{ flex: 1 }}>
        <Image
          style={{ height: screenHeight, width: screenWidth, position: 'absolute', top: 0, left: 0, resizeMode:"stretch" }}
          source={Images.tutorial4}// Replace with your image path
        />
        <LottieView
          style={{ height: screenHeight, width: screenWidth }}
          source={require('../../assets/animations/Swipeleft.json')}
          autoPlay
          loop
        />
      </View>
    ),
    backgroundColor: 'black',
  },

];


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

export default function AppIntro({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
//   const renderItem = ({ item }) => {
//     return <Image style={{ 
//  height: screenHeight, 
// width: screenWidth,
//     resizeMode:"contain",
//    // width:"100%",
//      }} source={item.image} />;



     
//   };
const renderItem = ({ item }) => {
  return (
    <View style={{ flex: 1,position:"relative" }}>
      {item.renderContent ? (
        item.renderContent()
      ) : (
        <Image
          style={{
            height: screenHeight,
            width: screenWidth,
            resizeMode: "stretch"
          }}
          source={item.image}
        />
      )}
    </View>
  );
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
      <TouchableOpacity onPress={() => { onDone() }} style={{position:"absolute",right:-50,height:screenHeight,top:0,marginTop:-30}}>
        <View style={{ height: 150, width: 150 }}>
          <LottieView  style={{ height: 100, width: 100 }} source={require('../../assets/animations/SurfVan.json')} autoPlay loop />
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView
      style={{
        height: screenHeight, 
        width: screenWidth,
      }}>
        <ScrollView >
      <AppIntroSlider renderItem={renderItem} 
        data={slides}
        activeDotStyle={{ backgroundColor: "#707070"}}
        dotClickEnabled={true}
        renderDoneButton={renderDone}
      />
      
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  image: {
    height: screenHeight, 
    width: screenWidth,
// resizeMode:"stretch"
  },


});
