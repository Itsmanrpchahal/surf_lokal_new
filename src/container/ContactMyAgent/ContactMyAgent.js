import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
  Linking
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context';
// import Orientation from 'react-native-orientation-locker';
import Styles from './Styles';
import { useNavigation } from '@react-navigation/native';
import FormData from 'form-data';
import { idText } from 'typescript';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import BASEURl from '../../services/Api'
import LottieView from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import {getAgent} from '../../modules/getAgent';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const images = [
  {
    image: Images.favroites,
    title: '',
    navigation: 'ContactMyAgent',
  },
  {
    image: Images.savedSearch,
    title: 'Saved Searches',
    navigation: 'SavedSearches',
  },
  {
    image: Images.inbox,
    title: 'Conversations',
    navigation: 'Conversations',
  },
  {
    image: Images.contactAgent,
    title: 'Contact My Agent',
    navigation: 'ContactMyAgent',
  },
  {
    image: Images.makeOffer,
    title: 'Make An Offer',
    navigation: 'MakeAnOffer',
  },
  {
    image: Images.reward,
    title: 'My Rewards',
    navigation: 'MyRewards',
  },
  {
    image: Images.recycleBin,
    title: 'Recycle Bin',
    navigation: 'RecycleBin',
  },
];

const ContactMyAgent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [address, setAddress] = useState('');
  const [index, setIndex] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [responseMessage, setResponseMessage] = useState('')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState('')
  const dispatch = useDispatch();

  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const FormData = require('form-data');



  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = () => {
    dispatch(getAgent()).then(response => {
      setAgentData(response.payload.data[0]);
    });
    // dispatch(getAgent()).then(response => {
    //    console.log(" fetchAgentData fetchAgentData ",response)

      // if (response.payload.data === 'Record not found!') {
      //   setShowNoDataMessage(true);
      // } else {
      //   setShowNoDataMessage(false)
      //   setHomeData(response.payload.data);
      // }
    // });

  };
  const makePhoneCall = () => {
    let phoneNumber = agentData?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
    console.log("phoneNumber phoneNumber",phoneNumber)
  };
  const handleEmailLink = () => {
    const email = agentData?.agent_email;

    const subject = '';
    const body = '';

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url)
      .catch(error => console.error('Error opening email app:', error));
  };

  const SendQuickinquiry = () => {



    const data = new FormData();
    data.append('property_address', address);
    data.append('message', message);
    data.append('agent_email', agentData?.agent_email);

    const config = {
      method: 'post',
      url: 'https://surf.topsearchrealty.com/webapi/v1/agent/quick_inquiry.php',
      headers: {
        'Content-Type': 'multipart/form-data',
        Cookie: 'PHPSESSID=4bbd37fb5e2f122c1d7198ec9bd153f1',
      },
      data: data,
    };
    axios.request(config)
      .then(response => {
        Alert.alert('Your data send Successfully');
        setAddress("")
        setMessage("")
        // Continue handling the response data
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  {
    responseMessage ? (
      <Text style={{ color: responseMessage.includes('successfully') ? 'green' : 'red' }}>
        {responseMessage}
      </Text>
    ) : null
  }





  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom: 2,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            position: 'absolute',
            left: 12,
            justifyContent: 'flex-start',
            // top: 12,
            top: 13,
            // backgroundColor:"green",
            width: 50,
            height: 50

          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
              height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              resizeMode: 'contain',
            }}
            source={Images.leftnewarrow}></Image>

        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
              color: Colors.black,
              fontFamily: 'Poppins-Light',
              lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
            }}>
            Contact My Agent
          </Text>

        </View>
        <TouchableOpacity

          style={{
            position: "absolute",
            right: 10,
            top: 15
          }}

          onPress={() => navigation.goBack()}>

          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: '100%', height: "100%", }}>
        <View style={{ width: "100%", alignItems: "center", justifyContent: "center", paddingTop: 40 }}>
          <View style={{ flexDirection: 'column', marginTop: 0, borderRadius: 100, maxWidth: 122, height: 122, width: 122, alignItems: "center", justifyContent: "center", }}>
            <Image source={{uri:agentData?.featured_image_url}} style={{ resizeMode: "contain", maxWidth: 122, height: 122, width: 122, alignItems: "center", justifyContent: "center", }} />
          </View>
          <Text style={{ fontSize: 18, color: "black", fontFamily: "Poppins-SemiBold", paddingTop: 16, textAlign: "center" }}>{agentData?.agent_title}</Text>
        </View>
        <View style={styles.informationicons}>
          <View style={styles.maininfoicons}>
            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#11b03e" }]}
              onPress={() => {
                makePhoneCall()
              }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  // margin: 2,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.telephonecall}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#19a4df" }]}
              onPress={() => { navigation.navigate('ChatSearch') }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.messenger}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#5f3d1c" }]}
              onPress={() => {
                // setModalVisible(true)
                // _onConnectButtonPress()
                // navigation.navigate('Video')
              }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.videochat}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              handleEmailLink()
            }} style={[styles.iconcover, { backgroundColor: Colors.black }]}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.email}
              />
            </TouchableOpacity>



          </View>
        </View>

        <Text style={{ marginBottom: 16, fontSize: 18, textAlign: "center", color: Colors.black, fontFamily: 'Poppins-Regular' }}>
          3010 N Military trl {'\n'}
          Suite 310 {'\n'}
          Boca Raton, FL 33431
        </Text>
        <View style={{ flexDirection: 'column', }}>
          <View
            style={{
              // height: 70,
              width: '90%',
              //  alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginHorizontal: 12,
              borderBottomColor: Colors.BorderColor,
              //   borderBottomWidth: 1

            }}>

          </View>

          <View style={{}}>
            <View style={styles.slideOuter}>
              <TouchableOpacity
                //onPress={() => navigation.navigate(item.navigation)}
                style={{
                  width: '100%',
                  padding: 12
                }}>

                <View style={{
                  flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", textAlign: "center",
                  marginBottom: 8
                }}>

                  <TouchableOpacity
                    onPress={() => makePhoneCall()}
                    style={styles.buttonview}
                  >

                    <Text style={styles.buttonText}>Call
                    </Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEmailLink()}
                    style={styles.buttonview}>

                    <Text style={styles.buttonText}>E-mail
                    </Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ChatSearch')}
                    style={styles.buttonview}>

                    <Text style={styles.buttonText}>Chat
                    </Text>

                  </TouchableOpacity>
                </View>
                <View>

                </View>


              </TouchableOpacity>
            </View>


          </View>


        </View>



        <View style={{
          flexDirection: "row", justifyContent: "center", alignItems: "center",
        }}>

          <LottieView style={{ height: 150, width: 200, }} source={require('../../assets/animations/SurfVan.json')} autoPlay loop />

        </View>

      </ScrollView>


    </SafeAreaView>
  );

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: "100%",
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center", justifyContent: "center",
    width: "100%",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
  },
  buttonview: {
    textAlign: "center",
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    width: "100%",
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 8,
    marginRight: 6,
    alignSelf: "center",
    paddingHorizontal: 18,
    textAlign: "center",
    justifyContent: "center",

  },
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,
    resizeMode: 'contain',

  },
  buttonText: { fontSize: 14, fontWeight: '400', color: Colors.white, fontFamily: 'Poppins-Regular', textAlign: "center" },
  // slideOuter: {
  //   width: "100%",
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: Colors,
  //   borderRadius: 18,
  // },
  mainareacover: { marginHorizontal: 7 },
  iconcover: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,

    padding: 8,
    display: "flex",
    borderRadius: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },


  modalOverlay1: {
    flex: 1,
    alignItems: "center", justifyContent: "center",
    width: "98%",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
  },
  iconcover2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    padding: 8,
    backgroundColor: Colors.PrimaryColor,
    borderRadius: 100, position: "absolute", right: 0, top: 0
  },
  slide: {
    width: screenWidth - 40,
    height: screenHeight / 3,
    borderRadius: 18,
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'contain',
    flexDirection: 'row',
  },
  informationicons: { alignItems: "center", marginBottom: 30, marginTop: 20 },
  maininfoicons: { flexDirection: "row", alignItems: "center" },
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
  // buttonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  // },
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

export default ContactMyAgent;