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
import BASEURl from '../../services/Api'


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

const ContactSurf = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [address, setAddress] = useState('');
  const [index, setIndex] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [responseMessage, setResponseMessage] = useState('')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState('')
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const FormData = require('form-data');



  useEffect(() => {
    fetchAgentData();
  }, []);


  const fetchAgentData = async () => {
    const id = await AsyncStorage.getItem('userId');

    try {
      const response = await axios.get(
        BASEURl + 'webapi/v1/agent/?userID=' + id
      );
      if (response.data.success) {
        const agentData = response.data.data[0];
        setAgentData(agentData);
      }
    } catch (error) {
    }
  };
  const makePhoneCall = () => {
    let phoneNumber = +18885083174
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const handleEmailLink = () => {
    const email = "homes@surflokal.com"

    const subject = '';
    const body = '';

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url)
      .catch(error => console.error('Error opening email app:', error));
  };
  const whatsapp = () => {
    const phone = "+18885083174"
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${''}`)
  }

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

      {/* <View
        style={{
          marginTop: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,
          marginBottom: 10
        }}>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}>Contact Surf Lokal</Text>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignSelf: 'center',

            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            overflow: 'visible',
            zIndex: 99,
            position: 'absolute',
            top: 10,
          }}>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              position: "absolute",
              right: -12,
              top: -10,

              backgroundColor: Colors.surfblur,
              height: 25,
              width: 25,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <Animatable.Image
              source={Images.whiteclose}
              style={{
                height: 10,
                width: 10,
                resizeMode: 'contain',
                tintColor: Colors.white,
              }}
              animation="flipInY"
            />
          </TouchableOpacity>
        </View>
      </View> */}
      <View
        style={{
          marginTop: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,
          marginBottom: 0,
          // height: 45,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: Colors.BorderColor,
          paddingTop: 10, paddingBottom: 10

        }}>
        <TouchableOpacity style={{ top: 20, flexDirection: "row", alignItems: "center", position: "absolute", left: 8, justifyContent: "center" }} onPress={() => { navigation.goBack() }}>
          <Image
            style={{
              width: 11,
              height: 11,
              resizeMode: "contain",
              // position: "absolute",
              // left: 0,
              marginTop: -1,
              transform: [{ rotate: '90deg' }]
            }}
            source={Images.downArrow}
          ></Image>
          <Text style={{
            fontSize: 14,
            color: Colors.black,
            fontFamily: 'Poppins-Regular', marginLeft: 5
          }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium', paddingTop: 7 }}>Contact surf lokal</Text>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            position: "absolute",
            right: 10,
            top: 10,

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            width: 40,
            borderRadius: 100,
            backgroundColor: Colors.gray,
          }}
          onPress={() => navigation.goBack()}  >
          <Animatable.Image
            source={Images.whiteclose}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>



      <ScrollView style={{ height: '100%', width: '100%' }}>
        <View style={{ flexDirection: 'column', marginTop: 0, alignItems: "center" }}>


          <Image source={Images.appLogo} style={{ maxWidth: 180, resizeMode: "contain", height: 150 }} />


        </View>
        <View style={styles.informationicons}>
          <View style={styles.maininfoicons}>
            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#11b03e" }]}
              onPress={() => makePhoneCall()}
            >
              <Image
                style={{
                  height: 30,
                  width: 30,
                  margin: 2,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.telephonecall}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#19a4df" }]}
              onPress={() => { navigation.navigate('Chat') }}
            >
              <Image
                style={{
                  height: 30,
                  width: 30,
                  margin: 2,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.messenger}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#5f3d1c" }]}
              onPress={() => sendEmail()}
            >
              <Image
                style={{
                  height: 30,
                  margin: 2,
                  width: 30,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.videochat}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconcover, { backgroundColor: Colors.black }]}>
              <Image
                style={{
                  height: 30,
                  margin: 2,
                  width: 30,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.email}
              />
            </TouchableOpacity>



          </View>
        </View>

        <Text style={{ fontSize: 16, textAlign: "center", color: Colors.black, fontFamily: 'Poppins-Regular' }}>
          3010 N Military trl {'\n'}
          Suite 310 {'\n'}
          Boca Raton, FL 33431
        </Text>
        <View style={{ flexDirection: 'column' }}>
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

          <View>
            <View style={styles.slideOuter}>
              <TouchableOpacity
                //onPress={() => navigation.navigate(item.navigation)}
                style={{
                  width: '100%',
                  padding: 12
                }}>

                <View style={{ flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", textAlign: "center", marginBottom: 12 }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ChatSearch", { agentData })}

                    style={styles.buttonview}>
                    <Text style={styles.buttonText}>Request A Showing
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("ChatSearch", { agentData })}
                    style={styles.buttonview}>
                    <Text style={styles.buttonText}>Start Offer
                    </Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ChatSearch", { agentData })}

                    style={styles.buttonview}>

                    <Text style={styles.buttonText}>List My Home
                    </Text>

                  </TouchableOpacity>
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




        <View style={{ height: 50 }}></View>
      </ScrollView>

    </SafeAreaView>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '90deg' }],
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
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 100,
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
  informationicons: { alignItems: "center", marginBottom: 25 },
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

export default ContactSurf;