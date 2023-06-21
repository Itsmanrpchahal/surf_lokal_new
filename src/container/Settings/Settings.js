import React, {useState, useEffect, useRef} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
// import Orientation from 'react-native-orientation-locker';
import Styles from './Styles';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
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
  console.log('value check', detials);
  
  const toggleSwitch = () => {setIsEnabled(previousState => !previousState);
  setToggle(!isEnabled);}
  console.log(toggle)
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
    data.append('email_notification',toggle )
    console.log(data,"jnjjnijj")
    try {
      var res = await axios.post(
        'https://surf.topsearchrealty.com/webapi/v1/userprofile/profileupdate.php',
        data,
      );

      console.log('--ppp', res.data);
      // console.log('--ppp', typeof res.status);

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
      console.log('err', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{ flexDirection:'row',
        // marginLeft:80,
          width: '90%',
          height: 60,
          justifyContent: 'space-between',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity  onPress={() => navigation.goBack()}>

          <Image
              source={Images.profile}
              style={{
                height: 35,
                width: 35,
                resizeMode: 'contain',
                // tintColor: Colors.black,
                transform: [{rotate: '90deg'}],
              }}></Image>
              </TouchableOpacity>
        {/* <Text style={{fontSize: 20, color: Colors.black}}>Settings</Text> */}
        <Text style={{fontSize: 20, color: Colors.black}}>Settings</Text>
        
        <TouchableOpacity
        
            onPress={() => navigation.goBack()}
            style={{
            alignItems:'center',
      
            justifyContent:'center',
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
                transform: [{rotate: '90deg'}],
              }}></Image>
          </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView style={{height: '100%', width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 20,
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.textColorLight,
            }}>
            Allow Notfication
          </Text>
          <View>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
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
            marginTop: 20,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.textColorLight,
            }}>
            User Details
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 30,
            height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
          }}>
          <TextInput
            allowFontScaling={false}
            style={{marginLeft: 5, color: Colors.black, flex: 1}}
            placeholderTextColor={Colors.textColorLight}
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
            marginTop: 20,
            height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
          }}>
          <TextInput
            allowFontScaling={false}
            style={{marginLeft: 5, color: Colors.black}}
            placeholderTextColor={Colors.textColorLight}
            value={detials[0].user_email}
            keyboardType="default"
            returnKeyType="done"
            editable={false}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 20,
            height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
          }}>
          <TextInput
            allowFontScaling={false}
            style={{marginLeft: 5, color: Colors.black}}
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
            marginTop: 20,
            height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
          }}>
          <TextInput
            allowFontScaling={false}
            style={{marginLeft: 5, color: Colors.black}}
            placeholderTextColor={Colors.textColorLight}
            value={mob}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={mob => setMob(mob)}
          />
        </View>


        <View style={{marginTop:20,justifyContent:'flex-start',marginHorizontal:20,width:"100%"}}>
          <TouchableOpacity onPress={()=>navigation.navigate('Login')}
          style={{flexDirection:'row'}}>
         <Image source={Images.signOut} style={{height:25,width:25}} />
         <Text style={{marginLeft:10,fontSize:20,color:"black"}}>signOut</Text>
         </TouchableOpacity>
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 20,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.textColorLight,
            }}>
            Change Password
          </Text>
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 20,
            height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
          }}>
          <TextInput
            allowFontScaling={false}
            style={{marginLeft: 5, color: Colors.black}}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Password'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={text => console.log(text)}
          />
        </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 20,
            height: 40,
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: Colors.BorderColor,
          }}>
          <TextInput
            allowFontScaling={false}
            style={{marginLeft: 5, color: Colors.black}}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Confirm Password'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={text => console.log(text)}
          />
        </View> */}

        <TouchableOpacity
          onPress={() => saveFile()}
          style={{
            height: 40,
            borderRadius: 8,
            width: 150,
            marginTop: 50,
            backgroundColor: Colors.primaryBlue,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          {loading ? (
            <ActivityIndicator size={'small'} color={'#fff'} />
          ) : (
            <Text
              style={{fontSize: 16, fontWeight: '400', color: Colors.white}}>
              Submit
            </Text>
          )}
        </TouchableOpacity>

        <View style={{height: 100}}></View>
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

export default Settings;
