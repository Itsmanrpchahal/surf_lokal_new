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
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { register } from '../../modules/register';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

export default function Register({ navigation }) {
  const dispatch = useDispatch();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [address, setAddress] = useState('');

  const getData = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (id !== null) {
      navigation.navigate('Tabs', { screen: 'Home' });
    }
  };

  const accessRequestAction = () => {
    if (userName == '') {
      Alert.alert('Please enter user name');
    } else if (emailId) {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(emailId) === true) {
        if (phone == '') {
          Alert.alert('Please enter phone number');
     
        }
        else if (password == '') {
          Alert.alert('Please enter passoword');
        } else if (confirmPassword == '') {
          Alert.alert('Retype password');
        } else if (password != confirmPassword) {
          Alert.alert("Password and Retype password doesn't match");
        } else {
          userRegisterApiCall();
        }
      } else {
        if (emailId == '') {
          Alert.alert('Enter Email Address');
        } else {
          Alert.alert('Email is Invalid');
        }
      }
      //
    }
  };
  const userRegisterApiCall = () => {
    let data = {
      username: userName,
      email: emailId,
      mobile: phone,
      user_address: address,
      password: password,
    };

    const formData = new FormData()
    formData.append('username', userName)
    formData.append('email', emailId)
    formData.append('mobile', phone)
    formData.append('user_address', address)
    formData.append('password', password)
    dispatch(register(formData)).then(response => {
      console.log('register ==>', response)
      if (response.payload.success == true) {
        Alert.alert(response.payload.message);
        navigation.goBack();
      } else {
        Alert.alert(response.payload.data);
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>

      <ScrollView style={Styles.container}>
        {/* <View style={Styles.loginView}>
          <Text style={Styles.loginText}>
            Welcome to your local real estate search engine!
          </Text>
        </View> */}
        {/* <View style={Styles.loginLine}></View>
        <View style={Styles.loginView}>
          <Text style={Styles.signUpText}>Create an account</Text>
        </View> */}
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
              height: 40,
              width: 40,
              borderRadius: 100,
              // backgroundColor: Colors.gray,
            }}>
            <Image source={Images.leftnewarrow} style={{
              height: 30,
              width:30,
              resizeMode: 'contain',
              tintColor: Colors.black,
              transform: [{ rotate: '0deg' }],
            }}></Image>
          </TouchableOpacity>
        </View>
        <Image source={Images.appLogo} style={Styles.appLogo}></Image>
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'User Name'}
            keyboardType="default"
            returnKeyType="done"
            value={userName}
            onChangeText={userName => setUserName(userName)}
          />
        </View>
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Email'}
            keyboardType="email-address"
            returnKeyType="done"
            onChangeText={emailId => setEmailId(emailId)}
          />
        </View>
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Phone'}
            keyboardType="name-phone-pad"
            returnKeyType="done"
            maxLength={12}
            onChangeText={phone => setPhone(phone)}
          />
        </View>

        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Address'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={address => setAddress(address)}
          />
        </View>
        {/* <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Address'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={address => setAddress(address)}
          />
        </View> */}
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Password'}
            keyboardType="email-address"
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
            keyboardType="email-address"
            returnKeyType="done"
            secureTextEntry={true}
            onChangeText={confirmPassword =>
              setConfirmPassword(confirmPassword)
            }
          />
        </View>
        <AppButton
          onPress={() => accessRequestAction()}
          // onPress={() => go()}
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
            marginTop: 50,
          }}
        />
<View style={{alignItems:"center",justifyContent:"center",flexDirection:"row", marginTop: 20, }}>
        <Text style={{fontFamily: "Poppins-Regular", fontSize: 14, textAlign: "center", color:Colors.gray,alignItems:"center",justifyContent:"center",flexDirection:"row" }}>Already have an account ? 
</Text><TouchableOpacity onPress={()=>{navigation.navigate("Login")}}>
        <Text style={{fontFamily: "Poppins-Regular", fontSize: 14, textDecorationLine: "underline", color:Colors.PrimaryColor }}> Sign-in here</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}