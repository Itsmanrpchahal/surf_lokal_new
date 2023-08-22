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
  Animated,
  PanResponder,
  Share,
  Linking,
  KeyboardAvoidingView,
  Modal

} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { postRating } from '../../modules/postRating';
import dynamicLinks from '@react-native-firebase/dynamic-links';
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
import { useIsFocused } from '@react-navigation/native';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-community/async-storage';
import StarRating from 'react-native-star-rating-widget';

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;


const RecycleBin = () => {
  const isFocused = useIsFocused();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setHomeData] = useState([]);
  const [index, setIndex] = useState(0);
  const [agentData, setAgentData] = useState([])
  const [readmore, setreadmore] = useState('');
  const [ratingData, setRatingData] = useState([])

  const [modalVisible, setModalVisible] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [commentContent, setComentContent] = useState('');

  const [rating3, setRating3] = useState(0);
  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');

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
    })
  ).current;

  const generateLink = async (ID) => {
    try {
      const link = await dynamicLinks().buildShortLink({
        link: `https://surflokal.page.link/property?propetyID=${ID}`,
        domainUriPrefix: Platform.OS === 'android' ? 'https://surflokal.page.link/' : 'https://surflokal.page.link',
        android: {
          packageName: 'surf.lokal',
        },
        ios: {
          appStoreId: '123456789',
          bundleId: 'surf.lokal',
        },
        navigation: {
          forcedRedirectEnabled: true,
        }
      }, dynamicLinks.ShortLinkType.SHORT)
      console.log('link:', link)
      return link
    } catch (error) {
      console.log('Generating Link Error:', error)
    }
  }
  const handleShare = async (ID) => {
    const link = await generateLink(ID)
    try {
      Share.share({
        title: 'Please check this property',
        message: link,
        url: link
      });
    } catch (error) {
      console.log('Sharing Error:', error)
    }
  };
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

  const updateReview = async (post_id) => {
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

    dispatch(postUpdateRating(formData)).then((response) => {
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
  };
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      Promise.all[
        getTrashApiCall(),
        getAgentApicall()
      ]
    }

  }, [isFocused]);
  const getTrashApiCall = () => {
    dispatch(getTrash()).then(response => {
      if (response.payload.data === 'Record not found!') {
        setShowNoDataMessage(true);
      } else {
        setShowNoDataMessage(false)
        setHomeData(response.payload.data);
      }
    });

  };
  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {
      setAgentData(response.payload.data);
    });
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


  const renderItem = ({ item }) => (

    <View style={styles.slideOuter}>
      <TouchableOpacity onPress={() => { navigation.navigate('ViewPropertiy', { ID: item.ID, from: 'RecycleBin' }) }}>
        <Image source={{ uri: item.featured_image_src[0].guid }} style={styles.slide} />
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
              style={{ height: 18, width: 18, resizeMode: 'contain', marginRight: 15, position: "relative", left: 0, top: 1 }}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ChatSearch')}>
            <Image
              source={Images.chat}
              style={{ height: 18, width: 18 }}></Image>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ViewPropertiy', { item })}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.surfblur,
              fontFamily: 'Poppins-Bold',
              marginTop: 5
            }}>
            {item.property_price}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            // width: '20%',
            // alignSelf: 'flex-end',
            justifyContent: 'space-between',
            alignItems: 'center',

          }}>
          <TouchableOpacity
            onPress={() => {
              setProductId(item.ID);
              setReviewTitle(item.title)
              toggleModal();
              dispatch(getRating(item.ID)).then((response) => {
                setRatingData(response?.payload?.data)
                setRating(response?.payload?.data[0]?.photo_wuality_rating)
                setRating1(response?.payload?.data[0]?.description_review_stars)
                setRating2(response?.payload?.data[0]?.price_review_stars)
                setRating3(response?.payload?.data[0]?.interest_review_stars)
                console.log(" getRating response data", response?.payload?.data)
              })
            }}
          >
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.total_average_rating > 0 ? (
                  <Image
                    source={Images.startfill}
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                ) : (
                  <Image
                    source={Images.star2}
                    style={{height: 22, width: 22, resizeMode: 'contain',tintColor:'black'}}
                  />
                )}
                <Text
                  style={{
                    fontSize: 18,
                    color: Colors.black,
                    fontFamily: 'Poppins-Light',
                  }}>
                  {item.total_average_rating}
                </Text>
              </View>
            </TouchableOpacity>
          <TouchableOpacity onPress={() => handleShare(item.ID)}>
            <Image
              source={Images.send}
              style={{ height: 18, width: 18, resizeMode: 'contain', position: "relative", left: 8, marginLeft: 0 }}></Image>
          </TouchableOpacity>
        </View>

      </View>
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12,
        }}>
        <Text

          style={{
            fontSize: 15,
            color: Colors.black,
            textAlign: 'center',
            fontFamily: 'Poppins-Medium',
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
              ]}
            >
              <ScrollView style={{ width: "100%" }}>
                <View style={{ alignItems: "center", justifyContent: "center" }}>

                  <View
                    style={{
                      width: 50,
                      height: 5,
                      backgroundColor: "#bac1c3",
                      marginTop: 0,
                      justifyContent: 'center',
                      borderRadius: 100,
                    }}></View>


                </View>
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
                        Description Accuracy :
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
                        Price :
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


                      {ratingData.length > 0? (
                        <TextInput
                          multiline={true}
                          style={{
                            verticalAlign: "top",
                            borderWidth: 1, borderColor: Colors.BorderColor, borderRadius: 8, paddingHorizontal: 12,
                            fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", height: 100,
                            width: "100%"
                          }}
                          onChangeText={text => setComentContent(text)}
                          autoFocus
                        />
                      ) : (
                        <TextInput
                        onChangeText={text => setComentContent(text)}

                          multiline={true}
                          style={{
                            verticalAlign: "top",
                            borderWidth: 1, borderColor: Colors.BorderColor, borderRadius: 8, paddingHorizontal: 12,
                            fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", height: 100,
                            width: "100%"

                          }}>
                          {/* {ratingData[0]?.comment_content} */}
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
                    {ratingData.length > 0? (
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
            </Animated.View>
          </View>
        </Modal>

      </KeyboardAvoidingView>


      <View style={{
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 18,
        justifyContent: 'space-between',

      }}>
        <ScrollView horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false}  >
          <View
            style={{
              flexDirection: 'row',
              alignItems: "center",
              justifyContent: 'space-between',
              marginBottom: 20,
              marginTop: 5,
              width: "100%",
              alignSelf: "center"
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: "center",
                //paddingHorizontal: 12,
                justifyContent: 'space-between',
                marginBottom: 12,
                width: "100%",
                alignSelf: "center",

              }}>

              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  // backgroundColor: "red",
                  width: 70,
                }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={Images.bed}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      //backgroundColor: "green"
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Regular'
                    }}>
                    {item.property_bedrooms.length > 0 ? item.property_bedrooms : 0} {'Beds'}
                  </Text>
                </View>
              </View>


              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',

                  width: 70,
                }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={Images.bath}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                    }}>
                    {item.bathroomsfull.length > 0 ? item.bathroomsfull : 0} {'Baths'}
                  </Text>
                </View>
              </View>



              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: 70,
                }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={Images.measuring}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                      fontFamily: 'Poppins-Regular'
                    }}>
                    {item.property_size.length > 0 ? item.property_size : 0} {'sq ft'}
                  </Text>
                </View>
              </View>


              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 70,
                }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: Colors.black,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    {'HOA'}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                    }}>
                    {item.associationfee.length > 0 ? item.associationfee : 0}
                  </Text>
                </View>
              </View>


              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center', width: 70,

                }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={Images.tax}
                    style={{
                      height: 20,
                      width: 20,
                      marginTop: 0,
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
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
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={Images.calendar}
                    style={{
                      height: 20,
                      width: 20,
                      marginTop: 0,
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                    }}>
                    {item.yearbuilt.length > 0 ? item.yearbuilt : 0}
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
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
          paddingVertical: 12,
          borderBottomColor: Colors.gray,
          borderBottomWidth: 1,
          paddingTop: 16,
          marginBottom: 16
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
              width: 10,
              height: 10,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{ rotate: '90deg' }],
            }}
            source={Images.downArrow}></Image>
          <Text
            style={{
              fontSize: 15,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              marginLeft: 5,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            Back
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.black,
              fontFamily: 'Poppins-Medium',
              marginRight: 4,
              lineHeight: 20,
            }}>
            Recycle Bin
          </Text>
          {/* <Image
            style={{
              width: 18,
              height: 18,
              resizeMode: 'contain',
              position: 'relative',
              top: -2,
            }}
            source={Images.recthumb}
          /> */}
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            position: 'absolute',
            right: 12,
            top: 8,

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: 30,
            borderRadius: 100,
            backgroundColor: Colors.gray,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Animatable.Image
            source={Images.whiteclose}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      {/* <View
        style={{
          marginTop: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,
          marginBottom: 0,
          height: 45,
          alignItems: "center",

        }}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", position: "absolute", left: 8, justifyContent: "center", top: 12 }} onPress={() => { navigation.goBack() }}>
          <Image
            style={{
              width: 11,
              height: 11,
              resizeMode: "contain",
              // position: "absolute",
              // left: 0,
              marginTop: -1,
              transform: [{ rotate: '90deg' }]
            }}
            source={Images.downArrow}
          ></Image>
          <Text style={{
            fontSize: 14,
            color: Colors.black,
            fontFamily: 'Poppins-Regular', marginLeft: 5
          }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}>Recycle Bin</Text>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            position: "absolute",
            right: 10,
            top: 2,

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            width: 40,
            borderRadius: 100,
            backgroundColor: Colors.gray,
          }}
          onPress={() => navigation.goBack()}  >
          <Animatable.Image
            source={Images.whiteclose}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View> */}
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
                fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium'
              }}>
              No Property in Bin !!
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
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '90deg' }],
  },
  slide: {
    width: screenWidth - 16,
    // height: screenHeight / 3,
    height: screenWidth - 100,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    marginBottom: 0
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
