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
  Animated,
  PanResponder,
  Linking,
  Share,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import { useDispatch} from 'react-redux';
import {getFavoriteProperties} from '../../modules/getFavoriteProperties';
const screenWidth = Dimensions.get('window').width;
import {postRating} from '../../modules/postRating';
import {getAgent} from '../../modules/getAgent';
import {getRating} from '../../modules/getRating';
import {postUpdateRating} from '../../modules/postUpdateRating';
import * as Animatable from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DeviceInfo from 'react-native-device-info';

import StarRating from 'react-native-star-rating-widget';
import Collapsible from 'react-native-collapsible';


const MyFavorites = props => {
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const [data, setHomeData] = useState([]);
  const [agentData, setAgentData] = useState([0]);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ratingData, setRatingData] = useState([]);

  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [productId, setProductId] = useState('');
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [commentContent, setComentContent] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    const formData = new FormData();
    formData.append('postid', productId);
    formData.append('comment_content', commentContent ? commentContent : '');
    formData.append('review_title', reviewTitle);
    formData.append('review_stars', rating);
    formData.append('description_review_stars', rating1);
    formData.append('price_review_stars', rating2);
    formData.append('interest_review_stars', rating3);
    console.log('postUpdateRating', formData);

    dispatch(postUpdateRating(formData)).then(response => {
      if (response.payload.success) {
        Alert.alert(response.payload.data.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert(response.payload.data.message);
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
    formData.append('content', commentContent ? commentContent : '');

    dispatch(postRating(formData)).then(response => {
      if (response.payload.data.success) {
        Alert.alert(response.payload.data.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert(response.payload.data.message);
      }
    });
  };

  useEffect(() => {
    if (isFocused) {
      Promise.all[(getFavoritePropertiesApiCall(), getAgentApicall())];
    }
  }, [isFocused]);
  const getFavoritePropertiesApiCall = () => {
    dispatch(getFavoriteProperties()).then(response => {
      if (response.payload.data.length < 1) {
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
      // alert(JSON.stringify(response.payload.data))
    });
  };

  const makePhoneCall = () => {
    let phoneNumber = agentData[0]?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
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

  const renderItem = ({item}) => (
    <View style={[styles.slideOuter]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ViewPropertiy', {
            ID: item.ID,
            from: 'MyFavorites',
          })
        }>
        <Image
          source={{uri: item?.featured_image_src[0].guid}}
          style={styles.slide}
        />
      </TouchableOpacity>

      <View style={styles.listingkeystyle}>
        <Text style={styles.listingkeytext}>{item?.ListingKey}</Text>
      </View>
      <View
        style={[
          {
            backgroundColor:
              item?.status === 'Active' ? Colors.surfblur : 'red',
          },
          styles.statusmain,
        ]}>
        <Text style={styles.secstatus}>{item?.status}</Text>
      </View>

      <View style={styles.iconscover}>
        <View style={styles.iconsiner}>
          <TouchableOpacity>
            <Image source={Images.favdownthumb} style={styles.chaticon}></Image>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => makePhoneCall()}>
            <Image
              source={Images.calenderwedding}
              style={styles.caldericon}></Image>
          </TouchableOpacity>
        </View>

        <View style={styles.anothericon}>
          <View style={styles.staricon}>
            <TouchableOpacity
              onPress={() => {
                setProductId(item.ID);
                setReviewTitle(item.title);
                toggleModal();
                dispatch(getRating(item.ID)).then(response => {
                  setRatingData(response?.payload?.data);
                  setRating(response?.payload?.data[0]?.photo_wuality_rating);
                  setRating1(
                    response?.payload?.data[0]?.description_review_stars,
                  );
                  setRating2(response?.payload?.data[0]?.price_review_stars);
                  setRating3(response?.payload?.data[0]?.interest_review_stars);
                });
              }}>
              <View style={styles.ratingmain}>
                <Image
                  source={
                    item.total_average_rating > 0
                      ? Images.startfill
                      : Images.star2
                  }
                  style={{
                    height: DeviceInfo.getDeviceType() === 'Tablet' ? 33 : 22,
                    width: DeviceInfo.getDeviceType() === 'Tablet' ? 33 : 22,
                    resizeMode: 'contain',
                    tintColor:
                      item.total_average_rating > 0 ? undefined : 'black',
                  }}
                />
                {item.total_average_rating > 0 ? (
                  <Text style={styles.lightrating}>
                    {Math.round(item.total_average_rating)}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.ml15}
            onPress={() => handleShare(item.ID)}>
            <Image source={Images.sendnew} style={styles.sendbutton}></Image>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('ViewPropertiy', {item})}>
        <Text style={styles.propertyprice}>{item.property_price}</Text>
      </TouchableOpacity>
      <View style={styles.titlecover}>
        <Text numberOfLines={1} style={styles.titletext}>
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
              <ScrollView style={styles.w100}>
                <View style={styles.covermodal}>
                  <View style={styles.indicatormodal}></View>
                </View>
                <View style={{}}>
                  <Text style={styles.yourreview}>Your Review</Text>
                </View>
                <View style={styles.w100}>
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      marginBottom: 10,
                    }}>
                    <View style={styles.labelcover}>
                      <Text style={styles.labeltext}>Photos :</Text>

                      <StarRating
                        maxStars={5}
                        starSize={22}
                        enableSwiping
                        enableHalfStar
                        color={Colors.surfblur}
                        rating={rating}
                        onChange={value => {
                          setRating(value);
                        }}
                      />
                    </View>
                  </View>

                  <View style={{width: '100%', alignSelf: 'center'}}>
                    <View style={styles.labelcover}>
                      <Text style={styles.labeltext}>
                        Description Accuracy :
                      </Text>

                      <StarRating
                        maxStars={5}
                        starSize={22}
                        enableSwiping
                        enableHalfStar
                        color={Colors.surfblur}
                        rating={rating1}
                        onChange={value => {
                          setRating1(value);
                        }}
                      />
                    </View>
                  </View>
                  <View style={{width: '100%', alignSelf: 'center'}}>
                    <View style={styles.labelcover}>
                      <Text style={styles.labeltext}>Price :</Text>

                      <StarRating
                        maxStars={5}
                        starSize={22}
                        enableSwiping
                        enableHalfStar
                        color={Colors.surfblur}
                        rating={rating2}
                        onChange={value => {
                          setRating2(value);
                        }}
                      />
                    </View>
                  </View>

                  <View style={{width: '100%', alignSelf: 'center'}}>
                    <View style={styles.labelcover}>
                      <Text style={styles.labeltext}>
                        Interest in Property :
                      </Text>

                      <StarRating
                        maxStars={5}
                        starSize={22}
                        enableSwiping
                        enableHalfStar
                        color={Colors.surfblur}
                        rating={rating3}
                        onChange={value => {
                          setRating3(value);
                        }}
                      />
                    </View>
                  </View>

                  <View style={styles.reviewtextcover}>
                    <Text style={styles.reviewtext}>Review</Text>
                    <View style={styles.reviewcover}>
                      {ratingData.length > 0 ? (
                        <TextInput
                          multiline={true}
                          style={styles.textinputstyle}
                          onChangeText={text => setComentContent(text)}
                          autoFocus
                        />
                      ) : (
                        <TextInput
                          onChangeText={text => setComentContent(text)}
                          multiline={true}
                          style={styles.textinputstyle}></TextInput>
                      )}
                    </View>
                  </View>
                  <View style={styles.buttoncover}>
                    {ratingData.length > 0 ? (
                      <View style={styles.buttonuppercover}>
                        <TouchableOpacity
                          onPress={() => updateReview()}
                          style={styles.mainbuttoncover}>
                          <Text style={styles.buttontextupdate}>Update</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.submitbuttonuppercover}>
                        <TouchableOpacity
                          onPress={() => addReview()}
                          style={styles.submitbuttoncover}>
                          <Text style={styles.submittxt}>Submit</Text>
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

      <View style={styles.iconcovertop}>
        {DeviceInfo.getDeviceType() === 'Tablet' ? (
          <View style={styles.modalmaincover}>
            <View style={styles.icontextcover}>
              <View style={styles.icontext}>
                <View style={styles.innericontext}>
                  <Image
                    source={Images.newbed}
                    style={styles.newbedstyle}></Image>
                  <Text style={styles.newtexticon}>
                    {item.property_bedrooms.length > 0
                      ? item.property_bedrooms
                      : 0}{' '}
                    {'Beds'}
                  </Text>
                </View>
              </View>

              <View style={styles.icontext}>
                <View style={styles.innericontext}>
                  <Image
                    source={Images.bathtub}
                    style={styles.bathtubicon}></Image>
                  <Text style={styles.newtexticon}>
                    {item.bathroomsfull.length > 0 ? item.bathroomsfull : 0}{' '}
                    {'Baths'}
                  </Text>
                </View>
              </View>

              <View style={styles.icontext}>
                <View style={styles.innericontext}>
                  <Image
                    source={Images.measuringtape}
                    style={styles.measureicon}></Image>
                  <Text style={styles.newtexticon}>
                    {item.property_size.length > 0 ? item.property_size : 0}{' '}
                    {'sq ft'}
                  </Text>
                </View>
              </View>

              <View style={styles.icontext}>
                <View style={styles.innericontext}>
                  <Image source={Images.hoa2} style={styles.hoaicon}></Image>

                  <Text style={styles.newtexticon}>
                    {item.associationfee.length > 0 ? item.associationfee : 0}
                  </Text>
                </View>
              </View>

              <View style={styles.icontext}>
                <View style={styles.innericontext}>
                  <Image source={Images.taxnew} style={styles.taxicon}></Image>
                  <Text style={styles.newtexticon}>
                    {item.taxannualamount.length > 0 ? item.taxannualamount : 0}
                  </Text>
                </View>
              </View>
              <View style={styles.icontext}>
                <View style={styles.innericontext}>
                  <Image
                    source={Images.calendar}
                    style={styles.calsicon}></Image>
                  <Text style={styles.newtexticon}>
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
            <View style={styles.iconsuppercover}>
              <View style={styles.icontextcover}>
                <View style={styles.icontext}>
                  <View style={styles.innericontext}>
                    <Image
                      source={Images.newbed}
                      style={styles.newbedstyle}></Image>
                    <Text style={styles.newtexticon}>
                      {item.property_bedrooms.length > 0
                        ? item.property_bedrooms
                        : 0}{' '}
                      {'Beds'}
                    </Text>
                  </View>
                </View>

                <View style={styles.icontext}>
                  <View style={styles.innericontext}>
                    <Image
                      source={Images.bathtub}
                      style={styles.bathtubicon}></Image>
                    <Text style={styles.newtexticon}>
                      {item.bathroomsfull.length > 0 ? item.bathroomsfull : 0}{' '}
                      {'Baths'}
                    </Text>
                  </View>
                </View>

                <View style={styles.icontext}>
                  <View style={styles.innericontext}>
                    <Image
                      source={Images.measuringtape}
                      style={styles.measureicon}></Image>
                    <Text style={styles.newtexticon}>
                      {item.property_size.length > 0 ? item.property_size : 0}{' '}
                      {'sq ft'}
                    </Text>
                  </View>
                </View>

                <View style={styles.icontext}>
                  <View style={styles.innericontext}>
                    <Image source={Images.hoa2} style={styles.hoaicon}></Image>
                    <Text style={styles.newtexticon}>
                      {item.associationfee.length > 0 ? item.associationfee : 0}
                    </Text>
                  </View>
                </View>

                <View style={styles.icontext}>
                  <View style={styles.innericontext}>
                    <Image
                      source={Images.taxnew}
                      style={styles.taxicon}></Image>
                    <Text style={styles.newtexticon}>
                      {item.taxannualamount.length > 0
                        ? item.taxannualamount
                        : 0}
                    </Text>
                  </View>
                </View>
                <View style={styles.icontext}>
                  <View style={styles.innericontext}>
                    <Image source={Images.cals} style={styles.calsicon}></Image>
                    <Text style={styles.newtexticon}>
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
      <View style={styles.mainheader}>
        <TouchableOpacity
          style={styles.leftheader}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.leftheaderimage}
            source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centerheader}>
          <Text style={styles.centertext}>Favorites</Text>
        </View>
        <TouchableOpacity
          style={styles.rightheader}
          onPress={() => navigation.goBack()}>
          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.filtercover}>
        <TouchableOpacity
          onPress={() => {
            setIsCollapsed(!isCollapsed);
          }}>
          <Image style={[styles.filterimage,{ transform: isCollapsed ? [{ rotate: '90deg' }] : [{ rotate: '0deg' }]}]} source={Images.favfilter} />
        </TouchableOpacity>
      </View>
      <Collapsible collapsed={!isCollapsed} style={styles.collapsecover}>
         <Text style={styles.sortby}>Sort by</Text>
        <View style={styles.collapsebg}>
          <TouchableOpacity onPress={() => {setIsCollapsed(false)}} style={styles.collapupper}>
          <Image
              source={Images.calenderwedding}
              style={styles.colimg}></Image>
             <Text style={styles.coltxt}>Date Favorited</Text>
             
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setIsCollapsed(false)}} style={styles.collapupper}>
          <Image
              source={Images.calenderwedding}
              style={styles.colimg}></Image>
             <Text style={styles.coltxt}>Days on Market</Text>
             
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setIsCollapsed(false)}} style={styles.collapupper}>
          <Image
              source={Images.low}
              style={styles.colimg}></Image>
             <Text style={styles.coltxt}>Price (Low to High) </Text>
             
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setIsCollapsed(false)}} style={styles.collapupper}>
          <Image
              source={Images.lowhigh}
              style={styles.colimg}></Image>
             <Text style={styles.coltxt}>Price (High to Low)</Text>
             
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setIsCollapsed(false)}} style={styles.collapupper}>
          <Image
              source={Images.newbed}
              style={styles.colimg}></Image>
             <Text style={styles.coltxt}>Beds (High to Low)</Text>
             
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setIsCollapsed(false)}} style={styles.collapupper}>
          <Image
              source={Images.bathtub}
              style={styles.colimg}></Image>
             <Text style={styles.coltxt}>Baths (High to Low)</Text>
             
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setIsCollapsed(false)}} style={styles.collapupper}>
          <Image
              source={Images.measuringtape}
              style={styles.colimg}></Image>
             <Text style={styles.coltxt}>Sq Ft (High to Low)</Text>
             
          </TouchableOpacity>
        </View>
      </Collapsible>
      <View style={{height: '100%', width: '100%'}}>
        {showNoDataMessage ? (
          <View style={styles.nofav}>
            <Text style={styles.nofavtext}>No Property in Favorite !!</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListFooterComponent={<View style={{height: 70}}></View>}
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
  filtercover: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 16,
  },
  rightheader: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  nofavtext: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  nofav: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  filterimage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 15,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 13,
    resizeMode: 'contain',

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
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,

    resizeMode: 'contain',
  },
  listingkeystyle: {
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
  listingkeytext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 24 : 12,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    marginBottom: 0,
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
    paddingTop: 4,
  },
  statusmain: {
    position: 'absolute',
    top: 8,
    right: 16,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  secstatus: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 24 : 12,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    marginBottom: 0,
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
    paddingTop: 4,
  },
  iconscover: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  iconsiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chaticon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 37 : 27,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 32,
    resizeMode: 'contain',
    marginRight: 15,
    position: 'relative',
    top: 4,
  },
  caldericon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 37 : 27,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 44 : 33,
  },
  anothericon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  staricon: {
    position: 'relative',
    flexDirection: 'row',
  },
  ratingmain: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  lightrating: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
  },
  sendbutton: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 18,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 33 : 23,
    resizeMode: 'contain',
  },
  ml15: {marginLeft: 15},
  propertyprice: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 28,
    color: '#1450B1',
    fontFamily: 'Poppins-Medium',
    marginTop: 0,
  },
  titlecover: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  titletext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    marginTop: 6,
  },
  w100: {width: '100%'},
  covermodal: {alignItems: 'center', justifyContent: 'center'},
  indicatormodal: {
    width: 50,
    height: 5,
    backgroundColor: '#bac1c3',
    marginTop: 0,
    justifyContent: 'center',
    borderRadius: 100,
  },
  yourreview: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginTop: 5,
  },
  icontext: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 100 : 70,
  },
  innericontext: {justifyContent: 'center', alignItems: 'center'},
  newbedstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 21,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  newtexticon: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 17 : 11,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
  calsicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 34 : 30,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 30,
    marginTop: 0,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  labeltext: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
  },
  taxicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 27,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 43 : 25,
    marginTop: 0,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  hoaicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 51 : 27,
    marginTop: 0,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  measureicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 45 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 27,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  bathtubicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 44 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 28,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  icontextcover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
    alignSelf: 'center',
  },
  iconsuppercover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
  modalmaincover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
  mainheader: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  leftheader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    // top: 12,
    top: 13,
    // backgroundColor:"green",
    width: 50,
    height: 50,
  },
  centerheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftheaderimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  buttontextupdate: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  mainbuttoncover: {
    height: 50,
    width: '40%',
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttoncover: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  collapupper:{flexDirection:"row",
  alignItems:"center",justifyContent:"center",borderBottomWidth:1,
  borderBottomColor:Colors.BorderColor,paddingBottom:15,paddingTop:15,
//height:100
},
  buttonuppercover: {
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'flex-end',
  },
  textinputstyle: {
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
  },
  reviewcover: {
    width: '100%',
    marginTop: 0,
    flexWrap: 'wrap',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    height: 100,
    width: '100%',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  reviewtext: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginTop: 10,
    // marginRight: 180
  },
  centertext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  reviewtextcover: {
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  submittxt: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  submitbuttoncover: {
    height: 45,
    width: 130,
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitbuttonuppercover: {
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'flex-end',
  },
  labelcover: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconcovertop: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  collapsecover:{
    
  }

  colimg:{height:36,width:36, resizeMode:"contain",marginRight:8},
  coltxt:{fontSize:18, fontFamily:"Poppins-Light" , color:Colors.black},
 collapsecover:{position:"absolute", top:50 ,left:0,right:0,backgroundColor:"red",width:"90%",zIndex:999},

  sortby:{fontSize:21, fontFamily:"Poppins-SemiBold", color:Colors.black, textAlign:"center",
  marginBottom:15,paddingTop:15}

});

export default MyFavorites;
