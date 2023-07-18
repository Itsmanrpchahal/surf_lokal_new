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
  Linking,
  ActivityIndicator,
  Modal,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { getPopertiesDetails } from '../../modules/getPopertiesDetails';
import { useDispatch } from 'react-redux';
import { getAgent } from '../../modules/getAgent';
import { getRating } from '../../modules/getRating';
import { postUpdateRating } from '../../modules/postUpdateRating';
import { postRating } from '../../modules/postRating';
import AsyncStorage from '@react-native-community/async-storage';
import { Rating } from 'react-native-ratings';
import * as Animatable from 'react-native-animatable';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const ViewPropertiyImage = props => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');

  const [video, setvideo] = useState([]);
  const [orientation, setOrientation] = useState('portrait');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(0);
  const [agentData, setAgentData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef(null);

  const scrollViewRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 0);
  };
  const postID = props.route.params;
  console.log(postID.postid, 'ViewPropertiyImage Props');
  const property = data[0];
  console.log(property, 'ViewPropertiyImage dataa');

  useEffect(() => {
    getPopertiesDetailsApiCall();
    getAgentApicall();

    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    const handleChangeOrientation = () => {
      setOrientation(isPortrait() ? 'portrait' : 'landscape');
    };

    // Add event listener for orientation changes
    Dimensions.addEventListener('change', handleChangeOrientation);

    // Clean up the event listener when the component unmounts

    // Dimensions.removeEventListener('change', handleChangeOrientation);
  }, []);
  const getPopertiesDetailsApiCall = () => {
    setLoading(true);
    dispatch(getPopertiesDetails(postID.postid)).then(response => {
      console.log('ViewPropertiyImage Response', response);
      setLoading(false);
      setData(response.payload.data);
      console.log(data, 'dddddddddddddddddddddd');
    });
  };
  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {
      console.log('rrrohan', response.payload.data);
      setAgentData(response.payload.data);
    });
  };
  const makePhoneCall = () => {
    let phoneNumber = agentData[0]?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // const handleChangeOrientation = () => {
  //   setOrientation(isPortrait() ? 'portrait' : 'landscape');
  // };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const updateReview = async post_id => {
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
    formData.append('reviewtitle', reviewTitle);
    console.log(formData, 'rkrkrk');
    dispatch(postUpdateRating(formData)).then(response => {
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
    formData.append('reviewtitle', reviewTitle);
    console.log(formData, 'formdataformdata');
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

  const navigation = useNavigation();
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: '88%', width: '100%' }}>
        <ScrollView ref={scrollViewRef} onScroll={handleScroll}>
          
        <TouchableOpacity onPress={() => navigation.navigate('SingleImage', { imageUri: property?.featured_image_src })}>
  <Image source={{ uri: property?.featured_image_src }} style={styles.slide} />
</TouchableOpacity>
          <View style={{ height: 200, width: '100%' }}>
   
            <WebView
              style={{ height: 400, width: '100%' }}
              source={{ uri: property?.property_gallery.property_video }}
            // onLoad={console.log("loaded")}
            mediaPlaybackRequiresUserAction={false} 
           />
       
          </View>
          {property?.property_gallery.Gallery &&
            property?.property_gallery.Gallery.length > 0 ? (
            property?.property_gallery.Gallery.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('ViewImage', { image })}
                style={styles.slideOuter}>
                <Image source={{ uri: image.guid }} style={styles.slide} />
              </TouchableOpacity>
            ))
          ) : (
            <Text>No images found.</Text>
          )}

        </ScrollView>
        {isScrolled && (
          <TouchableOpacity onPress={scrollToTop} style={styles.buttonscroll} >
            <Image source={Images.upsideArrow} style={{ width: 18, height: 18, tintColor: Colors.white, resizeMode: "contain" }} />
          </TouchableOpacity>
        )}
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
        right: 10,
        top: -10,

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
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 70,
          marginTop: 10,
          justifyContent: 'center',
          borderTopWidth: 1,

          borderTopColor: Colors.textColorLight,
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <View
          style={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignContent: 'center',
            width: '50%',
            flexDirection: 'row',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}
              onPress={() => {
                // setProductId(postID.postid.ID);
                // setReviewTitle(postID.postid.title);
                // toggleModal();
                makePhoneCall()
              }}>
              <Image
                source={Images.call}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  textAlign: 'center',
                  marginLeft: 5,
                  fontFamily: 'Poppins-Regular',
                }}>
              Call
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}

              onPress={() => navigation.navigate('ChatSearch')}>
              <Image
                source={Images.chat}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  textAlign: 'center',
                  marginLeft: 5,
                  fontFamily: 'Poppins-Regular',
                }}>
                Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{

            width: '50%',
          }}>
