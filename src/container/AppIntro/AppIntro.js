import React, {useState, useEffect} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import Styles from './Styles';
import AppIntroSlider from 'react-native-app-intro-slider';
const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: Images.slide1,
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    image: Images.slide2,
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: Images.slide3,
    backgroundColor: '#22bcb5',
  },
  {
    key: 4,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: Images.slide4,
    backgroundColor: '#59b2ab',
  },
  {
    key: 5,
    title: 'Title 2',
    text: 'Other cool stuff',
    image: Images.slide5,
    backgroundColor: '#febe29',
  },
];
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

export default function AppIntro({navigation}) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const renderItem = ({item}) => {
    return <Image style={styles.image} source={item.image} />;
  };
  const onDone = () => {
    navigation.navigate('Tabs', {screen: 'Home'});
  };
  return (
    <SafeAreaView
      style={{
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        //backgroundColor: Colors.primaryBlue,
      }}>
      <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: '100%',
    resizeMode: 'contain',
  },
});
