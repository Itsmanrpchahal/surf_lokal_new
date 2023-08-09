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

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const images = [
  {
    image: Images.favroites,
    title: '',
    navigation: 'Settings',
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
    navigation: 'Settings',
  },
  {
    image: Images.makeOffer,
    title: 'Make An Offer',
    navigation: 'Settings',
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

const Settings = props => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [address, setAddres] = useState('');
  const [userName, setUserName] = useState('');
  const [mob, setMob] = useState('');
  const [email, setEmail] = useState('');
  const [toggle, setToggle] = useState(false);

  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const detials = props.route.params.data;

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setToggle(!isEnabled);
  }
  useEffect(() => {
    setUserName(detials[0].username);
    setAddres(detials[0].address);
    setMob(detials[0].mobile);
  }, []);


  const saveFile = async () => {
    setLoading(true);
    const userID = await AsyncStorage.getItem('userId');
    const headers = {
      'Content-Type': 'application/json',
    };
    let data = new FormData();
    data.append('UserID', userID);
    data.append('username', userName);
    data.append('user_address', address);
    data.append('mobile', mob);
    data.append('email_notification', toggle)
    try {
      var res = await axios.post(
        'https://surf.topsearchrealty.com/webapi/v1/userprofile/profileupdate.php',
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
          width: '90%',
          // height: 60,
          justifyContent: 'space-between',
          alignSelf: 'center',
          alignItems: 'center',
          paddingVertical: 6
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            height: 45,
            width: 45,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.primaryBlue,
            borderRadius: 50

          }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              backgroundColor: Colors.primaryBlue,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            {detials[0]?.user_image != null ? (
              <Image
                style={{ height: 40, width: 40 }}
                source={{ uri: detials[0]?.user_image }}
              />
            ) : (
              <Text style={{ fontSize: 17, color: Colors.white }}>JD</Text>
            )}
            {/* <Loader loading={loading} /> */}
          </View>

        </TouchableOpacity>

        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Regular' }}>Settings</Text>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            marginLeft: 12,

            backgroundColor: Colors.surfblur,
            height: 25,
            width: 25,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("MyProfile")}
        >
          <Animatable.Image source={Images.whiteclose}
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

      <KeyboardAwareScrollView style={{ height: '100%', width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            //marginTop: 20,
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginTop: 6
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.black,
              fontFamily: 'Poppins-Regular'
            }}>
            Allow Notfication
          </Text>
          <View>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />

          </View>
        </View>
        <View
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
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 12,
            //  height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            borderRadius: 4,
            fontFamily: 'Poppins-Regular',
            paddingHorizontal: 8, paddingTop: 2
          }}>
          <TextInput
            allowFontScaling={false}
            style={{ color: Colors.black, flex: 1, fontFamily: 'Poppins-Regular', fontSize: 14 }}
            placeholderTextColor={Colors.black}
            fontSize={14}
            value={userName}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={userName => setUserName(userName)}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 12,
            //  height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            borderRadius: 4,
            fontFamily: 'Poppins-Regular',
            paddingHorizontal: 8,
            paddingTop: 2
          }}>
          <TextInput
            allowFontScaling={false}
            style={{ color: 'black', flex: 1, fontFamily: 'Poppins-Regular', fontSize: 14 }}

            placeholderTextColor={Colors.black}
            value={detials[0]?.user_email}
            keyboardType="default"
            returnKeyType="done"
            editable={false}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 12,
            //  height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            borderRadius: 4,
            fontFamily: 'Poppins-Regular',
            paddingHorizontal: 8,
            paddingTop: 2
          }}>
          <TextInput
            allowFontScaling={false}
            style={{ color: 'black', flex: 1, fontFamily: 'Poppins-Regular', fontSize: 14 }}

            placeholderTextColor={Colors.textColorLight}
            value={address}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={address => setAddres(address)}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 12,
            //  height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            borderRadius: 4,
            fontFamily: 'Poppins-Regular',
            paddingHorizontal: 8,
            paddingTop: 2
          }}>
          <TextInput
            allowFontScaling={false}
            style={{ color: 'black', flex: 1, fontFamily: 'Poppins-Regular', fontSize: 14 }}

            placeholderTextColor={'black'}
            value={mob}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={mob => setMob(mob)}
          />
        </View>


        <View style={{ paddingHorizontal: 22, marginTop: 20, justifyContent: 'space-between', marginHorizontal: 0, width: "100%", flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}
            style={{ flexDirection: 'row', alignItems: "center" }}>
            <Image source={Images.signOut} style={{ height: 20, width: 20 }} />
            <Text style={{ marginLeft: 6, fontSize: 16, color: "black", fontFamily: 'Poppins-Regular' }}>Signout</Text>
          </TouchableOpacity>




          <TouchableOpacity
            onPress={() => saveFile()}
            style={{
              height: 45,
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
                    fontSize: 14,

                    color: Colors.white,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Submit
                </Text>

              </View>
            )}
          </TouchableOpacity>
        </View>














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
  },
});

export default Settings;
