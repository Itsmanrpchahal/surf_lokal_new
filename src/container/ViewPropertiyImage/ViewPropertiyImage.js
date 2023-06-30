import React, { useState, useEffect, useRef } from 'react';
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

} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { getPopertiesDetails } from '../../modules/getPopertiesDetails';
import { useDispatch } from 'react-redux';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const ViewPropertiyImage = props => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [video, setvideo] = useState([]);
  const [orientation, setOrientation] = useState('portrait');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const postID = props.route.params
  console.log(postID, "ViewPropertiyImage Props");


  useEffect(() => {
    getPopertiesDetailsApiCall();

    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    const handleChangeOrientation = () => {
      setOrientation(isPortrait() ? 'portrait' : 'landscape');
    };

    // Add event listener for orientation changes
    Dimensions.addEventListener('change', handleChangeOrientation);

    // Clean up the event listener when the component unmounts
    return () => {
      // Dimensions.removeEventListener('change', handleChangeOrientation);
    };
  }, []);
  const getPopertiesDetailsApiCall = () => {
    console.log("data", postID)
    dispatch(getPopertiesDetails(postID)).then(response => {
      console.log("api response ViewPropertiyImage", response.payload.data[0])
      if (response.payload.data == null) {
        console.log("hello world")
        setLoading(true);
      }
      else {
        setLoading(false)
      }
      setData(response.payload.data[0].property_gallery );
      console.log(Data, "image full data");
      //   const mapp =data.map((item) => item.property_category);
      // console.log(mapp, "calculator")

    });
  };
  const handleChangeOrientation = () => {
    setOrientation(isPortrait() ? 'portrait' : 'landscape');
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
         
      <View style={{ height: '88%', width: '100%' }}>
        <ScrollView>
        <View style={{ height: 200, width: "100%", }}>
        <WebView
        style={{height:400,width:"100%",}}
          source={{ uri: Data?.property_video}}
          onLoad={console.log("loaded")}
        />
      </View>
          {/* {postID.data.property_gallery && postID.data.property_gallery.length > 0 ? (
            postID.data.property_gallery.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate('ViewImage', { image })
                }
                style={styles.slideOuter}
              >
                <Image
                  source={{ uri: image.guid }}
                  style={styles.slide}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text>No images found.</Text>
          )} */}
     
        </ScrollView>
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
                transform: [{ rotate: '90deg' }],
              }}></Image>
          </TouchableOpacity>
        </View>
      
      </View>
      

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 70,
          marginTop: 10,
          justifyContent: 'center',
          borderTopWidth: 1,
         
          borderTopColor: Colors.textColorLight,
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <View
          style={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignContent: 'center',
            width: '50%',
            flexDirection: 'row',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <Image
              source={Images.reviews}
              style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                textAlign: 'center',
                marginLeft: 5,
                fontFamily: 'Poppins-Regular'
              }}>
              Rate Property
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.contactUs}
              style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                textAlign: 'center',
                marginLeft: 5,
                fontFamily: 'Poppins-Regular'
              }}>
              Call us
            </Text>
          </View>
        </View>
        <View
          style={{
            //justifyContent: 'center',
            //alignItems: 'center',
            width: '50%',
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: Colors.primaryBlue,
              borderRadius: 14,
              height: 40,
              width: '80%',
            }}>
            <Image
              source={Images.bookTour}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 16,
                color: Colors.white,
                textAlign: 'center',
                marginLeft: 5,
                fontFamily: 'Poppins-Regular'
              }}>
              Book a tour
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.white,
  },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  slide: {
    width: screenWidth,
    height: screenHeight / 4,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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

export default ViewPropertiyImage;
