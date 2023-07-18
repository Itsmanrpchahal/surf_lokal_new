import React, { useState, useEffect, useRef } from 'react';
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
import { Rating, AirbnbRating } from 'react-native-ratings';
import { postRating } from '../../modules/postRating';

import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getTrash } from '../../modules/getTrash';
import { getAgent } from '../../modules/getAgent';
import { getRating } from '../../modules/getRating';
import { postUpdateRating } from '../../modules/postUpdateRating';
import * as Animatable from 'react-native-animatable';

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
  const [agentData, setAgentData] = useState([])
  const [readmore, setreadmore] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [ratingData, setRatingData] = useState([])

  const [modalVisible, setModalVisible] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const toggleModal = () => {
    setModalVisible(true);
  };

  const updateReview = async (post_id) => {
    const id = await AsyncStorage.getItem('userId');
    const formData = new FormData();
    formData.append('userID', id);
    formData.append('postid', productId);
    formData.append('comment_content', review);
    formData.append('review_title', reviewTitle);
    formData.append('review_stars', rating);
    formData.append('description_review_stars', rating);
    formData.append('price_review_stars', rating);
    formData.append('interest_review_stars', rating);
    formData.append('reviewtitle', reviewTitle)
    console.log(formData, "rkrkrk");
    dispatch(postUpdateRating(formData)).then((response) => {
      console.log('kkk', response.payload);
      if (response.payload.success) {
        Alert.alert('Alert', response.payload.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
    });
  };

  const addReview = async post_id => {
    const id = await AsyncStorage.getItem('userId');
    const formData = new FormData();
    formData.append('userID', id);
    formData.append('postid', productId);
    formData.append('comment_content', review);
    formData.append('review_title', reviewTitle);
    formData.append('review_stars', rating);
    formData.append('description_review_stars', rating);
    formData.append('price_review_stars', rating);
    formData.append('interest_review_stars', rating);
    formData.append('reviewtitle', reviewTitle)
    console.log(formData, "formdataformdata");
    dispatch(postRating(formData)).then(response => {
      console.log('res', response.payload);
      if (response.payload.success) {
        Alert.alert('Alert', response.payload.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
      // setFilterData(response.payload.data);
    });
  };
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    getTrashApiCall();
    getAgentApicall();

  }, []);
  useEffect(() => {
    getRatingApicall();
  }, [])

  const getTrashApiCall = () => {
    dispatch(getTrash()).then(response => {
      console.log('res--', response.payload.data);
      if (response.payload.data === 'Record not found!') {
        setShowNoDataMessage(true);
      } else {
        setHomeData(response.payload.data);
      }
    });

  };
  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {
      console.log('rrrohan', response.payload.data);
      setAgentData(response.payload.data);


    });
  }
  const getRatingApicall = () => {
    dispatch(getRating()).then(response => {
      console.log('MMM', response.payload.data)
      setRatingData(response.payload.data)
    })
  }

  const makePhoneCall = () => {
    let phoneNumber = agentData[0]?.agent_phone;

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



  const renderItem = ({ item }) => (

    <View style={styles.slideOuter}>
      <TouchableOpacity onPress={() => { navigation.navigate('ViewPropertiy', { item }) }}>
        <Image source={{ uri: item.featured_image_src }} style={styles.slide} />
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
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ChatSearch')}>
            <Image
              source={Images.chat}
              style={{ height: 20, width: 20 }}></Image>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ViewPropertiy', { item })}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.primaryBlue,
              fontWeight: '500',
              fontFamily: 'Poppins-SemiBold'
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
              setProductId(item.ID);
              setReviewTitle(item.title)
              toggleModal();
            }}
          >
            <Image
              source={Images.star}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
          </TouchableOpacity>
          <Text
            style={{ fontSize: 14, color: Colors.black, textAlign: 'center', marginRight: 10 }}>
            {item.total_average_rating}
          </Text>
          <TouchableOpacity onPress={() => handleShare()}>
            <Image
              source={Images.send}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
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
              // height: '95%',
              width: '100%',
              left: 0,
              right: 0,
              paddingHorizontal: 16,
              alignItems: 'center',
              alignContent: 'center',
              backgroundColor: Colors.white,
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderWidth: 1,
              borderColor: Colors.gray,
              flexWrap: "wrap",
            }}>
            <ScrollView style={{ width: "100%" }}>
              <View
                style={{
                  //height: '10%',
                  width: '100%',
                  flexDirection: 'row',
                  // justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {/* <TouchableOpacity
                          onPress={() => navigation.goBack()}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 10,
                          }}>
                          <Text style={{ fontSize: 12, color: Colors.gray }}></Text>
                        </TouchableOpacity> */}
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingVertical: 12,
                    position: "relative",
                    width: "100%",
                    textAlign: "center"
                  }}>

                  <Text
                    style={{
                      fontSize: 18,
                      color: Colors.black,
                      fontFamily: "Poppins-SemiBold"
                    }}>
                    Rate and Review
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    backgroundColor: Colors.surfblur,
                    height: 37,
                    width: 37,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    //margin: 12,
                    position: "absolute",
                    right: 0,
                  }}>
                  <Image
                    style={{
                      height: 16,
                      width: 16,
                      //margin: 12,
                      resizeMode: 'contain',
                      tintColor: Colors.white,
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
              <View style={{}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Poppins-SemiBold",
                    color: Colors.black,
                    marginTop: 10,
                    // marginRight: 180
                  }}>
                  Your Review
                </Text>
                <Text style={{ fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", }}>{ratingData[0]?.comment_content}</Text>
                {!isEditing && (
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 12, color: Colors.darbluec, fontFamily: "Poppins-Regular" }}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ width: '100%', }}>
                <View style={{ width: '100%', alignSelf: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>
                      Photos Quality Rating :
                    </Text>
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={18}
                      startingValue={ratingData[0]?.photo_wuality_rating
                      }
                      ratingBackgroundColor="#c8c7c8"
                      onFinishRating={setRating}
                      style={styles.rating}
                      ratingColor={Colors.surfblur}
                    //tintColor="#f1f3f4"
                    />
                  </View>
                </View>

                <View style={{ width: '100%', alignSelf: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>
                      Description & Details :
                    </Text>
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={18}
                      startingValue={ratingData[0]?.description_review_stars
                      }
                      ratingBackgroundColor="#c8c7c8"
                      onFinishRating={setRating}
                      style={styles.rating}
                      ratingColor={Colors.surfblur}
                    //tintColor="#f1f3f4"
                    />
                  </View>
                </View>
                <View style={{ width: '100%', alignSelf: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>
                      Price Of Property :
                    </Text>
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={18}
                      startingValue={ratingData[0]?.price_review_stars
                      }
                      ratingBackgroundColor="#c8c7c8"
                      onFinishRating={setRating}
                      style={styles.rating}
                      ratingColor={Colors.surfblur}
                    //tintColor="#f1f3f4"
                    />
                  </View>
                </View>

                <View style={{ width: '100%', alignSelf: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>
                      General Interest in the property :
                    </Text>
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={18}
                      startingValue={ratingData[0]?.interest_review_stars
                      }
                      ratingBackgroundColor="#c8c7c8"
                      onFinishRating={setRating}
                      style={styles.rating}
                      ratingColor={Colors.surfblur}
                    //tintColor="#f1f3f4"
                    />
                  </View>
                </View>



                <View style={{ width: '100%', alignSelf: 'center', overflow: "hidden" }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Poppins-SemiBold",
                      color: Colors.black,
                      marginTop: 10,
                      // marginRight: 180
                    }}>
                    Review
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      //height: 100,
                      marginTop: 0,
                      //justifyContent: 'center',
                      flexWrap: "wrap",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word", height: 100, width: "100%", flexWrap: "wrap", overflow: "hidden"
                    }}>


                    {isEditing ? (
                      <TextInput
                        multiline={true}
                        style={{
                          verticalAlign: "top",
                          borderWidth: 1, borderColor: Colors.BorderColor, borderRadius: 8, paddingHorizontal: 12,
                          fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", height: 100,
                          width: "100%"
                        }}
                        value={review}
                        onChangeText={text => setReview(text)}
                        autoFocus
                      />
                    ) : (
                      <TextInput

                        multiline={true}
                        style={{
                          verticalAlign: "top",
                          borderWidth: 1, borderColor: Colors.BorderColor, borderRadius: 8, paddingHorizontal: 12,
                          fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", height: 100,
                          width: "100%"

                        }}>
                        {ratingData[0]?.comment_content}
                      </TextInput>
                    )}
                  </View>
                </View>
                <View style={{

                  width: '100%',

                  flexDirection: 'row',
                  alignItems: "center",
                  justifyContent: "flex-end",
                  //s paddingHorizontal: 10
                }}>
                  {isEditing ? (
                    <View style={{
                      justifyContent: "flex-end", width: '100%',
                      alignItems: "flex-end",
                    }}>
                      <TouchableOpacity onPress={() => updateReview()} style={{
                        height: 50,
                        width: '40%',
                        borderRadius: 100,
                        backgroundColor: Colors.surfblur,
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 40
                      }}>
                        <Text style={{
                          fontSize: 16,
                          // fontWeight: '700',
                          color: Colors.white,
                          fontFamily: "Poppins-Regular",
                        }}>Update</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (

                    <View style={{
                      justifyContent: "flex-end", width: '100%',
                      alignItems: "flex-end",
                    }}>
                      <TouchableOpacity
                        onPress={() => addReview()}
                        // onPress={() => setModalVisible(false)}
                        // onPress={Alert.alert("Hyy")}
                        style={{
                          height: 50,
                          width: '45%',
                          borderRadius: 100,
                          backgroundColor: Colors.surfblur,
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 20

                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            // fontWeight: '700',
                            color: Colors.white,
                            fontFamily: "Poppins-Regular",
                          }}>
                          Submit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

              </View>
            </ScrollView>
          </View>

        </Modal>

      </KeyboardAvoidingView>
      {/* <Text style={{ fontSize: 16, color: Colors.black, textAlign: 'center', marginTop: 15 }}>
        {item.title}</Text> */}


      <ScrollView horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false} >
        <View
          style={{
            flexDirection: 'row',
            width: 400,
            margin: 10,

            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.bed}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>

            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.property_bedrooms.length > 0 ? item.property_bedrooms : 0} {'Beds'}
            </Text>
          </View>


          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.bath}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.bathroomsfull.length > 0 ? item.bathroomsfull : 0} {'Bath'}
            </Text>
          </View>


          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.measuring}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.property_size.length > 0 ? item.property_size : 0} {'sq ft'}
            </Text>
          </View>


          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>

            <Text
              style={{
                fontSize: 13,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {"HOA"}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.associationfee.length > 0 ? item.associationfee : 0}
            </Text>
          </View>


          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.tax}
              style={{ height: 20, width: 20, marginTop: 5, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.taxannualamount.length > 0 ? item.taxannualamount : 0}
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0
        }}>
        <Text style={{ fontSize: 20, color: Colors.black }}>Recycle Bin</Text>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            position: "absolute",
            right: 10,
            rop: 10,

            backgroundColor: Colors.surfblur,
            height: 37,
            width: 37,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("MyProfile")}
        >
          <Animatable.Image
            source={Images.whiteclose}
            style={{
              height: 12,
              width: 12,
              resizeMode: 'contain',
              tintColor: Colors.white,
            }}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <View style={{ height: '100%', width: '100%' }}>
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
            contentContainerStyle={{ paddingBottom: 50 }}
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
    width: screenWidth,
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
