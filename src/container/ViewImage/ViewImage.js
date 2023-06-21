import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  FlatList,
  ImageBackground,
  Animated,
  Vibration,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;
const filterData = [
  {id: 1, name: 'Filter', image: Images.test},
  {id: 2, name: 'Filter', image: Images.test1},
  {id: 3, name: 'Filter', image: Images.test},
  {id: 4, name: 'Filter', image: Images.test1},
  {id: 5, name: 'New Construction', image: Images.test},
  {id: 6, name: 'Filter', image: Images.test2},
  {id: 7, name: 'Filter', image: Images.test},
  {id: 8, name: 'Filter', image: Images.test1},
  {id: 9, name: 'Filter', image: Images.test},
  {id: 10, name: 'Filter', image: Images.test1},
  {id: 11, name: 'Filter', image: Images.test2},
  {id: 12, name: 'Filter', image: Images.test},
  {id: 13, name: 'Filter', image: Images.test2},
  {id: 14, name: 'Filter', image: Images.test},
];
const ViewImage = props => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const image = props.route.params
  console.log(image);
  // useEffect(() => {
  //   Orientation.lockToPortrait();
  //   return () => {
  //     Orientation.unlockAllOrientations();
  //   };
  // }, []);
  const navigation = useNavigation();
  const renderItem = ({item}) => {
    return <View style={styles.slideOuter}></View>;
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{height: '100%', width: '100%', justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'visible',
            zIndex: 99,
            position: 'absolute',
            top: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: Colors.gray,
            }}>
            <Image
              source={Images.close}
              style={{
                height: 15,
                width: 15,
                resizeMode: 'contain',
                tintColor: Colors.black,
                transform: [{rotate: '90deg'}],
              }}></Image>
          </TouchableOpacity>
        </View>
<Image source={{uri:image.image.guid}} style={styles.slide}></Image>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'contain',
    marginTop: -50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'blue',
  },
  //fliter
  filter: {
    height: 60,
  },
});

export default ViewImage;
