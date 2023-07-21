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
        'https://surf.topsearchrealty.com/webapi/v1/agent/?userID=' + id
      );
      if (response.data.success) {
        const agentData = response.data.data[0];
        setAgentData(agentData);
      }
    } catch (error) {
    }
  };
  const makePhoneCall = () => {
    let phoneNumber = agentData?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
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
          marginTop: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,
          alignItems: "center",
          paddingVertical: 12
        }}>
        <Text style={{ fontSize: 20, color: Colors.black, fontFamily: 'Poppins-Regular' }}>
          Contact Surf Lokal
        </Text>
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
              right:-12,
              top: -6,

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
      </View>
      <View
        style={{
          // height: 70,
          width: '90%',
          //  alignSelf: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: 12,
          borderBottomColor: Colors.BorderColor,
          borderBottomWidth: 1,

        }}>
        <TouchableOpacity
          style={{
            // height: 40,
            // width: 40,
            //justifyContent: 'center',
            //  alignItems: 'center',

          }}>
          {!index ? (
            <Image
              source={Images.search}
              style={{
                height: 18, width: 18, resizeMode: 'contain'
              }}></Image>
          ) : (
            <View
              style={{
                // height: 40,
                //  width: 40,
                //  borderRadius: 50,
                // backgroundColor: Colors.primaryBlue,
                // justifyContent: 'center',
                //alignItems: 'center',
              }}>
              <Image source={{ uri: agentData?.featured_image_url }} style={{ height: 55, width: 20 }} />
            </View>
          )}
        </TouchableOpacity>

        <Text style={{
          fontSize: 16,
          color: Colors.newgray,
          marginLeft: 8,
          fontFamily: 'Poppins-Regular'
        }}>
          {agentData ? `${agentData?.agent_title} ${agentData?.last_name}` : 'No Agent Data'}
        </Text>
      </View>
      {agentData ? (
        <ScrollView style={{ height: '100%', width: '100%' }}>



          <View>

            <View style={styles.slideOuter}>
              <TouchableOpacity onPress={() => makePhoneCall()}
                style={{
                  width: '90%',
                  alignItems: 'center',
                  marginHorizontal: 12,
                  borderBottomColor: Colors.BorderColor,
                  borderBottomWidth: 1,
                  marginHorizontal: 12,
                  paddingVertical: 12
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',

                    alignItems: 'center',

                  }}>
                  <Image
                    source={Images.call}
                    style={{ height: 18, width: 18, resizeMode: 'contain' }}></Image>

                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.newgray,
                      marginLeft: 8,
                      fontFamily: 'Poppins-Regular'

                    }}>
                    {agentData?.agent_phone}
                  </Text>
                </View>

              </TouchableOpacity>
            </View>
            <View style={styles.slideOuter}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ChatSearch')}
                style={{
                  width: '90%',
                  alignItems: 'center',
                  marginHorizontal: 12,
                  borderBottomColor: Colors.BorderColor,
                  borderBottomWidth: 1,
                  marginHorizontal: 12,
                  paddingVertical: 12

                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: "center"
                  }}>
                  <Image
                    source={Images.chat}
                    style={{ height: 18, width: 18, resizeMode: 'contain' }}></Image>

                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.newgray,
                      marginLeft: 8,
                      fontFamily: 'Poppins-Regular'
                    }}>
                    Send {agentData?.first_name} a Message
                  </Text>
                </View>

              </TouchableOpacity>
            </View>
            <View style={styles.slideOuter}>
              <TouchableOpacity
                onPress={() => handleEmailLink()}
                style={{
                  width: '90%',
                  alignItems: 'center',
                  marginHorizontal: 12,
                  borderBottomColor: Colors.BorderColor,
                  borderBottomWidth: 1,
                  marginHorizontal: 12,
                  paddingVertical: 12

                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: "center"
                  }}>
                  <Image
                    source={Images.agentTel}
                    style={{ height: 18, width: 18, resizeMode: 'contain' }}></Image>

                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.newgray,
                      marginLeft: 8,
                      fontFamily: 'Poppins-Regular'
                    }}>
                    {agentData?.agent_email}
                  </Text>
                </View>

              </TouchableOpacity>
            </View>


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
                    {/* <Image
                  source={Images.lokal}
                  resizeMode="contain"
                  style={{ height: 15, width: 15, tintColor: Colors.white }}></Image> */}
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

          <View style={{ height: 50 }}></View>
        </ScrollView>
      ) : null}
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
    backgroundColor: "#1b74e4",
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
  buttonText: { fontSize: 14, fontWeight: '400', color: Colors.white, fontFamily: 'Poppins-Regular', textAlign: "center" },
  // slideOuter: {
  //   width: "100%",
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: Colors,
  //   borderRadius: 18,
  // },
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