<TouchableOpacity
  onPress={() => {
    navigation.navigate('ChatSearch', {
      initialMessage: 'When would you like to schedule a showing?',
      agentReply: 'A Lokal agent will confirm with you within the next 2 hours',
    });
  }}
  style={{
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlue,
    borderRadius: 14,
    height: 40,
    width: '80%',
  }}
>
  <Image
    source={Images.bookTour}
    style={{ height: 20, width: 20, resizeMode: 'contain' }}
  />
  <Text
    style={{
      fontSize: 10,
      color: Colors.white,
      textAlign: 'center',
      marginLeft: 5,
      fontFamily: 'Poppins-Regular',
    }}
  >
    SCHEDULE A SHOWING
  </Text>
</TouchableOpacity>

        </View>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View
          style={{
            // marginTop: 40,
            height: '95%',
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
          <View style={{}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.black,
                marginTop: 10,
                marginRight: 180,
              }}>
              Your Review
            </Text>
            <Text style={{ margin: 10, fontSize: 12, color: 'black' }}>
              {ratingData[0]?.comment_content}
            </Text>
            {!isEditing && (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 12, color: 'blue' }}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ width: '95%', height: '70%' }}>
            <View style={{ width: '95%', alignSelf: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={{ fontSize: 12, color: Colors.black }}>
                  Photos Quality Rating :
                </Text>
                <Rating
                  type="custom"
                  ratingCount={5}
                  imageSize={25}
                  startingValue={ratingData[0]?.photo_wuality_rating}
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
                  startingValue={ratingData[0]?.description_review_stars}
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
                  startingValue={ratingData[0]?.price_review_stars}
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
                  startingValue={ratingData[0]?.interest_review_stars}
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
                {isEditing ? (
                  <TextInput
                    style={{
                      margin: 10,
                      fontSize: 12,
                      color: 'black',
                      borderWidth: 1,
                      borderColor: 'gray',
                      borderRadius: 5,
                      padding: 5,
                    }}
                    value={review}
                    onChangeText={text => setReview(text)}
                    autoFocus
                  />
                ) : (
                  <Text style={{ margin: 10, fontSize: 12, color: 'black' }}>
                    {ratingData[0]?.comment_content}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                width: '100%',

                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingHorizontal: 10,
              }}>
              {isEditing ? (
                <TouchableOpacity
                  onPress={() => updateReview()}
                  style={{ marginRight: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: Colors.PrimaryColor,
                    }}>
                    Update
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => addReview()}
                  // onPress={() => setModalVisible(false)}
                  // onPress={Alert.alert("Hyy")}
                  style={{
                    height: 35,
                    width: '45%',
                    borderRadius: 5,
                    backgroundColor: Colors.PrimaryColor,
                    marginTop: 10,

                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
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
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.white,
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  slide: {
    width: screenWidth,
    height: screenHeight / 2.5,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  buttonscroll: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBlue,
    borderRadius: 20,
    height: 40,
    width: 40,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "yellow"
    backgroundColor: Colors.PrimaryColor,
  },
});

export default ViewPropertiyImage;
