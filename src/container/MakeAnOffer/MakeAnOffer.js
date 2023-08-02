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
import Styles from './Styles';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { makeOffer } from '../../modules/makeOffer';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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
  }

  useEffect(() => {
    getData();
  }, []);

  const accessRequestAction = () => {
    navigation.navigate('AccessRequest');
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || closeDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setCloseDate(currentDate);
  };

  const validateInputs = () => {
    let valid = true;


    if (priceOffer === '') {
      setpricerror(true);
      valid = false;
    } else {
      setpricerror(false);
    }

    if (cashLoan === '') {
      setcasherror(true);
      valid = false;
    } else {
      setcasherror(false);
    }

    if (closeDate === '') {
      setDateerror(true);
      valid = false;
    } else {
      setDateerror(false);
    }

    if (legalName === '') {
      setnameerror(true);
      valid = false;
    } else {
      setnameerror(false);
    }

    if (currentAddress === '') {
      setcurrenterror(true);
      valid = false;
    } else {
      setcurrenterror(false);
    }

    if (email === '') {
      setemailerror(true);
      valid = false;
    } else {
      setemailerror(false);
    }

    if (!validateEmail(email)) {
      setemailerror(true);
      valid = false;
    } else {
      setemailerror(false);
    }

    if (phone === '') {
      setphoneerror(true);
      valid = false;
    } else {
      setphoneerror(false);
    }

    if (!validatePhoneNumber(phone)) {
      setphoneerror(true);
      valid = false;
    } else {
      setphoneerror(false);
    }

    return valid;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const makeOfferAPI = async () => {
    const id = await AsyncStorage.getItem('userId');

    if (validateInputs()) {
      try {
        const data = {
          userid: id,
          property_address: address,
          property_price_offer: priceOffer,
          case_loan: cashLoan,
          full_legal_name: legalName,
          current_address: currentAddress,
          email: email,
          phone: phone,
          closeing_date: selectedDate,
        };

        const response = await axios.post('https://surf.topsearchrealty.com/webapi/v1/makeoffer/', data);


        setAddress('');
        setPriceOffer('');
        setCashLoan('');
        setCloseDate('');
        setLegalName('');
        setCurrentAddress('');
        setEmail('');
        setPhone('');
        setError(false);

        if (response.status === 200) {
          if (response.data.success) {
            Alert.alert("Offer submitted");
            navigation.navigate("MyProfile");
          } else {
            Alert.alert("Offer submit");
          }
        }
      } catch (error) {
        setError(true);
        Alert.alert(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,
          marginBottom: 4
        }}>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}>Make an offer</Text>
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
      </View>
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={90}
      >
        <View style={styles.cardContainer}>


          <View style={styles.formContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Property Address*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Property Address"
                  // lineHeight={40}
                
                  fontFamily='Poppins-Light'
                  placeholderTextColor={'gray'}
                  value={address}
                  onChangeText={(text) => setAddress(text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Offer Price*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Offer Price"
                  fontFamily='Poppins-Light'
                  placeholderTextColor={'gray'}
                  keyboardType="default"
                  value={priceOffer}
                  onChangeText={(text) => setPriceOffer(text)}
                />
                {pricerror && (
                  <Text style={styles.errorText}>Please enter a valid price</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Cash Loan*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Cash Loan"

                  fontFamily='Poppins-Light'
                  placeholderTextColor={'gray'}
                  keyboardType="default"
                  value={cashLoan}
                  onChangeText={(text) => setCashLoan(text)}
                />
                {casherror && (
                  <Text style={styles.errorText}>Please enter a valid cash loan</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Close Date*</Text>
                <TouchableOpacity
                  style={styles.datePickerContainer}
                  onPress={showDatepicker}
                >
                  <Text style={styles.datePickerText}>
                    {selectedDate ? selectedDate.toDateString() : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    fontFamily='Poppins-Light'
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {dateerror && (
                  <Text style={styles.errorText}>Please select a close date</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Legal Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Legal Name"
                  fontFamily='Poppins-Light'
                  placeholderTextColor={'gray'}
                  value={legalName}
                  onChangeText={(text) => setLegalName(text)}
                />
                {nameerror && (
                  <Text style={styles.errorText}>Please enter a valid legal name</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Current Address*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Current Address"
                  fontFamily='Poppins-Light'
                  placeholderTextColor={'gray'}
                  value={currentAddress}
                  onChangeText={(text) => setCurrentAddress(text)}
                />
                {currenterror && (
                  <Text style={styles.errorText}>Please enter a valid address</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Email*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  fontFamily='Poppins-Light'
                  placeholderTextColor={'gray'}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                {emailerror && (
                  <Text style={styles.errorText}>Please enter a valid email address</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Phone*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  fontFamily='Poppins-Light'
                  placeholderTextColor={'gray'}
                  keyboardType="numeric"
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                />
                {phoneerror && (
                  <Text style={styles.errorText}>Please enter a valid phone number</Text>
                )}
              </View>
            </ScrollView>


            <View
              style={{
                width: '100%',

                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',

              }}>
              <TouchableOpacity
                onPress={() => makeOfferAPI()}
                style={{
                  height: 45,
                  width: 130,
                  borderRadius: 100,
                  backgroundColor: Colors.surfblur,
                  marginTop: 10,
                  lineHeight: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.white,
                    fontFamily: 'Poppins-Regular',

                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    // paddingVertical:10
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    // borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    //paddingHorizontal: 16,
    // paddingVertical: 20,
  },
  cardTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  viewStyle: {
    // flexDirection: 'row',
    // width: '90%',
    // height: 60,
    // justifyContent: 'space-around',
    // alignSelf: 'center',
    // alignItems: 'center',
    // marginLeft: 40,
    // marginBottom:10
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginLeft: 0
  },
  formContainer: {

    justifyContent: 'center',

  },
  inputContainer: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 14,
    // fontWeight: '700',
    marginBottom: 0,
    color: Colors.black,
    fontFamily: "Poppins-Medium"
  },
  input: {

    height: 40,
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    width: '100%',
    color: Colors.textColorDark,
    paddingBottom: 5,
    fontSize:12

  },
  datePickerContainer: {
    width: '100%',
    //height: 40,
    justifyContent: 'center',
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontFamily: 'Poppins-Regular',

  },
  datePickerText: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Poppins-Light',
    height: 40, lineHeight: 40
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    height: 30,
    borderRadius: 8,
    width: 100,
    marginTop: 10,
    // marginRight: '5%',
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',

  },
  submitButtonText: {
    fontSize: 16, fontWeight: '400',
    color: Colors.white, fontFamily: 'Poppins-Regular'
  },
});

export default MakeAnOffer;
