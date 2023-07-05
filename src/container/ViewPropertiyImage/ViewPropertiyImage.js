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
  Linking,
  ActivityIndicator
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { getPopertiesDetails } from '../../modules/getPopertiesDetails';
import { useDispatch } from 'react-redux';
import { getAgent } from '../../modules/getAgent';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const ViewPropertiyImage = props => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [video, setvideo] = useState([]);
  const [orientation, setOrientation] = useState('portrait');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(0);
  const [agentData,setAgentData]=useState([])
  const flatListRef = useRef(null);
  const postID = props.route.params
  console.log(postID.postid, "ViewPropertiyImage Props");
  const property = data[0];
  console.log(property, "ViewPropertiyImage dataa");


 
  useEffect(() => {
    getPopertiesDetailsApiCall();
    getAgentApicall();
    

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
      Dimensions.removeEventListener('change', handleChangeOrientation);
    };
  }, []);
  const getPopertiesDetailsApiCall = () => {
    setLoading(true);
    dispatch(getPopertiesDetails(postID.postid)).then(response => {
      console.log("ViewPropertiyImage Response", response)
      setLoading(false);
      setData(response.payload.data);
      console.log(data, "dddddddddddddddddddddd");
    });
  };
  const getAgentApicall = () =>{
    dispatch(getAgent()).then(response =>{
      console.log('rrrohan',response.payload.data);
      setAgentData(response.payload.data);
      

    });
  }
  const makePhoneCall = () => {
    let phoneNumber =agentData[0]?. agent_phone ;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleChangeOrientation = () => {
    setOrientation(isPortrait() ? 'portrait' : 'landscape');
  };

  const navigation = useNavigation();
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>

      <View style={{ height: '88%', width: '100%' }}>
        <ScrollView>
        <View style={{ height: 200, width: "100%", }}>
        <WebView
        style={{height:400,width:"100%",}}
          source={{ uri: property?.property_gallery.property_video}}
          // onLoad={console.log("loaded")}
        />
      </View>
          {property?.property_gallery.Gallery && property?.property_gallery.Gallery.length > 0 ? (
            property?.property_gallery.Gallery.map((image, index) => (
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
          )}
     
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
              <TouchableOpacity onPress={()=>makePhoneCall()  }>
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
            </TouchableOpacity>
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  slide: {
    width: screenWidth,
    height: screenHeight / 2.5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "yellow"
  },
});

export default ViewPropertiyImage;
