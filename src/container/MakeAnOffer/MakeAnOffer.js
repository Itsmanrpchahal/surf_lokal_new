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
            console.log(response.data);
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
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={90}
      >
          <View style={styles.cardContainer}>

                <View
          style={styles.viewStyle}>
          <Text style={{ fontSize: 20, marginLeft: 25, color: Colors.black,
             fontFamily: 'Poppins-Regular' }}>Make An Offer </Text>
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
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Offer Price*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Offer Price"
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
                    keyboardType="numeric"
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                  />
                  {phoneerror && (
                    <Text style={styles.errorText}>Please enter a valid phone number</Text>
                  )}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={()=>makeOfferAPI()}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
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
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  cardTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  viewStyle: {
    flexDirection: 'row',
    width: '90%',
    height: 60,
    justifyContent: 'space-around',
    alignSelf: 'center',
    alignItems: 'center',
    marginLeft: 40,
    marginBottom:10
  },
  formContainer: {
    
    justifyContent: 'center',
  
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {

    height: 40,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    width: '100%',
  },
  datePickerContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  datePickerText: {
    fontSize: 14,
  },
  errorText: {
    color:'red',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    height: 30,
    borderRadius: 8,
    width: 100,
    marginTop: 10,
    marginRight: '5%',
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
