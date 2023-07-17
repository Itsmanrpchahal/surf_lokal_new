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
  Linking,
  Share,
  Modal,
  KeyboardAvoidingView
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

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [data, setHomeData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    // setModalVisible(!modalVisible);
  };
  const [rating, setRating] = useState(0);
  const handleRating = rating => {
    setRating(rating);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    getFavoritePropertiesApiCall();
  }, []);
  const getFavoritePropertiesApiCall = () => {
    dispatch(getFavoriteProperties()).then(response => {
      console.log('res-ppp', response.payload);
      setHomeData(response.payload.data);
    });
  };
  // useEffect(() => {
  //   Orientation.lockToPortrait();
  //   return () => {
  //     Orientation.unlockAllOrientations();
  //   };
  // }, []);
  const makePhoneCall = () => {
    let phoneNumber = '512458790';
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
  const renderItemImage = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('ViewPropertiy', { item: data })}
      style={styles.slideOuter}>
      <Image source={{ uri: data?.featured_image_src }} style={styles.slide}></Image>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.slideOuter}>
      {/* <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> */}
      <TouchableOpacity

        onPress={() => { navigation.navigate('ViewPropertiy', { item: item }) }}>
        <Image source={{ uri: item?.featured_image_src }} style={styles.slide} />
      </TouchableOpacity>

      <View
        style={{
          height: 30,
          width: 170,
          backgroundColor: Colors.white,
          position: 'absolute',
          top: 30,
          right: 16,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            color: Colors.black,
          }}>
          {'RX -'} {item?.ListingKey}
        </Text>
      </View>
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
            onPress={() => navigation.navigate('Conversations')}>
            <Image
              source={Images.chatProp}
              style={{ height: 20, width: 20 }}></Image>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ViewPropertiy')}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.primaryBlue,
              fontWeight: '500',
              fontFamily: 'Poppins-Regular'
            }}>
            {'$'}
            {item.originallistprice}
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
          <View style={{}}>
            <TouchableOpacity onPress={toggleModal}>
              <Image
                source={Images.star}
                style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
            </TouchableOpacity>
            <Text
              style={{ fontSize: 14, color: Colors.black, textAlign: 'center' }}>
              {item.total_average_rating}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleShare()}>
            <Image
              source={Images.send}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
          </TouchableOpacity>
        </View>
      </View>
      {/* <KeyboardAvoidingView >

<Modal
  transparent={true}
  animationType="slide"
  visible={modalVisible}
  onRequestClose={toggleModal}>
  <View
    style={{
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
            fontFamily:'Poppins-Regular'
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
          <Text style={{ fontSize: 12, color: Colors.black,fontFamily:'Poppins-Regular' }}>
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
          <Text style={{ fontSize: 12, color: Colors.black,fontFamily:'Poppins-Regular' }}>
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
          <Text style={{ fontSize: 12, color: Colors.black,fontFamily:'Poppins-Regular' }}>
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
          <Text style={{ fontSize: 12, color: Colors.black,fontFamily:'Poppins-Regular' }}>
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
            fontFamily:'Poppins-Regular'
          }}>
          Review
        </Text>
        <View
          style={{
            width: '100%',
            height: 100,
            marginTop: 10,
          }}>
          <TextInput
            style={{
              width: '100%',
              borderRadius: 8,
              height: '100%',
              paddingHorizontal: 12,
              color: Colors.black,
              borderWidth: 1,
              borderColor: Colors.gray,
              fontSize: 14,
              alignItems:"flex-start",
              alignSelf:"flex-start",
              verticalAlign:"top"
            }}
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
              fontFamily:'Poppins-Regular'
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
</KeyboardAvoidingView> */}
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
      <TouchableOpacity
        onPress={() => navigation.navigate('ViewPropertiy')}
        style={{
          width: '95%',
          alignSelf: 'center',
          justifyContent: 'center',
          marginTop: 5,
        }}>
        <Text style={{
          fontSize: 16, color: Colors.black,
          textAlign: 'center', fontFamily: 'Poppins-Regular'
        }}>
          {item.Title}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          width: '90%',

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
              style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 12,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: 'Poppins-Regular'
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
              style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 12,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: 'Poppins-Regular'
              }}>
              {item.bathroomsfull} {'Baths'}
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
              style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 12,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: 'Poppins-Regular'
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
            <Image
              source={Images.hoa}
              style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 12,
                color: Colors.black,
                textAlign: 'center',
                fontFamily: 'Poppins-Regular'
              }}>
              {'$'} {item.associationfee == null ? 0 : item.associationfee}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: '80%',
          height: 60,
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 20, color: Colors.black, fontFamily: 'Poppins-Regular' }}>Favorties</Text>
      </View>
      <View style={{ height: '100%', width: '100%' }}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListFooterComponent={<View style={{ height: 70 }}></View>}
        />
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
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  slide: {
    width: screenWidth - 40,
    height: screenHeight / 4,
    borderRadius: 18,
    margin: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular'
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

export default Home;