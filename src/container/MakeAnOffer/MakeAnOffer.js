import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Image

} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';

import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Orientation from 'react-native-orientation-locker';
import Styles from './Styles';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { makeOffer, makeOfferReducer } from '../../modules/makeOffer';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import FormData from 'form-data';
import { ScrollView } from 'react-native-gesture-handler';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const images = [
  {
    image: Images.favroites,
    title: '',
    navigation: 'MakeAnOffer',
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
    navigation: 'MakeAnOffer',
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

const MakeAnOffer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(true);
  const flatListRef = useRef(null);
  const navigation = useNavigation();


  const dispatch = useDispatch();
  const [priceOffer, setPriceOffer] = useState('');
  const [cashLoan, setCashLoan] = useState('');
  const [legalName, setLegalName] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [userID, setUserID] = useState('');
  const [error, setError] = useState(false);
  const [pricerror, setpricerror] = useState(false);
  const [casherror, setcasherror] = useState(false);
  const [dateerror, setDateerror] = useState(false);
  const [nameerror, setnameerror] = useState(false);
  const [currenterror, setcurrenterror] = useState(false);
  const [emailerror, setemailerror] = useState(false);
  const [phoneerror, setphoneerror] = useState(false);


  const getData = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserID(id)
  };
  const accessRequestAction = () => {
    makeOfferAPI();
    navigation.navigate('Tabs', { screen: 'Home' });
  };


  useEffect(() => {
    getData()
  }, [])


  const validateInputs = () => {
 
    if (!address) {
      setError(true);
    } else {
      setError(false);
    }

    if (!priceOffer) {
      setpricerror(true);
    }
    else {
      setpricerror(false);
    }

    if (!cashLoan) {
      setcasherror(true);
    }
    else {
      setcasherror(false);
    }
    if (!legalName) {
      setnameerror(true);
    }
    else {
      setnameerror(false);
    }
    if (!currentAddress) {
      setcurrenterror(true);
    }
    else {
      setcurrenterror(false);
    }
    if (!email) {
      setemailerror(true);
    }
    else {
      setemailerror(false);
    }
    if (!phone) {
      setphoneerror(true);
    }
    else {
      setphoneerror(false);
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
    setphoneerror('Invalid phone number format');
      return;
    }

    if (!closeDate) {
      setDateerror('Closing date is required');
      return ;
    }

    return true; // All inputs are valid
 
  };



  const makeOfferAPI = () => {
    if (validateInputs()) {
      let data = new FormData();
      data.append('userid', id);
      data.append('property_address', address);
      data.append('property_price_offer', priceOffer);
      data.append('case_loan', cashLoan);
      data.append('full_legal_name', legalName);
      data.append('current_address', currentAddress);
      data.append('email', email);
      data.append('phone', phone);
      data.append('closeing_date', closeDate);

      let config = {
        method: 'post',
        url: 'https://surf.topsearchrealty.com/webapi/v1/makeoffer/',
        headers: {
          'Cookie': 'PHPSESSID=fd247af4106b063e8aecf7dd166aef83',
          'Content-Type': 'multipart/form-data',
        },
        data: data
      };

      axios.request(config)
        .then(response => {
          console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    };
  };




  return (

    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex:1}} >
      <View
        style={styles.viewStyle}>
        <Text style={{ fontSize: 20, color: Colors.black }}>Make An Offer</Text>
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

      <KeyboardAwareScrollView style={{ height: '100%', width: '100%' }}>
        <View
          style={styles.view}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.textColorLight,
              textAlign: 'center',
            }}>
            All fields below are required
          </Text>
        </View>

        <View style={styles.inputStyle}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Propertity Address'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={text => setAddress(text)}
          />

        </View>
        {error && <Text style={styles.error}>Please fill property address</Text>}
  
        <View style={styles.inputStyle}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Propertity Price Offer'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={l => setPriceOffer(l)}
          />
        </View>
        {pricerror && <Text style={styles.error}>Property price offer is required</Text>}
        <View style={styles.inputStyle}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Cash or Conventional Loan'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={p => setCashLoan(p)}
          />
        </View>
        {casherror && <Text style={styles.error}>Case loan is required</Text>}
        <View style={styles.inputStyle}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Preferred Closing Date'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={text => setCloseDate(text)}
          />
        </View>
        {dateerror && <Text style={styles.error}>Date is required</Text>}
        <View style={styles.inputStyle}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Full Legal Name'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={h => setLegalName(h)}
          />
        </View>
        {nameerror && <Text style={styles.error}>Full name is required</Text>}
        <View style={styles.inputStyle}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Current Address'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={o => setCurrentAddress(o)}
          />
        </View>
        {currenterror && <Text style={styles.error}>Current address is required</Text>}
        <View style={styles.inputStyle}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Email'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={e => setEmail(e)}
          />
        </View>
        {emailerror && <Text style={styles.error}>Email is required</Text>}
        <View
          style={styles.inputStyle}>
          <TextInput
            allowFontScaling={false}
            style={{ marginLeft: 5, color: Colors.black }}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Phone'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={t => setPhone(t)}
          />
        </View>
        {phoneerror && <Text style={styles.error}>Phone is required</Text>}
        <TouchableOpacity onPress={() => makeOfferAPI()}
          style={styles.btn}
        >
          <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.white }}>
            Submit
          </Text>
        </TouchableOpacity>
        <View style={{ height: 100 }}></View>
      </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  error: {
    color: 'red',
    paddingHorizontal: 22,
    marginTop: 2,
    fontSize: 12
  },
  inputStyle:{
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
  },
  btn:{
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
  },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
    borderRadius: 18,
  },
  viewStyle:{
    flexDirection:'row',
    width: '90%',
    height: 60,
    justifyContent: 'space-around',
    alignSelf: 'center',
    alignItems: 'center',
  marginLeft:50
},
  view:{
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    alignItems: 'center',

    justifyContent: 'center',
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

export default MakeAnOffer;
