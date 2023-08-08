import React, { useState, useEffect, useRef } from 'react';
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
  SafeAreaView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { useSelector, useDispatch } from 'react-redux';
import AppButton from '../../components/AppButton';
import Styles from './Styles';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from "jwt-decode";

// For Add Google SignIn
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// Import FBSDK
import { LoginManager, AccessToken } from 'react-native-fbsdk';
// Apple
import { appleAuth ,appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'
import { loginUser } from '../../modules/loginUser';
import  {loginPhoneUser} from '../../modules/phonelogin'
import { requestUserPermission, NotificationListerner, } from '../../utils/pushnotifications_helper'
import messaging from '@react-native-firebase/messaging';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  // const [emailId, setEmailId] = useState('');
  const [emailId, setEmailId] = useState('access@wpkraken.io');
  // const [password, setPassword] = useState('');
  const [password, setPassword] = useState('CherryPicker1!');
  const [phone, setPhone] = useState('');
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [cc,setCC] = useState(0)
  const [withEmail, setWithEmail] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    requestUserPermission()
    NotificationListerner()
  }, []);

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return  Platform.OS === 'ios' &&   appleAuthAndroid.isSupported &&  appleAuth.onCredentialRevoked(async () => {
      console.warn('If this function executes, User Credentials have been Revoked');
    });
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
     
      iosClientId:
        '681904798882-imtrbvtauorckhqv4sibieoi51rasda4.apps.googleusercontent.com',
      webClientId:
        '681904798882-r41s7mipcih0gdmsau2ds4c21pq4p476.apps.googleusercontent.com',
    });
   
  }, []);

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
    
    const fcmtoken = await messaging().getToken()

      var formdata = new FormData();
      formdata.append('email', userInfo.user.email);
      formdata.append('username', userInfo.user.name);
      formdata.append('social_id', userInfo.user.id);
      formdata.append('social_token', userInfo.idToken);
      formdata.append('device_type',Platform.OS === 'android' ? 1 :2)
      formdata.append('device_token',fcmtoken)
      setLoading(true);
      dispatch(googleUser(formdata)).then(response => {

        if (response.payload.success) {
          setLoading(false);

          navigation.navigate('AppIntro');
        } else {
          setLoading(false);
          Alert.alert('Alert', response.payload.message);
        }
      });
    } catch (error) {
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.warn('Signin Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.warn('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.warn('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('Error ==> ', error)
      }
    }
  };
  const handleEmailLogin = () => {
    setWithEmail(true);
  };
  const handleAppleLogin = async () => {
    // performs login request
    var formdata = new FormData();
     const fcmtoken = await messaging().getToken()
    Platform.OS === 'ios'
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
     
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      console.log('credentialState', credentialState)
  
      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        console.log('user is authenticated', credentialState)
        console.log('appleAuthRequestResponse ===> ', appleAuthRequestResponse.identityToken)
        var decoded = jwt_decode(appleAuthRequestResponse.identityToken);
        formdata.append('email', decoded.email);
        formdata.append('username', decoded.email);
        formdata.append('social_id', decoded.nonce);
        formdata.append('social_token', appleAuthRequestResponse.identityToken);
        formdata.append('device_type',Platform.OS === 'android' ? 1 :2)
        formdata.append('device_token',fcmtoken)
        console.log('formData ',formdata)
        dispatch(googleUser(formdata)).then(response => {
          if (response.payload.success) {
            setLoading(false);
  
            navigation.navigate('AppIntro');
          } else {
            setLoading(false);
            Alert.alert('Alert', response.payload.message);
          }
        });
      }

  
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      Alert.alert('Alert-', JSON.stringify(result));
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining the access token');
      }
      const { accessToken } = data;
      // Use the access token to make requests to the Facebook API
    } catch (error) {
    }
  };

  // const accessRequestAction = () => {
  //   navigation.navigate('Tabs', {screen: 'Home'});
  // };
  const accessRequestAction = async () => {
    const fcmtoken = await messaging().getToken()
    if (emailId && password != '') {
      if (withEmail) {
        let data = {
          username: emailId,
          password: password,
          device_type: Platform.OS === 'android' ? 1 : 2,
          device_token: fcmtoken
        };
        setLoading(true);
        dispatch(loginUser(data)).then(response => {
          // console.log('fkjdui',response)
          // alert (JSON.stringify (response.payload.data))

          if (response.payload.status) {
            setLoading(false);
            navigation.navigate('AppIntro');
          } else {
            setLoading(false);
            Alert.alert('Alert', response.payload.message);
          }
          
        });
      } else {
        setLoading(false);
        if(phone)
        {
          setLoading(true);
        var formdata = new FormData();
        formdata.append('county_code', cc);
        formdata.append('phone_number', phone);
        formdata.append('device_type',Platform.OS === 'android' ? 1 :2)
        formdata.append('device_token',fcmtoken)
        console.log('formData ',formdata)
          dispatch(loginPhoneUser(formdata)).then(response => {
            if (response.payload.success === true) {
              setLoading(false);
               navigation.navigate('OtpScreen',{cc:cc,phone:phone});
            } else {
              setLoading(false);
              Alert.alert('Alert', response.payload.message);
            }
          });

        } else {
          alert('Enter Phone number')
        }
      }
    } else Alert.alert('Alert', 'Enter email and password');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView style={Styles.container}>
        <View style={Styles.loginView}>
          <Text style={Styles.loginText}>
            Login or sign up to start surfing
          </Text>
        </View>
        <View style={Styles.loginLine}></View>
        {!withEmail ? (
          <View style={Styles.regionUpperView}>
            <View style={Styles.loginContainer}>
              <TouchableOpacity
                onPress={() => { setModalVisible(true) }}
                style={Styles.regionView}>
                <View style={{ width: '85%' }}>
                  <Text allowFontScaling={false} style={Styles.regionText}>
                    Country/Region
                  </Text>
                  <View style={{ flexDirection: 'row',width:"100%",alignItems:"center",justifyContent:"center" }}>
                    {
                      <CountryPicker
                        containerButtonStyle={{width:300,marginLeft:25}}
                        withFilter={true}
                        withCallingCodeButton={true}
                        withCountryNameButton={true}
                        withAlphaFilter={true}
                        withCallingCode={true}
                        onSelect={(data) => {
                          setCountryName(data.name)
                          setCountryCode(data.cca2)
                          setCC(data.callingCode[0])
                        }}
                        withModal={true}
                        onClose={() => { setModalVisible(false) }}
                        countryCode={countryCode}
                      />
                    }

                  </View>

                </View>
                <View>
                  <Image source={Images.downArrow} style={Styles.arrow}></Image>
                </View>
              </TouchableOpacity>
              <View style={Styles.phoneInputView}>
                <TextInput
                  // ref={phoneNumber}
                  style={Styles.inputStyle}
                  placeholderTextColor={Colors.textColorLight}
                  placeholder={'Phone Number'}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  secureTextEntry={false}
                  maxLength={12}
                  value={phone}
                  onChangeText={value=>{setPhone(value)}}
                />
              </View>
            </View>
            <View style={{ width: '85%', marginTop: 20 * viewSizeRatio }}>
              <Text allowFontScaling={false} style={Styles.alertText}>
                We''ll call or text to confirm your number. Standard {'\n'}
                message and data rates apply.
              </Text>
            </View>

          </View>
        ) : (
          <View style={Styles.regionUpperView}>
            <View style={Styles.loginContainer}>
              <TextInput
                allowFontScaling={false}
                style={Styles.inputStyle}
                placeholderTextColor={Colors.textColorLight}
                placeholder={'Email'}
                keyboardType="default"
                returnKeyType="done"
                value={emailId}
                onChangeText={emailId => setEmailId(emailId)}
              />
              <View style={Styles.phoneInputView}>
                <TextInput
                  allowFontScaling={false}
                  style={Styles.inputStyle}
                  placeholderTextColor={Colors.textColorLight}
                  placeholder={'Password'}
                  keyboardType="default"
                  returnKeyType="done"
                  value={password}
                  secureTextEntry={true}
                  onChangeText={password => setPassword(password)}
                />
              </View>
            </View>
            <View style={{ width: '85%', marginTop: 20 * viewSizeRatio }}>
              <Text allowFontScaling={false} style={Styles.alertText}>
                Please enter your email & password registerd with us and
                start surfing
              </Text>
            </View>
          </View>
        )}

        <AppButton
          onPress={() => accessRequestAction()}
          // onPress={() => go()}
          loading={loading}
          btnText={'Continue'}
          textStyle={{
            fontSize: 20 * fontSizeRatio,
            fontWeight: '500',
            color: Colors.white,
            fontFamily: 'Poppins-Regular'
          }}
          btnStyle={{
            borderRadius: 6,
            backgroundColor: Colors.primaryBlue,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '85%',
            marginTop: 20 * viewSizeRatio,
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: Colors.primaryBlue,
                fontFamily: 'Poppins-Regular'
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <View style={{ width: '5%', alignItems: 'center' }}>
            <View
              style={{
                height: 15,
                backgroundColor: Colors.PrimaryColor,
                width: 2,
              }}></View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: Colors.primaryBlue,
                fontFamily: 'Poppins-Regular'
              }}>
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={Styles.orView}>
          <View style={Styles.line}></View>
          <Text allowFontScaling={false} style={Styles.orText}>
            Or
          </Text>
          <View style={Styles.line}></View>
        </View> */}

        {!withEmail ? (
          <TouchableOpacity
            onPress={() => handleEmailLogin()}
            style={Styles.socialMediaButtons}>
            <Image
              source={Images.email}
              style={Styles.socialMediaButtonsImage}></Image>
            <Text
              allowFontScaling={false}
              style={Styles.socialMediaButtonsText}>
              Continue with email
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setWithEmail(false)}
            style={Styles.socialMediaButtons}>
            <Image
              source={Images.contactAgent}
              style={Styles.socialMediaButtonsImage}></Image>
            <Text
              allowFontScaling={false}
              style={Styles.socialMediaButtonsText}>
              Continue with phone
            </Text>
          </TouchableOpacity>
        )}

        {Platform.OS != 'android' ? (
          <TouchableOpacity
            onPress={() => handleAppleLogin()}
            style={Styles.socialMediaButtons}>
            <Image
              source={Images.apple}
              style={Styles.socialMediaButtonsImage}></Image>
            <Text
              allowFontScaling={false}
              style={Styles.socialMediaButtonsText}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => googleLogin()}
          style={Styles.socialMediaButtons}>
          <Image
            source={Images.google}
            style={Styles.socialMediaButtonsImage}></Image>
          <Text allowFontScaling={false} style={Styles.socialMediaButtonsText}>
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleFacebookLogin()}
          style={Styles.socialMediaButtons}>
          <Image
            source={Images.facebook}
            style={Styles.socialMediaButtonsImage}></Image>
          <Text allowFontScaling={false} style={Styles.socialMediaButtonsText}>
            Continue with facebook
          </Text>
        </TouchableOpacity>

        <Image source={Images.appLogo} style={Styles.appLogo}></Image>
      </ScrollView>
    </SafeAreaView>
  );
}
