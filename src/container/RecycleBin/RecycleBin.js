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
import { postRating } from '../../modules/postRating';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {  useDispatch } from 'react-redux';
import { getTrash } from '../../modules/getTrash';
import { getAgent } from '../../modules/getAgent';
import { getRating } from '../../modules/getRating';
import { postUpdateRating } from '../../modules/postUpdateRating';
import * as Animatable from 'react-native-animatable';
import { useIsFocused } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import StarRating from 'react-native-star-rating-widget';



const RecycleBin = () => {
  const isFocused = useIsFocused();

  const [data, setHomeData] = useState([]);
  const [agentData, setAgentData] = useState([0])
  const [ratingData, setRatingData] = useState([])

  const [modalVisible, setModalVisible] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [commentContent, setComentContent] = useState('');

  const [rating3, setRating3] = useState(0);
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


  const updateReview = async post_id => {
    const formData = new FormData();
    formData.append('postid', productId);
    formData.append('comment_content', commentContent);
    formData.append('review_title', reviewTitle);
    formData.append('review_stars', rating);
    formData.append('description_review_stars', rating1);
    formData.append('price_review_stars', rating2);
    formData.append('interest_review_stars', rating3);
    console.log('postUpdateRating', formData);

    dispatch(postUpdateRating(formData)).then(response => {
      if (response.payload.success) {
        Alert.alert( response.payload.data.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert( response.payload.data.message);
      }
    });
  };

  const addReview = async post_id => {
    const formData = new FormData();
    formData.append('postid', productId.toString());
    formData.append('reviewtitle', reviewTitle);
    formData.append('photo_quality_rating', rating);
    formData.append('desc_stars', rating1);
    formData.append('price_stars', rating2);
    formData.append('interest_stars', rating3);
    formData.append('content', commentContent);

    dispatch(postRating(formData)).then(response => {
      if (response.payload.data.success) {
        Alert.alert( response.payload.data.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert( response.payload.data.message);
      }
    });
  };
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
      if (response?.payload?.data?.length===0)  {
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
        <Image   source={{uri: item?.featured_image_src[0]?.guid}}
         style={styles.slide} />
      </TouchableOpacity>
      <View
        style={styles.listingkeycover}>
        <Text
          style={styles.innerlistingkey}>
       RX-{item.ListingKey}
        </Text>
      </View>

        <View
        style={{
          backgroundColor: item?.status === 'Active' ? Colors.surfblur : 'red',
          position: 'absolute',
          top: 8,
          right: 16,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 4,
        }}>
        <Text
          style={{
            fontSize: DeviceInfo.getDeviceType() === 'Tablet'?24:12,
            color: Colors.white,
            fontFamily: 'Poppins-Regular',
            marginBottom: 0,
            lineHeight: DeviceInfo.getDeviceType() === 'Tablet'?28:14,
            paddingTop: 4,
          }}>
        {item?.status}
        </Text>
      </View>

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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatSearch')}> 
            <Image
              source={Images.chatnew}
              style={{
                height: DeviceInfo.getDeviceType() === 'Tablet'?40:28,
                width: DeviceInfo.getDeviceType() === 'Tablet'?40:28,
                resizeMode: 'cover',
                marginRight: 15,
               
              }}></Image>
          </TouchableOpacity>

         <TouchableOpacity onPress={() => makePhoneCall()}>
            <Image source={Images.calenderwedding} style={{
              height:  DeviceInfo.getDeviceType() === 'Tablet'?37:27,
              width: DeviceInfo.getDeviceType() === 'Tablet'?44:33}}>
              </Image>
          </TouchableOpacity>
        </View>
      
        <View
          style={{
            flexDirection: 'row',
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
                })
              }}>
               <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                    }}>
                                    <Image
                                      source={
                                        item.total_average_rating > 0
                                          ? Images.startfill
                                          : Images.star2
                                      }
                                      style={{
                                        height: DeviceInfo.getDeviceType() === 'Tablet'?33:22,
                                        width: DeviceInfo.getDeviceType() === 'Tablet'?33:22,
                                        resizeMode: 'contain',
                                        tintColor:
                                          item.total_average_rating > 0
                                            ? undefined
                                            : 'black',
                                      }}
                                    />
                                    {item.total_average_rating > 0 ? (
                                      <Text
                                        style={{
                                          fontSize: 18,
                                          color: Colors.black,
                                          fontFamily: 'Poppins-Light',
                                        }}>
                                        {Math.round(item.total_average_rating)}
                                      </Text>
                                    ) : null}
                                  </View>
                                  </TouchableOpacity>
          </View>
          <TouchableOpacity style={{marginLeft:15}} onPress={() => handleShare(item.ID)}>
            <Image
              source={Images.sendnew}
              style={{
                height: DeviceInfo.getDeviceType() === 'Tablet'?26:18,
                width: DeviceInfo.getDeviceType() === 'Tablet'?33:23,
                resizeMode: 'contain',
              
              }}></Image>
          </TouchableOpacity>
        </View>
       

      </View>
      <TouchableOpacity
          onPress={() => navigation.navigate('ViewPropertiy', { item })}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?55:28,
              color: "#1450B1",
              fontFamily: 'Poppins-Medium',
              marginTop: 0,
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
            fontSize:  DeviceInfo.getDeviceType() === 'Tablet'?35:20,
            color: Colors.black,
            textAlign: 'center',
            fontFamily: 'Poppins-Light',
            marginTop:DeviceInfo.getDeviceType() === 'Tablet'?10:6,
            marginBottom:DeviceInfo.getDeviceType() === 'Tablet'?10:0,
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
                      }}>
                      Review
                    </Text>
                    <View
                      style={{
                        width: '100%',
                        marginTop: 0,
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
                justifyContent: 'space-between',
                marginBottom: 12,
                width: '100%',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                 width: DeviceInfo.getDeviceType() === 'Tablet'?100:70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.newbed}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet'?49:26,
                      width: DeviceInfo.getDeviceType() === 'Tablet'?39:21,
                      resizeMode: 'contain',
                    //backgroundColor: "green"
                    }}></Image>
                  <Text
                    style={{
                      fontSize:DeviceInfo.getDeviceType() === 'Tablet'?17:11,
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
                  width: DeviceInfo.getDeviceType() === 'Tablet'?100:70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.bathtub}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet'?44:26,
                      width: DeviceInfo.getDeviceType() === 'Tablet'?49:28,
                      resizeMode: 'contain', marginBottom: 5
                    }}></Image>
                  <Text
                    style={{
                      fontSize:DeviceInfo.getDeviceType() === 'Tablet'?17:11,
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
                  width: DeviceInfo.getDeviceType() === 'Tablet'?100:70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.measuringtape}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet'?45:26,
                                      width: DeviceInfo.getDeviceType() === 'Tablet'?47:27,
                                      resizeMode: 'contain',
                                      marginBottom: 5
                    }}></Image>
                  <Text
                    style={{
                      fontSize:DeviceInfo.getDeviceType() === 'Tablet'?17:11,
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
                  width: DeviceInfo.getDeviceType() === 'Tablet'?100:70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={Images.hoa2}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet'?47:26,
                      width: DeviceInfo.getDeviceType() === 'Tablet'?51:27,
                      marginTop: 0,
                      resizeMode: 'contain',
                      marginBottom: 5,
                    }}></Image>

                  <Text
                    style={{
                      fontSize:DeviceInfo.getDeviceType() === 'Tablet'?17:11,
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
                  width: DeviceInfo.getDeviceType() === 'Tablet'?100:70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.taxnew}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet'?47:27,
                      width: DeviceInfo.getDeviceType() === 'Tablet'?43:25,
                      marginTop: 0,
                      resizeMode: 'contain',
                      marginBottom: 5,
                    }}></Image>
                  <Text
                    style={{
                      fontSize:DeviceInfo.getDeviceType() === 'Tablet'?17:11,
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
                  width: DeviceInfo.getDeviceType() === 'Tablet'?100:70,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={Images.calendar}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet'?34:30,
                      width: DeviceInfo.getDeviceType() === 'Tablet'?40:30,
                      marginTop: 0,
                      resizeMode: 'contain',
                      marginBottom: 5,
                    }}></Image>
                  <Text
                    style={{
                      fontSize:DeviceInfo.getDeviceType() === 'Tablet'?17:11,
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
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom: 2,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            position: 'absolute',
            left: 12,
            justifyContent: 'flex-start',
            top: 13,
            width:50,
            height:50

          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              width: DeviceInfo.getDeviceType() === 'Tablet'?40:27,
              height: DeviceInfo.getDeviceType() === 'Tablet'?40:27,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              resizeMode: 'contain',
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
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
              color: Colors.black,
              fontFamily: 'Poppins-Light',
              lineHeight: DeviceInfo.getDeviceType() === 'Tablet'?42:22,
            }}>
           Recycle Bin
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
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
        <Image
          style={{height: DeviceInfo.getDeviceType() === 'Tablet'?30:15,
           width: DeviceInfo.getDeviceType() === 'Tablet'?26:13,
            resizeMode: 'contain'}}
          source={Images.favfilter}
        />
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
            contentContainerStyle={{ paddingBottom:50 }}
          />

        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  innerlistingkey:{
    fontSize: DeviceInfo.getDeviceType() === 'Tablet'?24:12,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    marginBottom: 0,
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet'?28:14,
    paddingTop: 4,
  },
  listingkeycover:{
    backgroundColor: Colors.surfblur,
    position: 'absolute',
    top: 8,
    left: 16,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
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
marginBottom:16
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: screenWidth - 16,
    height: screenWidth - 100,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
    resizeMode:"cover"
  },
  title: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet'?39:23,
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
  filter: {
    height: 60,
  },
  rating: {
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 18,
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
    height:DeviceInfo.getDeviceType() === 'Tablet'?29:19,
    width: DeviceInfo.getDeviceType() === 'Tablet'?49:29,

    resizeMode: 'contain',
   
  },
});

export default RecycleBin;
