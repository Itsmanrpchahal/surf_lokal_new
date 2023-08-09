import React, { useState, useEffect } from 'react';
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
// For Add Google SignIn
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// Import FBSDK
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { emailCheck } from '../../modules/emailCheck';
import { forgotPassword } from '../../modules/forgotPassword';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

export default function ForgotPassword({ navigation }) {
  const dispatch = useDispatch();
  const [emailId, setEmailId] = useState('tester1.webperfection@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [resetPasswordScreen, setresetPasswordScreen] = useState(true);
  useEffect(() => { }, []);

  const accessRequestAction = () => {
    if (emailId != '') {
      let data = {
        email: emailId,
      };
      dispatch(emailCheck(data)).then(response => {
        if (response.payload.success) {
          setresetPasswordScreen(false);
          setUserId(response.payload.data.UserID);
        } else {
          Alert.alert('Alert', 'Yor are not register with us please register ');
        }
      });
    } else Alert.alert('Alert', 'Enter email');
  };
  const go = () => {
    if (password == '') {
      Alert.alert('Enter password');
    } else if (confirmPassword == '') {
      Alert.alert('Enter confirm password');
    } else if (password != confirmPassword) {
      Alert.alert("Password and Confirm password doesn't match");
    } else {
      let data = {
        userID: userId,
        password: password,
        confirm_pass: confirmPassword,
      };
      dispatch(forgotPassword(data)).then(response => {
        if (response.payload.success) {
          navigation.goBack();
        } else {
          Alert.alert('Alert', 'Yor are not register with us please register ');
        }
      });
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const addDataFromPickr = (name, code) => {
    setCountryName(name);
    setCountryCode(code);
    setModalVisible(false);
  };
  const resetPassword = () => (
    <ScrollView style={Styles.container}>
      <View style={{

        width: '100%',
        position: 'absolute',
        top: 10,
        left: 10

      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 28,
            width: 28,
            borderRadius: 100,
            backgroundColor: Colors.gray,
          }}>
          <Image source={Images.downArrow} style={{
            height: 12,
            width: 12,
            resizeMode: 'contain',
            tintColor: Colors.black,
            transform: [{ rotate: '90deg' }],
          }}></Image>
        </TouchableOpacity>
      </View>
      {/* <View style={Styles.loginView}>
        <Text style={Styles.loginText}>
          Welcome to your local real estate search engine!
        </Text>
      </View>
      <View style={Styles.loginLine}></View>
      <View style={Styles.loginView}>
        <Text style={Styles.signUpText}>Reset Password</Text>
      </View> */}
      <Image source={Images.appLogo} style={Styles.appLogo}></Image>
      <View style={Styles.socialMediaButtons}>
        <TextInput
          allowFontScaling={false}
          style={Styles.inputStyle}
          placeholderTextColor={Colors.textColorLight}
          placeholder={'Email'}
          value={emailId}
          keyboardType="email-address"
          returnKeyType="done"
          onChangeText={emailId => setEmailId(emailId)}
        />
      </View>

      <AppButton
        //onPress={() => setresetPasswordScreen(false)}
        onPress={() => accessRequestAction()}
        btnText={'Continue'}
        textStyle={{
          fontSize: 20 * fontSizeRatio,
          // fontWeight: '500',

          color: Colors.white,
          fontFamily: 'Poppins-Regular'
        }}
        btnStyle={{
          borderRadius: 6,
          backgroundColor: Colors.primaryBlue,
          marginTop: 50,
        }}
      />


    </ScrollView>
  );
  const changePassword = () => (
    <ScrollView style={Styles.container}>
      <View style={Styles.loginView}>
        <Text style={Styles.loginText}>
          Welcome to your local real estate search engine!
        </Text>
      </View>
      <View style={Styles.loginLine}></View>
      <View style={Styles.loginView}>
        <Text style={Styles.signUpText}>Change Password</Text>
      </View>

      <View style={Styles.socialMediaButtons}>
        <TextInput
          allowFontScaling={false}
          style={Styles.inputStyle}
          placeholderTextColor={Colors.textColorLight}
          placeholder={'Password'}
          keyboardType="default"
          returnKeyType="done"
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
      </View>
      <View style={Styles.socialMediaButtons}>
        <TextInput
          allowFontScaling={false}
          style={Styles.inputStyle}
          placeholderTextColor={Colors.textColorLight}
          placeholder={'Confirm Password'}
          keyboardType="default"
          returnKeyType="done"
          secureTextEntry={true}
          onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
        />
      </View>

      <AppButton
        //onPress={() => navigation.navigate('Login')}
        onPress={() => go()}
        btnText={'Continue'}
        textStyle={{
          fontSize: 20 * fontSizeRatio,
          fontWeight: '500',
          color: Colors.white,
        }}
        btnStyle={{
          borderRadius: 6,
          backgroundColor: Colors.primaryBlue,
          marginTop: 50,
        }}
      />

      <Image source={Images.appLogo} style={Styles.appLogo}></Image>
    </ScrollView>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {resetPasswordScreen ? resetPassword() : changePassword()}
    </SafeAreaView>
  );
}
