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
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Orientation from 'react-native-orientation-locker';
import Styles from './Styles';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-crop-picker';
import { getProfile } from '../../modules/getProfile';
import { useSelector, useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {logOut} from '../../modules/logOut';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const Settings = props => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [address, setAddres] = useState('');
  const [mob, setMob] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [toggle, setToggle] = useState(false);
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [threads, setThreads] = useState('')
  const [details, setDetails] = useState([]);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [image, setImage] = useState('')
  const detials = props.route.params.data;
  const dispatch = useDispatch();
  const [propertyChat, setPropertyChat] = useState([])

  const _pickImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
    }).then(res => {
      let uriResponse = res.path;
      let name = res.path.split('/').pop();
      let type = res.mime;
      setImage(uriResponse)
      uploadFile(uriResponse, name, type);
    }).catch(error => {
    });
  };

  const getProfileApiCall = () => {
    dispatch(getProfile()).then(response => {
      setLoading(false);
      setFirstName(response.payload.data[0].first_name);
      setLastName(response.payload.data[0].last_name);
      setAddres(response.payload.data[0].address);
      setEmail(response.payload.data[0].user_email)
      setMob(response.payload.data[0].mobile);
      setImage(response.payload.data[0]?.user_image)
      setFacebook(response.payload.data[0]?.facebook)
      setInstagram(response.payload.data[0]?.instagram)
      setThreads(response.payload.data[0]?.threads)
      setTwitter(response.payload.data[0]?.twitter)
      setLinkedin(response.payload.data[0]?.linkedin)
      console.log(JSON.stringify(response))
    }).catch((e) => {
    });
  };

  useEffect(() => {
    getProfileApiCall()
  }, [])


  const uploadFile = async (uriResponse, name, type,) => {
    // setLoading(true);
    const userID = await AsyncStorage.getItem('userId');

    let data = new FormData();
    data.append("userID", userID)
    data.append('userimage', {
      uri: uriResponse,
      type: type,
      name: name,
    });
    try {
      var res = await axios.post(
        'https://www.surflokal.com/webapi/v1/profile/',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ).then((res) => {
        if (res.status === 200) {
          getProfileApiCall();
        } else {
          Alert.alert('something went wrong!.');
          setLoading(false);
        }
      });


    } catch (err) {
      setLoading(false);
    }
  };
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setToggle(!isEnabled);
  }
  useEffect(() => {

  }, []);


  const saveFile = async () => {
    setLoading(true);
    const userID = await AsyncStorage.getItem('userId');
    const headers = {
      'Content-Type': 'application/json',
    };
    let data = new FormData();
    data.append('UserID', userID);
    data.append('first_name', firstName);
    data.append('last_name', lastName);
    data.append('user_address', address);
    data.append('mobile', mob);
    data.append('email_notification', toggle)
    data.append('facebook', facebook)
    data.append('twitter', twitter)
    data.append('linkedin', linkedin)
    data.append('instagram', instagram)
    data.append('threads', threads)
    try {
      var res = await axios.post(
        'https://www.surflokal.com/webapi/v1/userprofile/profileupdate.php',
        data,
      );

      if (res.status == 200) {
        setLoading(false);
        Alert.alert(res.data.message);
        navigation.goBack();
      } else {
        setLoading(false);
        Alert.alert('something went wrong!.');
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          // marginLeft:80,
          width: '100%',
          // height: 60,
          justifyContent: 'space-between',
          alignSelf: 'center',
          alignItems: 'center',
          paddingVertical: 6,
          paddingHorizontal:16,
          marginTop:DeviceInfo.getDeviceType() === 'Tablet'?20:0
        }}>
        <TouchableOpacity
          onPress={() => { _pickImage() }}
          activeOpacity={0.5}
          style={{
            height:40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.primaryBlue,
            borderRadius: 50

          }}>
          <View
            style={{
              height:DeviceInfo.getDeviceType() === 'Tablet'?60:35,
              width: DeviceInfo.getDeviceType() === 'Tablet'?60:35,
              borderRadius: DeviceInfo.getDeviceType() === 'Tablet'?100:20,
              backgroundColor: Colors.primaryBlue,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            {image != null ? (
              <Image
                style={{ height: DeviceInfo.getDeviceType() === 'Tablet'?65:40, width: DeviceInfo.getDeviceType() === 'Tablet'?65:40}}
                source={{ uri: image }}
              />
            ) : (
              <Text style={{ fontSize: 17, color: Colors.white }}>JD</Text>
            )}
            {/* <Loader loading={loading} /> */}
          </View>

        </TouchableOpacity>

        <Text style={{   fontSize: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
              color: Colors.black,
              fontFamily: 'Poppins-Light',
              lineHeight: DeviceInfo.getDeviceType() === 'Tablet'?42:22, }}>Settings</Text>


        <TouchableOpacity
          style={{
           
          }}

          onPress={() => navigation.goBack()}>

          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>


      </View>

      <KeyboardAwareScrollView style={{ height: '100%', width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            //marginTop: 20,
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginTop: 22,
            marginBottom: 20,paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?27:18,
              color: Colors.black,
              fontFamily: 'Poppins-SemiBold',
              color: Colors.darbluec
            }}>
            Allow Notfication ?
          </Text>
         
            <Switch
              trackColor={{ false: '#767577', true: '#11b03e' }}
              thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{position:"absolute", right:10}}
            />

          </View>
       
        {/* <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 6,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              fontFamily: 'Poppins-Regular'
            }}>
            User Details
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16

          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            First Name
          </Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }}
          placeholderTextColor={Colors.black}
          value={firstName}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={firstName => setFirstName(firstName)}
        />

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            Last Name
          </Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }}
          placeholderTextColor={Colors.black}
         
          value={lastName}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={lastName => setLastName(lastName)}
        />


        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            Email
          </Text>
        </View>


        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }}
          placeholderTextColor={Colors.black}
          value={email}
          keyboardType="default"
          returnKeyType="done"
          editable={false}
          onChangeText={email => setEmail(email)}

        />


        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            Phone
          </Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }}
          placeholderTextColor={Colors.textColorLight}
          value={mob}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={mob => setMob(mob)}
        />


        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            Address
          </Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }}
          placeholderTextColor={'black'}
          value={address}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={address => setAddres(address)}
        />


        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            Facebook
          </Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }} placeholder='Facebook'
          placeholderTextColor={'black'}
          keyboardType="default"
          returnKeyType="done"
          value={facebook}
          onChangeText={facebook => setFacebook(facebook)}
        />


        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            X (formerly known as twitter)
          </Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }} placeholder='Twitter'
          placeholderTextColor={'black'}
          value={twitter}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={twitter => setTwitter(twitter)}
        />


        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            Instagram
          </Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }} placeholder='Instagram'
          placeholderTextColor={'black'}
          value={instagram}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={instagram => setInstagram(instagram)}
        />


        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 6,
            alignSelf: 'center',
            paddingHorizontal:16
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              opacity: .6
            }}>
            Threads
          </Text>
        </View>

        <TextInput
          allowFontScaling={false}
          style={{
            color: Colors.black,
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            borderRadius: 8,
            fontFamily: 'Poppins-Regular',
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14,
            padding: 10,
            borderColor: Colors.BorderColor,
            borderWidth: 1,
            marginBottom: 17
          }} placeholder='Threads'
          placeholderTextColor={'black'}
          value={threads}
          keyboardType="default"
          returnKeyType="done"
          onChangeText={threads => setThreads(threads)}
        />


        <View style={{ paddingHorizontal: 22, marginTop: 20, justifyContent: 'space-between', marginHorizontal: 0, width: "100%", flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={async () => {
          await dispatch(logOut()).then(response => {
            if (
              response.payload.data?.status
            ) {
                AsyncStorage.clear();
               navigation.navigate("Login")
            } else{
              navigation.navigate("Login")
            }
           })
          }}
            style={{ flexDirection: 'row', alignItems: "center" }}>
            <Image source={Images.signOut} style={{ height: 20, width: 20 }} />
            <Text style={{ marginLeft: 6,fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:16, color: "black", fontFamily: 'Poppins-Regular' }}>Signout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => saveFile()}
            style={{
              height:  DeviceInfo.getDeviceType() === 'Tablet'?50:45,
              width: 130,
              borderRadius: 100,
              backgroundColor: Colors.surfblur,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',


            }}>
            {loading ? (
              <ActivityIndicator size={'small'} color={'#fff'} />
            ) : (
              <View
                style={{
                  width: '100%',

                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,

                }}>

                <Text
                  style={{
                fontSize: DeviceInfo.getDeviceType() === 'Tablet'?20:14,

                    color: Colors.white,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Update
                </Text>

              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }}></View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slideOuter: {
    width: screenWidth,
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
    fontFamily: 'Poppins-Regular'
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular'
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
  }, screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imagedata: {
    height:DeviceInfo.getDeviceType() === 'Tablet'?38:19,
    width: DeviceInfo.getDeviceType() === 'Tablet'?50:29,
    resizeMode: 'contain',
    // transform: [{ rotate: '90deg' }],
  },
});

export default Settings;
