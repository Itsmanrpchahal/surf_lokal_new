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
  PanResponder,
  Vibration,
  Linking,
  Share,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getFavoriteProperties } from '../../modules/getFavoriteProperties';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import { Rating, AirbnbRating } from 'react-native-ratings';
import AsyncStorage from '@react-native-community/async-storage';
import { postRating } from '../../modules/postRating';
// import { getAgent } from '../../modules/getAgent';
import { getAgent } from '../../modules/getAgent';
import { getRating } from '../../modules/getRating';
import { postUpdateRating } from '../../modules/postUpdateRating';
import * as Animatable from 'react-native-animatable';
import { useIsFocused } from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DeviceInfo from 'react-native-device-info';
import { store } from '../../redux/store';

import StarRating from 'react-native-star-rating-widget';

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const MyFavorites = props => {
  const isFocused = useIsFocused();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [data, setHomeData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [text, setText] = useState('');
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ratingData, setRatingData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [commentContent, setComentContent] = useState('');

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        slideAnimation.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // If the swipe distance is greater than 50, close the modal
          closeModal();
        } else {
          // Otherwise, reset the animation back to 0
          Animated.spring(slideAnimation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleModalAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    handleModalAnimation();
  }, [modalVisible]);

  const updateReview = async post_id => {
    const id = await AsyncStorage.getItem('userId');
    const formData = new FormData();
    formData.append('userID', id);
    formData.append('postid', productId);
    formData.append('comment_content', commentContent);
    formData.append('review_title', reviewTitle);
    formData.append('review_stars', rating);
    formData.append('description_review_stars', rating1);
    formData.append('price_review_stars', rating2);
    formData.append('interest_review_stars', rating3);
    formData.append('reviewtitle', reviewTitle);
    console.log("postUpdateRating", formData)
    dispatch(postUpdateRating(formData)).then(response => {
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
    formData.append('comment_content', commentContent);
    formData.append('review_title', reviewTitle);
    formData.append('photo_quality_rating', rating);
    formData.append('desc_stars', rating1);
    formData.append('price_stars', rating2);
    formData.append('interest_stars', rating3);
    formData.append('content', commentContent);
    console.log("addddddddddd ratingggggg", formData);
    dispatch(postRating(formData)).then(response => {
      if (response.payload.success) {
        Alert.alert('Alert', response.payload.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
      // setFilterData(response.payload.data);
    });

    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    if (isFocused) {
      Promise.all[(getFavoritePropertiesApiCall(), getAgentApicall())];
    }
  }, [isFocused]);
  const getFavoritePropertiesApiCall = () => {
    dispatch(getFavoriteProperties()).then(response => {
      if (response.payload.data === 'Record not found!') {
        setShowNoDataMessage(true);
      } else {
        setShowNoDataMessage(false);
        setHomeData(response.payload.data);
      }
    });
  };

  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {
      setAgentData(response.payload.data);
    });
  };
  // const getRatingApicall = () => {
  //   dispatch(getRating()).then(response => {
  //     setRatingData(response.payload.data)
  //   })
  // }

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
  const generateLink = async ID => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://surflokal.page.link/property?propetyID=${ID}`,
          domainUriPrefix:
            Platform.OS === 'android'
              ? 'https://surflokal.page.link/'
              : 'https://surflokal.page.link',
          android: {
            packageName: 'surf.lokal',
          },
          ios: {
            appStoreId: '123456789',
            bundleId: 'surf.lokal',
          },
          navigation: {
            forcedRedirectEnabled: true,
          },
        },
        dynamicLinks.ShortLinkType.SHORT,
      );
      console.log('link:', link);
      return link;
    } catch (error) {
      console.log('Generating Link Error:', error);
    }
  };
  const handleShare = async ID => {
    const link = await generateLink(ID);
    try {
      Share.share({
        title: 'Please check this property',
        message: link,
        url: link,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slideOuter]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ViewPropertiy', {
            ID: item.ID,
            from: 'MyFavorites',
          })
        }>
        <Image
          source={{ uri: item?.featured_image_src[0].guid }}
          style={styles.slide}
        />
      </TouchableOpacity>

      <View
        style={{
          // height: 30,
          //width: 20,
          backgroundColor: Colors.surfblur,
          position: 'absolute',
          top: 8,
          left: 16,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}>
        <Text
          style={{
            fontSize: 12,
            color: Colors.white,
            fontFamily: 'Poppins-Regular',
            marginBottom: 0,
            lineHeight: 14,
            paddingTop: 4,
          }}>
          {item?.ListingKey}
        </Text>
      </View>
      <View
        style={{
          // height: 30,
          //width: 20,
          backgroundColor: Colors.surfblur,
          position: 'absolute',
          top: 8,
          right: 16,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 25,
          paddingVertical: 4,
        }}>
        <Text
          style={{
            fontSize: 12,
            color: Colors.white,
            fontFamily: 'Poppins-Regular',
            marginBottom: 0,
            lineHeight: 14,
            paddingTop: 4,
          }}>
          Active
        </Text>
      </View>
        {/* <View
        style={{
          // height: 30,
          //width: 20,
          backgroundColor: "red",
          position: 'absolute',
          top: 8,
          right: 16,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}>
        <Text
          style={{
            fontSize: 12,
            color: Colors.white,
            fontFamily: 'Poppins-Regular',
            marginBottom: 0,
            lineHeight: 14,
            paddingTop: 4,
          }}>
          Pending
        </Text>
      </View> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          paddingTop:16,
          paddingHorizontal:16
         
        }}>
        <View
          style={{
            flexDirection: 'row',
           // width: '15%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatSearch')}> 
            <Image
              source={Images.chatnew}
              style={{
                height:28,
                width: 28,
                resizeMode: 'cover',
                marginRight: 15,
               
              }}></Image>
          </TouchableOpacity>

         <TouchableOpacity onPress={() => makePhoneCall()}>
            <Image source={Images.calenderwedding} style={{ height:27, width: 33 }}></Image>
          </TouchableOpacity>
        </View>
      
        <View
          style={{
            flexDirection: 'row',
            // width: '20%',
            // alignSelf: 'flex-end',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'relative',
              flexDirection: 'row',
             
            }}>
            <TouchableOpacity
              onPress={() => {
                setProductId(item.ID);
                setReviewTitle(item.title);
                toggleModal();
                dispatch(getRating(item.ID)).then((response) => {
                  setRatingData(response?.payload?.data)
                  setRating(response?.payload?.data[0]?.photo_wuality_rating)
                  setRating1(response?.payload?.data[0]?.description_review_stars)
                  setRating2(response?.payload?.data[0]?.price_review_stars)
                  setRating3(response?.payload?.data[0]?.interest_review_stars)
                  // console.log(" getRating response data", response?.payload?.data)
                })
              }}>
              <Image
                source={Images.startfill}
                style={{ height: 22, width: 22, resizeMode: 'contain' }}></Image>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 18,
                color: Colors.black,
                fontFamily:"Poppins-Light",
                marginLeft:4
              
              }}>
              {item.total_average_rating}
            </Text>
          </View>
          <TouchableOpacity style={{marginLeft:15}} onPress={() => handleShare(item.ID)}>
            <Image
              source={Images.sendnew}
              style={{
                height: 17,
                width: 20,
                resizeMode: 'contain',
              
              }}></Image>
          </TouchableOpacity>
        </View>
       

      </View>
      <TouchableOpacity
          onPress={() => navigation.navigate('ViewPropertiy', { item })}>
          <Text
            style={{
              fontSize: 28,
              color: "#1450B1",
              fontFamily: 'Poppins-Medium',
              marginTop: 5,
            }}>
            {item.property_price}
          </Text>
        </TouchableOpacity>
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12,
          marginBottom:8
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 20,
            color: Colors.black,
            textAlign: 'center',
            fontFamily: 'Poppins-Light',
          }}>
          {item?.title}
        </Text>
      </View>
      <KeyboardAvoidingView behavior="padding">
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={toggleModal}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalOverlay}
              onPress={closeModal}
            />
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      translateY: slideAnimation.interpolate({
                        inputRange: [-300, 0],
                        outputRange: [-300, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <ScrollView style={{ width: '100%' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View
                    style={{
                      width: 50,
                      height: 5,
                      backgroundColor: '#bac1c3',
                      marginTop: 0,
                      justifyContent: 'center',
                      borderRadius: 100,
                    }}></View>
                </View>
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Poppins-SemiBold',
                      color: Colors.black,
                      marginTop: 5,
                      // marginRight: 180
                    }}>
                    Your Review
                  </Text>

                </View>
                <View style={{ width: '100%' }}>
                  <View style={{ width: '100%', alignSelf: 'center' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>

                        Photos :

                      </Text>

                      <StarRating
                        maxStars={5}
                        starSize={22}
                        enableSwiping
                        enableHalfStar
                        color={Colors.surfblur}
                        rating={rating}
                        onChange={(value) => { setRating(value) }}
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

                        Description Accuracy  :

                      </Text>

                      <StarRating
                        maxStars={5}
                        starSize={22}
                        enableSwiping
                        enableHalfStar
                        color={Colors.surfblur}
                        rating={rating1}
                        onChange={(value) => { setRating1(value) }}
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

                        Price  :

                      </Text>

                      <StarRating
                        maxStars={5}
                        starSize={22}
                        enableSwiping
                        enableHalfStar
                        color={Colors.surfblur}
                        rating={rating2}
                        onChange={(value) => { setRating2(value) }}
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

                        Interest in Property :

                      </Text>

                      <StarRating
                        maxStars={5}
                        starSize={22}
                        enableSwiping
                        enableHalfStar
                        color={Colors.surfblur}
                        rating={rating3}
                        onChange={(value) => { setRating3(value) }}
                      />

                    </View>
                  </View>

                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      overflow: 'hidden',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Poppins-SemiBold',
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
                        flexWrap: 'wrap',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        height: 100,
                        width: '100%',
                        flexWrap: 'wrap',
                        overflow: 'hidden',
                      }}>
                       {ratingData.length > 0 ? (
                        <TextInput
                          multiline={true}
                          style={{
                            verticalAlign: 'top',
                            borderWidth: 1,
                            borderColor: Colors.BorderColor,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            fontSize: 12,
                            flexWrap: 'wrap',
                            color: Colors.newgray,
                            fontFamily: 'Poppins-Regular',
                            height: 100,
                            width: '100%',
                          }}
                          
                          onChangeText={text => setComentContent(text)}
                          autoFocus
                        />
                      ) : (
                        <TextInput
                        onChangeText={text => setComentContent(text)}

                        multiline={true}
                          style={{
                            verticalAlign: 'top',
                            borderWidth: 1,
                            borderColor: Colors.BorderColor,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            fontSize: 12,
                            flexWrap: 'wrap',
                            color: Colors.newgray,
                            fontFamily: 'Poppins-Regular',
                            height: 100,
                            width: '100%',
                          }}>
                        </TextInput>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      width: '100%',

                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      //s paddingHorizontal: 10
                    }}>
                    {ratingData.length > 0 ? (
                      <View
                        style={{
                          justifyContent: 'flex-end',
                          width: '100%',
                          alignItems: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={() => updateReview()}
                          style={{
                            height: 50,
                            width: '40%',
                            borderRadius: 100,
                            backgroundColor: Colors.surfblur,
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 40,
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              // fontWeight: '700',
                              color: Colors.white,
                              fontFamily: 'Poppins-Regular',
                            }}>
                            Update
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          justifyContent: 'flex-end',
                          width: '100%',
                          alignItems: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={() => addReview()}
                          style={{
                            height: 45,
                            width: 130,
                            borderRadius: 100,
                            backgroundColor: Colors.surfblur,
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              // fontWeight: '700',
                              color: Colors.white,
                              fontFamily: 'Poppins-Regular',
                            }}>
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      </KeyboardAvoidingView>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 18,
        }}>
        {DeviceInfo.getDeviceType() === 'Tablet' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              marginTop: 5,
              width: '100%',
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                //paddingHorizontal: 12,
                justifyContent: 'space-between',
                marginBottom: 12,
                width: '100%',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  // backgroundColor: "red",
                 // width: 70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.newbed}
                    style={{
                      height: 20,
                      width:27,
                      resizeMode: 'contain',
                    //backgroundColor: "green"
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                    }}>
                    {item.property_bedrooms.length > 0
                      ? item.property_bedrooms
                      : 0}{' '}
                    {'Beds'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',

                  width: 70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.bathtub}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                    }}>
                    {item.bathroomsfull.length > 0 ? item.bathroomsfull : 0}{' '}
                    {'Baths'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: 70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.measuringtape}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      marginBottom:5
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                    }}>
                    {item.property_size.length > 0 ? item.property_size : 0}{' '}
                    {'sq ft'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={Images.hoa2}
                    style={{
                      height: 28,
                      width: 29,
                      marginTop: 0,
                      resizeMode: 'contain',
                      marginBottom:5
                    }}></Image>

                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                    }}>
                    {item.associationfee.length > 0 ? item.associationfee : 0}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.taxnew}
                    style={{
                      height: 20,
                      width: 20,
                      marginTop: 0,
                      resizeMode: 'contain',
                      marginBottom:5
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                    }}>
                    {item.taxannualamount.length > 0 ? item.taxannualamount : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.calendar}
                    style={{
                      height: 20,
                      width: 20,
                      marginTop: 0,
                      resizeMode: 'contain',
                      marginBottom:5
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                    }}>
                    {item.taxannualamount.length > 0 ? item.taxannualamount : 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
                marginTop: 5,
                width: '100%',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  //paddingHorizontal: 12,
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    // backgroundColor: "red",
                    width: 70,
                  }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={Images.newbed}
                      style={{
                        height: 21,
                        width: 28,
                        resizeMode: 'contain',
                       //backgroundColor: "green",
                        marginBottom:5
                      }}></Image>
                    <Text
                      style={{
                        fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                      }}>
                      {item.property_bedrooms.length > 0
                        ? item.property_bedrooms
                        : 0}{' '}
                      {'Beds'}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',

                    width: 70,
                  }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={Images.bathtub}
                      style={{
                        height: 26,
                        width: 28,
                        resizeMode: 'contain',
                        marginBottom:5
                      }}></Image>
                    <Text
                      style={{
                        fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                      }}>
                      {item.bathroomsfull.length > 0 ? item.bathroomsfull : 0}{' '}
                      {'Baths'}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: 70,
                  }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={Images.measuringtape}
                      style={{
                        height: 26,
                        width: 27,
                        resizeMode: 'contain',
                        marginBottom:5
                      }}></Image>
                    <Text
                      style={{
                        fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                      }}>
                      {item.property_size.length > 0 ? item.property_size : 0}{' '}
                      {'sq ft'}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                 width: 70,
                  }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                   <Image
                      source={Images.hoa2}
                      style={{
                        height: 28,
                        width: 29,
                        resizeMode: 'contain',
                        marginBottom:5,
                        //backgroundColor:"red"
                      }}></Image>
                    <Text
                      style={{
                        fontSize: 11,
                        color: Colors.black,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Light',
                      }}>
                      {item.associationfee.length > 0 ? item.associationfee : 0}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 70,
                  }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={Images.taxnew}
                      style={{
                        height: 27,
                        width: 25,
                        marginTop: 0,
                        resizeMode: 'contain',
                        marginBottom:5
                      }}></Image>
                    <Text
                      style={{
                        fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                      }}>
                      {item.taxannualamount.length > 0
                        ? item.taxannualamount
                        : 0}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 70,
                  }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      source={Images. cals}
                      style={{
                        height: 30,
                        width: 30,
                        marginTop: 0,
                        resizeMode: 'contain',
                        marginBottom:5
                      }}></Image>
                    <Text
                      style={{
                        fontSize: 11,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Light',
                      }}>
                      {item.yearbuilt.length > 0 ? item.yearbuilt : 0}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          // height: 45,
          alignItems: 'center',
          // borderBottomColor: Colors.gray,
          // borderBottomWidth: 1,
          paddingTop: 16,
          paddingBottom:2
        
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            left: 12,
            justifyContent: 'center',
            // top: 12,
            top: 13
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              width:27,
              height: 27,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              resizeMode:"contain"
            }}
            source={Images.leftnewarrow}></Image>
     
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.black,
              fontFamily: 'Poppins-Light',
              lineHeight: 22,
            }}>
           Favorites
          </Text>
     
        </View>
        <TouchableOpacity
          style={{
            position:"absolute",
    right:10,
    top:15
          }}

          onPress={() => navigation.goBack()}>

          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
              onPress={() => {
              
              }}
              activeOpacity={0.5}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.surfblur,
                borderRadius: 50,
                position:"absolute",
                right:10,
                top:5
              }}>
             
            
                <View
                  style={{
                    height:35,
                    width: 35,
                    borderRadius: 20,
                    backgroundColor: Colors.surfblur,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}>
               
                    <Image
                      style={{ height: 40, width: 40 }}
                      source={Images.user}
                    />
            
                </View>
            
         
            </TouchableOpacity> */}
      </View>
      {/* </View> */}
<View style={{alignItems:"center",justifyContent:"center",  marginBottom: 16}}><Image
                      style={{ height: 15, width: 13,resizeMode:"contain" }}
                      source={Images.favfilter}
                    /></View>
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
                color: Colors.black,
                fontFamily: 'Poppins-Medium',
              }}>
              No Property in Favorite !!
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListFooterComponent={<View style={{ height: 70 }}></View>}
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
    position: 'relative',
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 18,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: screenWidth - 16,
    // height: screenHeight / 3,
    height: screenWidth - 100,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 23,
    //fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  paginationDotActive: {
    backgroundColor: 'blue',
  },
  //fliter
  filter: {
    height: 60,
  },
  rating: {
    marginVertical: 5,
    // color: "red"
  },
  ratingText: {
    fontSize: 18,
    //fontWeight: 'bold',
  },
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imagedata: {
    height:19,
    width: 29,
    resizeMode: 'contain',
   
  },
});

export default MyFavorites;
