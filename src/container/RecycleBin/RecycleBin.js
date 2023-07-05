import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  FlatList,
  ImageBackground,
  Animated,
  Vibration,
  Share,
  Linking,
  KeyboardAvoidingView,
  Modal

} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import { postRating } from '../../modules/postRating';

import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {getTrash} from '../../modules/getTrash';
import { getAgent } from '../../modules/getAgent';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-community/async-storage';

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;


const RecycleBin = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setHomeData] = useState([]);
  const [index, setIndex] = useState(0);
  const [agentData,setAgentData]=useState([])
  const [readmore, setreadmore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const toggleModal = () => {
    setModalVisible(true);
  };
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');

  const addReview = async post_id => {
    const id = await AsyncStorage.getItem('userId');
    var formdata = new FormData();
    formdata.append('userID', id);
    formdata.append('postid', productId);
    formdata.append('photo_quality_rating',rating );
    formdata.append('desc_stars', rating);
    formdata.append('price_stars', rating);
    formdata.append('interest_stars', rating);
    formdata.append('content', review);
    formdata.append('reviewtitle', reviewTitle);

    console.log(formdata ,"formdataformdata");

    dispatch(postRating(formdata)).then(response => {
      console.log('res', response.payload);
      if (response.payload.success) {
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
      // setFilterData(response.payload.data);
    });
    setModalVisible(!modalVisible);

  };
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    getTrashApiCall();
    getAgentApicall();
  }, []);

  const getTrashApiCall = () => {
    dispatch(getTrash()).then(response => {
      console.log('res--',response.payload.data);
      if (response.payload.data === 'Record not found!') {
        setShowNoDataMessage(true);
      } else {
         setHomeData(response.payload.data);
      }
    });
  
  };
  const getAgentApicall = () =>{
    dispatch(getAgent()).then(response =>{
      console.log('rrrohan',response.payload.data);
      setAgentData(response.payload.data);
      

    });
  }
   const makePhoneCall = () => {
    let phoneNumber =agentData[0]?. agent_phone;
   
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const sendEmail = () => {
    let recipient = 'example@example.com';
    let subject = 'Subject of email';
    let body = 'Body of email';
    Linking.openURL(`mailto:${recipient}?subject=${subject}&body=${body}`);
  };

  const sendSMS = () => {
    let phoneNumber = '512458790';
    let message = 'Hello from my app!';
    Linking.openURL(`sms:${phoneNumber}`);
  };
  const handleShare = () => {
    Share.share({
      message: 'Check out this cool article I found!',
      url: 'https://example.com/article',
      title: 'Cool Article',
    });
  };


  // const [data, setData] = useState(images);

  

  const renderItem = ({item}) => (
   
    <View style={styles.slideOuter}>
      <TouchableOpacity onPress={()=>{navigation.navigate('ViewPropertiy',{item})}}>
      <Image source={{uri: item.featured_image_src}} style={styles.slide} />
      </TouchableOpacity>
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          justifyContent: 'space-between',
        }}>
                <View
          style={{
            flexDirection: 'row',
            width: '15%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => makePhoneCall()}>
            <Image
              source={Images.call}
              style={{height: 20, width: 20, resizeMode: 'contain'}}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ChatSearch')}>
            <Image
              source={Images.chatProp}
              style={{height: 20, width: 20}}></Image>
          </TouchableOpacity>
        </View>
      
        <TouchableOpacity onPress={() => navigation.navigate('ViewPropertiy',{item})}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.primaryBlue,
              fontWeight: '500',
            }}>
          {item.property_price}
          </Text>
        </TouchableOpacity>
      
        <View
          style={{
            flexDirection: 'row',
            width: '20%',
            alignSelf: 'flex-end',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity 
          onPress={() => {
            setProductId(item.ID );
            setReviewTitle(item.title)
            toggleModal();
          }}
          >
            <Image
              source={Images.star}
              style={{height: 20, width: 20, resizeMode: 'contain'}}></Image>
          </TouchableOpacity>
          <Text
            style={{fontSize: 14, color: Colors.black, textAlign: 'center'}}>
            {item.total_average_rating}
          </Text>
          <TouchableOpacity onPress={() => handleShare()}>
            <Image
              source={Images.send}
              style={{height: 20, width: 20, resizeMode: 'contain'}}></Image>
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView >

<Modal
  transparent={true}
  animationType="slide"
  visible={modalVisible}
  onRequestClose={toggleModal}>
  <View
    style={{
      // marginTop: 40,
      height: '80%',
      width: '100%',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: Colors.white,
      position: 'absolute',
      bottom: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      borderColor: Colors.gray,
    }}>
    <View
      style={{
        height: '10%',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
        }}>
        <Text style={{ fontSize: 12, color: Colors.gray }}></Text>
      </TouchableOpacity>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{
            height: 5,
            width: 50,
            borderRadius: 8,
            backgroundColor: Colors.gray,
          }}></TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: Colors.black,
            marginTop: 10,
          }}>
          Rate and Review
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
        }}>
        <Image
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
            tintColor: Colors.black,
            transform: [{ rotate: '45deg' }],
          }}
          source={Images.plus}></Image>
      </TouchableOpacity>
    </View>
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: Colors.gray,
        marginTop: 10,
        justifyContent: 'center',
      }}></View>
    <View style={{ width: '95%', height: '70%' }}>
      <View style={{ width: '95%', alignSelf: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text style={{ fontSize: 12, color: Colors.black, }}>
            Photos Quality Rating :
          </Text>
          <Rating
            type="custom"
            ratingCount={5}
            imageSize={25}
            startingValue={rating}
            ratingBackgroundColor="#c8c7c8"
            onFinishRating={setRating}
            style={styles.rating}
            ratingColor="#ffbe0b"
          //tintColor="#f1f3f4"
          />
        </View>
      </View>

      <View style={{ width: '95%', alignSelf: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 12, color: Colors.black }}>
            Description & Details :
          </Text>
          <Rating
            type="custom"
            ratingCount={5}
            imageSize={25}
            startingValue={rating}
            ratingBackgroundColor="#c8c7c8"
            onFinishRating={setRating}
            style={styles.rating}
            ratingColor="#ffbe0b"
          //tintColor="#f1f3f4"
          />
        </View>
      </View>
      <View style={{ width: '95%', alignSelf: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 12, color: Colors.black }}>
            Price Of Property :
          </Text>
          <Rating
            type="custom"
            ratingCount={5}
            imageSize={25}
            startingValue={rating}
            ratingBackgroundColor="#c8c7c8"
            onFinishRating={setRating}
            style={styles.rating}
            ratingColor="#ffbe0b"
          //tintColor="#f1f3f4"
          />
        </View>
      </View>

      <View style={{ width: '95%', alignSelf: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 12, color: Colors.black }}>
            General Interest in the property :
          </Text>
          <Rating
            type="custom"
            ratingCount={5}
            imageSize={25}
            startingValue={rating}
            ratingBackgroundColor="#c8c7c8"
            onFinishRating={setRating}
            style={styles.rating}
            ratingColor="#ffbe0b"
          //tintColor="#f1f3f4"
          />
        </View>
      </View>


      <View style={{ height: 20 }}></View>
      <View style={{ width: '95%', alignSelf: 'center' }}>
        <Text
          style={{
            fontSize: 12,
            color: Colors.black,
            marginTop: 12,
          }}>
          Review
        </Text>
        <View
          style={{
            width: '100%',
            height: 100,
            marginTop: 10,
            //justifyContent: 'center',
          }}>
          <TextInput
            // allowFontScaling={false}
            style={{
              width: '100%',
              borderRadius: 8,
              height: '100%',
              paddingHorizontal: 12,
              color: Colors.black,
              borderWidth: 1,
              borderColor: Colors.gray,
              fontSize: 14,
              // padding: 2,
              alignItems:"flex-start",
              alignSelf:"flex-start",
              verticalAlign:"top"
            }}
            //keyboardType="default"
            autoCorrect={false}
            returnKeyType="done"
            placeholderTextColor={Colors.gray}
            placeholder='Write a review...'
          onChangeText={text => setReview(text)}
          />
        </View>
      </View>
      <View style={{

        width: '100%',

        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 10
      }}>

        <TouchableOpacity
        onPress={()=>addReview()}
          // onPress={() => setModalVisible(false)}
          // onPress={Alert.alert("Hyy")}
          style={{
            height: 35,
            width: '45%',
            borderRadius: 5,
            backgroundColor: Colors.PrimaryColor,
            marginTop: 10,


            flexDirection: 'row',
            alignItems: "center",
            justifyContent: "center"

          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: Colors.white,
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
</KeyboardAvoidingView>
      <Text  style={{fontSize: 16, color: Colors.black, textAlign: 'center',marginTop:15}}>
            {item.title}</Text>


            <ScrollView horizontal={true} scrollEnabled={true} >
      <View
        style={{
          flexDirection: 'row',
          width: 400,
          margin:10,

          alignSelf: 'center',
          justifyContent: 'space-between',
        }}>
        {item.property_bedrooms != '' ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.bed}
              style={{height: 28, width: 28, resizeMode: 'contain'}}></Image>
              
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.property_bedrooms} {'Beds'}
            </Text>
          </View>
        ) : null}
        {item.bathroomsfull != '' ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.bath}
              style={{height: 28, width: 28, resizeMode: 'contain'}}></Image>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.bathroomsfull} {'Bath'}
            </Text>
          </View>
        ) : null}
        {item.property_size != '' ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.measuring}
              style={{height: 28, width: 28, resizeMode: 'contain'}}></Image>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.property_size} {'sq ft'}
            </Text>
          </View>
        ) : null}
        {item.associationfee != '' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>

              <Text
                style={{
                  fontSize: 20,
                  color: Colors.black,
                  textAlign: 'center',
                }}>
                {"HOA"}
              </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.associationfee == null ? 0 : item.associationfee}
            </Text>
          </View>
        ) : null}
       
           {item.property_size != '' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.tax}
                style={{ height: 28, width: 28, marginTop: 5, resizeMode: 'contain' }}></Image>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  textAlign: 'center',
                }}>
                 {item.taxannualamount == null ? 0 : item.taxannualamount}
              </Text>
            </View>
          ) : null}
      </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{flexDirection:'row',
          width: '100%',
          height: 60,
          justifyContent: 'space-around',
          alignSelf: 'center',
          alignItems: 'center',
          marginLeft:70
        }}>
        <Text style={{fontSize: 20, color: Colors.black}}>Recycle Bin</Text>
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
      <View style={{height: '100%', width: '100%'}}>
      {showNoDataMessage ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: Colors.textColorDark,
              fontFamily: 'Poppins-Regular',
            }}>
            No favourite file data found!
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 50}}
        />
      
        )}
      
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  slide: {
    width: screenWidth ,
    height: screenHeight / 3,
    borderRadius: 18,
    margin: 20,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rating: {
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecycleBin;
