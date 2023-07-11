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
    console.log(id,"Agenyt id");

    try {
      const response = await axios.get(
        'https://surf.topsearchrealty.com/webapi/v1/agent/?userID='+id
      );
      if (response.data.success) {
        const agentData = response.data.data[0];
        console.log('Agent Data:', agentData);
        setAgentData(agentData);
      }
    } catch (error) {
      console.log('Error fetching agent data:', error);
    }
  };
  const makePhoneCall = () => {
    let phoneNumber =agentData?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
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
        console.log(response.data);
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
          width: '90%',
          height: 60,
          justifyContent: 'space-around',
          alignSelf: 'center',
          alignItems: 'center',
          marginLeft: 70
        }}>
        <Text style={{ fontSize: 20, color: Colors.black,fontFamily:'Poppins-Regular' }}>
          Contact My Agent
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            alignItems: 'center',

            justifyContent: 'center',
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
      <View
        style={{
          height: 70,
          width: '80%',
          alignSelf: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {!index ? (
            <Image
              source={Images.search}
              style={{
                height: 30,
                width: 30,
                resizeMode: 'contain',
              }}></Image>
          ) : (
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 50,
                // backgroundColor: Colors.primaryBlue,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
             <Image source={{uri:agentData?.featured_image_url}} style={{height:30,width:30,marginRight:20}}/>
            </View>
          )}
        </TouchableOpacity>

        <Text style={{ fontSize: 24, color: Colors.black, marginLeft: 10 ,fontFamily:'Poppins-Regular'}}>
        {agentData ? `${agentData?.agent_title} ${agentData?.last_name}` : 'No Agent Data'}
        </Text>
      </View>
      {agentData? (
      <ScrollView style={{ height: '100%', width: '100%' }}>
        
        
        
        <View>

        <View style={styles.slideOuter}>
          <TouchableOpacity onPress={()=>makePhoneCall()}
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '80%',
                height: 60,
                alignItems: 'center',
              }}>
              <Image
                source={Images.call}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>

              <Text
                style={{
                  fontSize: 18,
                  color: Colors.textColorLight,
                  marginLeft: 20,
                  fontFamily:'Poppins-Regular'
                }}>
                {agentData?.agent_phone}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: Colors.BorderColor,
              }}></View>
          </TouchableOpacity>
        </View>

        <View style={styles.slideOuter}>
          <TouchableOpacity
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '80%',
                height: 60,
                alignItems: 'center',
              }}>
              <Image
                source={Images.agentTel}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>

              <Text
                style={{
                  fontSize: 18,
                  color: Colors.textColorLight,
                  marginLeft: 20,
                  fontFamily:'Poppins-Regular'
                }}>
                {agentData?.agent_email}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: Colors.BorderColor,
              }}></View>
          </TouchableOpacity>
        </View>


        <View style={styles.slideOuter}>
          <TouchableOpacity
            //onPress={() => navigation.navigate(item.navigation)}
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
         
                  <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:10}}>


              <TouchableOpacity
                onPress={() => navigation.navigate("ChatSearch",{agentData})}
                style={{
                  height: 30,
                  borderRadius: 8,
                width: 150,

                  marginTop: 10,
                  marginRight: '10%',
                  backgroundColor: Colors.primaryBlue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // alignSelf: 'flex-end',
                  flexDirection: 'row',
                  margin:10

                }}>
                {/* <Image
                  source={Images.lokal}
                  resizeMode="contain"
                  style={{ height: 15, width: 15, tintColor: Colors.white }}></Image> */}
                <Text style={{ fontSize: 16, fontWeight: '300', color: Colors.white ,fontFamily:'Poppins-Regular'}}>
                  Make Offer
                </Text>

              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ChatSearch",{agentData})}

                style={{
                  height: 30,
                  borderRadius: 8,
                width: 150,
                  marginTop: 10,
                  marginRight: '10%',
                  backgroundColor: Colors.primaryBlue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  flexDirection: 'row',
                  margin:10

                }}>
               
                <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.white,fontFamily:'Poppins-Regular' }}>
                  List My Home
                </Text>

              </TouchableOpacity>


            </View>
            <View>
            <TouchableOpacity
                onPress={() => navigation.navigate("ChatSearch",{agentData})}

                style={{
                  height: 30,
                  borderRadius: 8,
                width: 150,

                  marginTop: 10,
                  marginRight: '10%',
                  backgroundColor: Colors.primaryBlue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  flexDirection: 'row',
                  margin:10

                }}>
                {/* <Image
                  source={Images.lokal}
                  resizeMode="contain"
                  style={{ height: 15, width: 15, tintColor: Colors.white }}></Image> */}
                <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.white,fontFamily:'Poppins-Regular' }}>
                  Request Showing
                </Text>

              </TouchableOpacity>
            </View>

            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: Colors.BorderColor,
              }}></View>
          </TouchableOpacity>
        </View>
        </View>
              {/* ) : null} */}



        <View
          style={{
            flexDirection: 'row',
            width: '80%',
            marginTop: 10,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.textColorLight,
              fontFamily:'Poppins-Regular'
            }}>
            Quick Inquiry
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '80%',
            marginTop: 10,
            height: 35,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
          }}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black, fontSize: 12, }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Propertity Address'}
            keyboardType="default"
            returnKeyType="done"
            value={address}
            onChangeText={text => setAddress(text)}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '80%',
            marginTop: 20,
            height: 150,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            alignItems: 'flex-start',
          }}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black, fontSize: 12 }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Message'}
            keyboardType="default"
            returnKeyType="done"
            multiline={true}
            onChangeText={text => setMessage(text)}
            value={message}
          />
        </View>
        <TouchableOpacity
          onPress={SendQuickinquiry}
          style={{
            height: 30,
            borderRadius: 8,
            width: 100,
            marginTop: 10,
            marginRight: '10%',
            backgroundColor: Colors.primaryBlue,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
            flexDirection: 'row',
          }}>
          {/* <Image
            source={Images.lokal}
            resizeMode="contain"
            style={{ height: 15, width: 15, tintColor: Colors.white }}></Image> */}
          <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.white,fontFamily:'Poppins-Regular' }}>
            Send
          </Text>

        </TouchableOpacity>
        
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
  slideOuter: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
    borderRadius: 18,
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

export default ContactMyAgent;
