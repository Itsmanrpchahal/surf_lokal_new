import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  PanResponder,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  Linking,
  Share,
  Platform,
} from 'react-native';
import CardsSwipe from 'react-native-cards-swipe';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {useDispatch} from 'react-redux';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import {postRating} from '../../modules/postRating';
import {useNavigation} from '@react-navigation/native';
import {getPopertiesDetails} from '../../modules/getPopertiesDetails';
import DeviceInfo from 'react-native-device-info';
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";
import { TypingAnimation } from 'react-native-typing-animation';


import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {getRating} from '../../modules/getRating';
import {postUpdateRating} from '../../modules/postUpdateRating';
import {store} from '../../redux/store';
import {addToFavorite} from '../../modules/addToFavorite';
import {addRemoveTrash} from '../../modules/addRemoveTrash';
import {getAgent} from '../../modules/getAgent';
import StarRating from 'react-native-star-rating-widget';
import LottieView from 'lottie-react-native';
import Loader from '../../components/Loader';
import { schoolChat } from '../../modules/schoolChat';

import { ScreenWidth } from 'react-native-elements/dist/helpers';
const screenWidth = Dimensions.get('window').width;

const {width} = Dimensions.get('screen');

const ViewPropertiy = (props, imageUrl) => {
  const postid = props.route.params;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [commentContent, setComentContent] = useState('dada');

  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const property = data[0];

  const [calData, setCalData] = useState([]);
  const [schoolRating, setSchoolRating] = useState([]);
  const navigation = useNavigation();
  const [readmore, setreadmore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [agentData, setAgentData] = useState([0]);
  const [showFullContent, setShowFullContent] = useState(false);
  const [map, setMap] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [weather, setweather] = useState([]);
  const [tax, settax] = useState([]);
  const [walk, setWalk] = useState([]);
  const [ratingData, setRatingData] = useState([]);

  const [pin, setPin] = useState(null);

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://surflokal.page.link/property?propetyID=${postid.ID}`,
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
  const screenHeight = Dimensions.get('window').height;
  const firstViewHeight = (screenHeight * 60) / 100;
  const handleShare = async () => {
    const link = await generateLink();
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

  useEffect(() => {
    getPopertiesDetailsApiCall();
    getAgentApicall();
  }, []);
  useEffect(() => {
    scale.setValue(0.9);
    opacity.setValue(1);
    animation.setValue({x: 0, y: 0});
  }, []);

  const animation = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const getPopertiesDetailsApiCall = () => {
    setLoading(true);
    dispatch(getPopertiesDetails(postid.ID)).then(response => {
      setLoading(false);
      setData(response.payload.data);
      setCalData(response.payload.data[0].moartage || []);
      setSchoolRating(response.payload.data[0].school);
      setweather(response.payload.data[0].current_weather);
      settax(response.payload.data[0].tax_history);
      setWalk(response.payload.data[0].walkscore || []);
      setMap(response.payload.data[0].address.property_address);
      setPin({
        latitude:
          response.payload.data[0].address.property_address.property_latitude,
        longitude:
          response.payload.data[0].address.property_address.property_longitude,
      });
      const res = [
        {
          ID: productId,
          property_longitude: map.property_longitude.toString(),
          property_latitude: map.property_latitude.toString(),
        },
      ];
      const property = res[0];
      latitude = parseFloat(property.property_latitude);
      longitude = parseFloat(property.property_longitude);
    });
  };
  const makePhoneCall = () => {
    let phoneNumber = agentData[0]?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const savefile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');

    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('post_id', post_id);

    await dispatch(addToFavorite(formData)).then(response => {
      if (response.payload.success) {

      } else {
  
      }
    });
    navigation.goBack();
  };
  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {
      setAgentData(response.payload.data);
    });
  };

  const trashfile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('post_id', post_id);

    await dispatch(addRemoveTrash(formData)).then(response => {
      if (response.payload.success) {
      
      } else {

      }
    });

    navigation.goBack();
  };

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
  const Details = () => {
    return (
      <>
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.viewstyle}>
            <View style={{width: '50%'}}>
              <Text style={styles.property}>Property Details</Text>
              <Text style={styles.props}>
                Price: <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.property_details.price)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Est. Taxes: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.property_details.taxes)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Bedrooms: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.property_details.bedrooms)}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Bathrooms: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.property_details.bedrooms)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Size:  <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(
                    item => item.details.property_details.property_size,
                  )} {' '}
                  sq ft{' '}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Garage Spaces: <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.property_details.garagespaces)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Lot Size:  <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.hoa_fee)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Year Built :  <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.property_details.yearbuilt)}{' '}
                </Text> {' '}
              </Text>
              <Text style={styles.props}>
                Total Stories: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.property_details.storiestotal)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Days on Market : {' '} <Text style={{fontFamily: 'Poppins-Light'}}>1</Text>
              </Text>
            </View>
            <View style={{width: '50%'}}>
              <Text style={styles.property}>Community Details</Text>
              <Text style={styles.props}>
                Community Name: {' '}  <Text style={{fontFamily: 'Poppins-Light',lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 22,
                  }}>
                  {data.map(
                    item => item.details.community_details.community_name,
                  )}
                </Text>
              </Text>
              <Text style={styles.props}>
                HOA Fee Includes: {' '} <Text style={{fontFamily: 'Poppins-Light',lineHeight:DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 22,
                  }}>
                  {data.map(item => item.hoa_fee)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Community Features: {' '}
                <Text style={{ fontFamily: 'Poppins-Light', lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 22,
                  }}>
                  Bike Storage, Community Kitchen, Fitness Center, Library,
                  Barbecue, Picnic Area, Pool, Shuffleboard Court, Spa Hot Tub,
                  Storage, Trash, Vehicle Wash Area, Elevators Boat Facilities,
                  Non Gated
                </Text>
              </Text>
              {/* <Text style={styles.props}>HOA Fee Frequency: {data.map((item) => item.associationfeefrequency)}  </Text>
               */}
            </View>
          </View>
          <View style={styles.viewstyle}>
            <View style={{width: '50%'}}>
              <Text style={styles.property}>Interior Features</Text>
              <Text style={styles.props}>
                A/C: {' '}  <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.interior_features.A_C)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Heating: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.interior_features.heating)}
                </Text>
              </Text>
              <Text style={styles.props}>
                Flooring: {' '}  <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.interior_features.flooring)}{' '}
                </Text>
              </Text>
              <Text style={styles.props}>
                Property Rooms: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(
                    item => item.details.interior_features.property_rooms,
                  )}
                </Text>
              </Text>
            </View>
            <View style={{width: '50%'}}>
              <Text style={styles.property}>Exterior Features</Text>
              <Text style={styles.props}>
                Architectural Style: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(
                    item => item.details.exterior_features.architecturalstyle,
                  )}
                </Text>
              </Text>
              <Text style={styles.props}>
                Construction: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(
                    item => item.details.exterior_features.construction,
                  )}
                </Text>
              </Text>
              <Text style={styles.props}>
                Roofing: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.exterior_features.roofing)}{' '}
                </Text>
              </Text>
              <Text style={styles.props}>
                Water Source: {' '} <Text style={{fontFamily: 'Poppins-Light'}}>
                  {data.map(item => item.details.exterior_features.watersource)}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.viewstyle}>
            <View style={{width: '100%', marginTop: 30}}>
              <Text style={styles.property}>Miscellaneous Details</Text>
              <Text style={styles.props}>
                Driving Directions: {' '} <Text style={{fontFamily: 'Poppins-Light', lineHeight: 25}}>
                  {data.map(
                    item =>
                      item.details.miscellaneous_details.driving_directions,
                  )}
                </Text> {' '}
              </Text>
              <Text style={styles.props}>
                Listing Office: {' '} <Text style={{fontFamily: 'Poppins-Light', lineHeight: 25}}>
                  {data.map(
                    item => item.details.miscellaneous_details.listing_office,
                  )}
                </Text> {' '}
              </Text>
              <Text style={styles.props}>
                Listing Agent: {' '}  <Text style={{fontFamily: 'Poppins-Light', lineHeight: 25}}>
                  {data.map(
                    item => item.details.miscellaneous_details.listing_agent,
                  )}
                </Text>{' '}
              </Text>
              <Text style={styles.props}>
                Listing Office Phone: {' '} <Text style={{fontFamily: 'Poppins-Light', lineHeight: 25}}>
                  {data.map(
                    item =>
                      item.details.miscellaneous_details.listing_office_phone,
                  )}
                </Text> {' '}
              </Text>
              <Text style={styles.props}>
                Data Disclaimer: {' '} <Text style={{fontFamily: 'Poppins-Light', lineHeight: 25}}>
                  {data.map(
                    item => item.details.miscellaneous_details.data_disclaimer,
                  )}
                </Text> {' '}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const Featuers = () => {
    return (
      <>
        <ScrollView style={{paddingHorizontal: 16}}>
          <View style={styles.viewstyle}>
            <View style={{width: '100%'}}>
              <Text style={[styles.property, {marginBottom: 8}]}>
                {' '}
                Property Features & Amenities{' '}
              </Text>
              <FlatList
                numColumns={2}
                data={property?.features?.property_features}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <>
                    <View
                      style={{
                        width: '50%',
                        paddingHorizontal: 4,
                        marginBottom:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 10,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={Images.check}
                        style={{
                          height:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 18,
                          width:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 18,
                          resizeMode: 'contain',
                          marginRight: 5,
                        }}></Image>
                      <Text
                        style={{
                          color: Colors.black,
                          fontFamily: 'Poppins-Light',
                          fontSize:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 19 : 12,
                        }}>
                        {item}
                      </Text>
                    </View>
                  </>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </>
    );
  };
  const Address = () => {
    console.log("pppppp",property)
    const handleCalloutPress = () => {
      // Code to handle the press event on the callout
    };

    return (
      <ScrollView style={{paddingHorizontal: 16}}>
        <View style={[styles.viewstyle1, {marginTop: 20}]}>
          <View style={{width: '100%'}}>
            <Text style={[styles.property, {marginBottom: 6}]}>
              {' '}
              Property Address & Location{' '}
            </Text>
            <Text style={styles.props}>
              Address:{' '}
              <Text style={{fontFamily: 'Poppins-Light'}}>
                {' '}
                {property?.address.property_address.address}
              </Text>
            </Text>
            <Text style={styles.props}>
              Area:{' '}
              <Text style={{fontFamily: 'Poppins-Light'}}>
                {' '}
                {property?.address.property_address.area}
              </Text>
            </Text>
            <Text style={styles.props}>
              State:{' '}
              <Text style={{fontFamily: 'Poppins-Light'}}>
                {' '}
                {property?.address.property_address.state_county}
              </Text>
            </Text>
            <Text style={styles.props}>
              County:{' '}
              <Text style={{fontFamily: 'Poppins-Light'}}>
                {' '}
                {property?.address.property_address.Country}
              </Text>
            </Text>
            <Text style={styles.props}>
              Zip:{' '}
              <Text style={{fontFamily: 'Poppins-Light'}}>
                {' '}
                {property?.address.property_address.zip}
              </Text>
            </Text>
            {/* {/ <Text style={styles.propsmain}>Zip: {JSON.stringify(pin)} <Text style={styles.propsinnermain}>{property?.address.property_address.zip}</Text ></Text> /} */}
          </View>
          <View style={styles.maincovermap}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              region={{
                latitude: parseFloat(pin.latitude),
                longitude: parseFloat(pin.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker
                showCallout={true}
                coordinate={{
                  latitude: parseFloat(pin.latitude),
                  longitude: parseFloat(pin.longitude),
                }}>
                <Image
                  source={Images.locationss}
                  style={{height: 50, width: 100, resizeMode: 'contain'}}
                />

                <Callout
                  onPress={() => {
                    navigation.navigate('ViewProperty2', {ID:property.ID});
                  }}
                  style={{
                    height: 70,
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginLeft: 20,
                    top: -15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignContent: 'center',
                      marginLeft: 20,
                      top: -12,
                    }}>
                    <Text
                      style={{
                        position: 'relative',
                        height: 100,
                        top: -20,
                      }}>
                      <Image
                        style={{height: 80, width: 100, resizeMode: 'stretch'}}
                        source={{uri: property?.featured_image_src}}
                        resizeMethod="auto"
                      />
                    </Text>
                    <View style={{flexWrap: 'wrap', top: -5}}>
                      <Text
                        style={{
                          color: 'black',
                          marginLeft: 10,
                          fontWeight: '500',
                          flexWrap: 'wrap',
                        }}>
                        {property?.address.property_address.address} |{' '}
                        {property?.address.property_address.state_county}
                      </Text>
                      <Text
                        style={{
                          color: Colors.primaryBlue,
                          marginLeft: 10,
                          fontWeight: '500',
                        }}>
                        {data.map(item => item.details.property_details.price)}
                      </Text>
                      <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <Text style={{color: Colors.black}}>
                          {store?.getState()?.getPopertiesDetailsReducer
                            ?.getPopertiesDetails?.data[0]?.bedrooms?.length > 0
                            ? store.getState()?.getPopertiesDetailsReducer
                                ?.getPopertiesDetails?.data[0]?.bedrooms
                            : 0}
                          {' Beds'}{' '}
                        </Text>
                        <Text style={{color: Colors.black}}>
                          {store?.getState()?.getPopertiesDetailsReducer
                            .getPopertiesDetails?.data[0]?.bathroomsfull?.length >
                          0
                            ? store?.getState()?.getPopertiesDetailsReducer
                                ?.getPopertiesDetails?.data[0]?.bathroomsfull
                            : 0}
                          {' Baths'}{' '}
                        </Text>
                        <Text style={{color: Colors.black}}>
                          {store?.getState()?.getPopertiesDetailsReducer
                            ?.getPopertiesDetails?.data[0]?.details
                            .property_details.property_size.length > 0
                            ? store?.getState()?.getPopertiesDetailsReducer
                                ?.getPopertiesDetails?.data[0]?.details
                                ?.property_details?.property_size
                            : 0}
                          {' sq ft'}{' '}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Callout>
              </Marker>
            </MapView>
          </View>
        </View>
      </ScrollView>
    );
  };
  const NearBy = () => {
    return (
      <>
        <Text
          style={[
            styles.property,
            {
              marginBottom: 10,
              paddingBottom: 0,
              paddingHorizontal: 16,
              paddingTop: 20,
            },
          ]}>
          What’s Nearby?
        </Text>
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.address1}>
            <FlatList
              data={property?.what_is_nearby}
              renderItem={({item}) => (
                <>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 3,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                          fontFamily: 'Poppins-Light',
                          marginRight: 5,
                        }}>
                        {item.unite_name}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontSize:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                          fontFamily: 'Poppins-Light',
                          lineHeight: 22,
                        }}>
                        {item.unit_distance}
                      </Text>
                    </View>
                    {/* <View>
                      <Image style={{ height: 15, width: 100, resizeMode: "contain" }} source={{ uri: item.image_url }} />
                    </View>  */}
                  </View>
                </>
              )}
            />
          </View>
        </View>
      </>
    );
  };
  const WalkSco = () => {
    return (
      <>
        <View style={styles.addresss}>
          <WebView
            source={{uri: walk?.walkscore_details}}
            onLoad={console.log('loaded')}
            style={{width: '100%'}}
          />
        </View>
      </>
    );
  };
  const CurrentWeather = () => {
    return (
      <>
        <View style={{paddingHorizontal: 16}}>
          <Text style={[styles.property, {marginTop: 20}]}>
            Current Weather
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
            <View style={[styles.addresss, {width: '40%'}]}>
              <View style={{marginBottom: 15}}>
                <Text style={styles.props}>Location </Text>
                <Text
                  style={{
                    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 19 : 12,
                    fontFamily: 'Poppins-Light',
                    color: 'black',
                  }}>
                  {weather.location_name}
                </Text>
              </View>

              <View style={{marginBottom: 15}}>
                <Text style={styles.props}>Local Time </Text>
                <Text
                  style={{
                    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 19 : 12,
                    fontFamily: 'Poppins-Light',
                    color: 'black',
                  }}>
                  {weather.location_localtime}
                </Text>
              </View>

              <View style={{marginBottom: 15, position: 'relative'}}>
                <Text style={styles.props}>Conditions </Text>
                <Text
                  style={{
                    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 19 : 12,
                    fontFamily: 'Poppins-Light',
                    color: 'black',
                  }}>
                  {weather.condition_text}
                </Text>
                <Image
                  style={{
                    width: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 30,
                    height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 30,
                    position: 'absolute',
                    bottom: DeviceInfo.getDeviceType() === 'Tablet' ? -12 : 0,
                    left: 90,
                  }}
                  source={{uri: weather?.current_condition_icon}}
                />
              </View>
              <View style={{marginBottom: 15}}>
                <Text style={styles.props}>Current Temperature </Text>
                <Text
                  style={{
                    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 19 : 12,
                    fontFamily: 'Poppins-Light',
                    color: 'black',
                  }}>
                  {((+weather.current_temp * 9) / 5 + 32).toFixed(2)}
                  {' ℉'}
                </Text>
              </View>
            </View>
            {/* <LottieView 
            style={{ height:194, width: 200 ,}}      
            source={require('../../assets/animations/WeatherCode.json')} 
            autoPlay loop  />  */}
            <LottieView
              style={{
                height: DeviceInfo.getDeviceType() === 'Tablet' ? 250 : 150,
                width: DeviceInfo.getDeviceType() === 'Tablet' ? 250 : 150,
              }}
              source={require('../../assets/animations/WeatherCode.json')}
              autoPlay
              loop
            />
          </View>
          <View style={{marginBottom: 15}}>
            <Text style={styles.props}>Local Forecast</Text>
            <Text
              style={{
                fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 19 : 12,
                fontFamily: 'Poppins-Light',
                color: 'black',
              }}>
              Mostly Sunny conditions expected today with a few scattered
              showers around 5pm.
            </Text>
          </View>
        </View>
      </>
    );
  };
  const Calculator = () => {
    return (
      <>
        <View style={{height: '100%', width: '100%'}}>
          <Text
            style={[styles.property, {marginTop: 20, paddingHorizontal: 16}]}>
            Mortgage Calculator
          </Text>

          {/* <View style={[styles.addresss, { height: "100%" }]}> */}
          <ScrollView
            style={[styles.addresss1, {flex: 1, flexGrow: 1, height: '100%'}]}>
            <WebView
              style={{flex: 1, height: 2300}}
              // scrollEnabled={true}
              //nestedScrollEnabled
              source={{uri: calData?.moartage_details}}
              onLoad={() => console.log('loaded')}
            />
          </ScrollView>
        </View>

        {/* </View> */}
      </>
    );
  };
  const School = () => {
  const [schoolModalVisible, setSchoolModalVisible] = useState(false);
  const [res, setRes] = useState([])
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)
    // const handleLinkPress = url => {
    //   Linking.openURL(url).catch(error =>
    //     console.error('An error occurred: ', error),
    //   );
    // };
const schoolModal = ()=>{
  setSchoolModalVisible(!schoolModalVisible)
}
const closeSchoolModal = () => {
  setSchoolModalVisible(false);
};


useEffect(() => {

}, [res])
const navigation = useNavigation();
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const dateTimeString = `${year}-${month}-${date} ${hours}:${minutes}`;
  return dateTimeString;
};
    return (
      <>
        <Text
          style={[
            styles.property,
            {
              marginBottom: 0,
              paddingBottom: 0,
              padding: 0,
              margin: 0,
              paddingHorizontal: 16,
              marginTop: 20,
              marginBottom: 5,
            },
          ]}>
          Closest Schools
        </Text>

        <View style={{paddingHorizontal: 16}}>
          <View>
            <FlatList
              data={schoolRating.school_Info}
              renderItem={({item}) => (
                <>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignContent: 'center',
                      marginVertical: 5,
                      justifyContent: 'space-between',
                      // borderBottomColor: Colors.BorderColor, borderBottomWidth: 1,
                      paddingBottom: 20,
                      marginBottom: 10,
                    }}>
                    <View style={{width: '100%'}}>
                      {/* <Text style={{ color: "black" }}>{item.schools_id}</Text> */}
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                          fontFamily: 'Poppins-Medium',
                          marginBottom: 8,
                        }}>
                        {item.schools_name}
                      </Text>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                          fontFamily: 'Poppins-Light',
                          lineHeight: 23,
                        }}>
                        {item.school_summary}
                      </Text>
                      {/* <TouchableOpacity onPress={() => handleLinkPress(item.school_website)}>
                        <Text style={{ color: Colors.black, fontSize: 13, fontFamily: "Poppins-Medium" }}>School link:-   <Text style={{ color: Colors.surfblur, fontSize: 12, fontFamily: "Poppins-Regular" }}>{item.school_website}</Text></Text>

                      </TouchableOpacity> */}
                    </View>
                    {/* <View>
                    <Image style={{ height: 15, width: 100, resizeMode: "contain" }} source={{ uri: item.image_url }} />
                  </View> */}
                  </View>
                </>
              )}
            />
          </View>

          <View
            style={{
              marginTop: 10,
              justifyContent: 'flex-end',
              alignContent: 'flex-end',
              marginBottom: 10,
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                schoolModal()
                // navigation.navigate('Schoolinfo');
              }}
              style={{
                backgroundColor: Colors.surfblur,
                borderRadius: 20,
                width: 100,
                paddingVertical: 10,
                width: 120,
              }}>
              <Text
                style={{
                  alignItems: 'center',
                  textAlign: 'center',
                  color: Colors.white,
                  fontFamily: 'Poppins-medium',
                  fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
                }}>
                School Info
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      
                                  <Modal
                                    transparent={false}
                                    // animationType="slide"
                                   visible={schoolModalVisible}
                                   onRequestClose={() => {
                                    schoolModal(false);
                                     
                                  }}
                                    >
                                    <View style={styles.modalContainer}>
                                      <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.modalOverlaynew}
                                        onPress={() => {
                                          schoolModal(false);
                                        }}
                                      />
                                      <Animated.View
                                        {...panResponder.panHandlers}
                                        style={[
                                          styles.modalContentnew,
                                          {
                                            transform: [
                                              {
                                                translateY:
                                                  slideAnimation.interpolate({
                                                    inputRange: [-300, 0],
                                                    outputRange: [-300, 0],
                                                  }),
                                              },
                                            ],
                                          },
                                        ]}>
                                      <View style={{
        height: '100%', width: '100%',
       
        // justifyContent: 'center',

      }} >
        <View style={{ paddingVertical: 10, paddingHorizontal: 12, backgroundColor: Colors.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#c9c9c5' ,}}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                height: 35,
                width: 35,
                resizeMode: "contain",

                marginRight: 5,


              }}
              source={Images.train}
            ></Image>

            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', color: Colors.black }}> Powered by Cynthia®</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginRight: 0 }}>
            <TouchableOpacity
              onPress={() => { setRes([]) }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 5,
              }}
            >
              <Image
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: "contain",
                  tintColor: Colors.black,
                }}
                source={Images.reload}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => schoolModal(false)}
              style={{

                height: 35,
                width: 35,
                borderRadius: 100,
                alignItems: "center",


              }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  top: 7,
                  resizeMode: "contain",
                  borderRadius: 50,
                  marginLeft: 2,
                  tintColor: Colors.black,

                }}
                source={Images.close}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignSelf: 'center',
            marginTop: 12,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            paddingHorizontal: 12, 
          }}>


        </View>
        <View style={{
          //  paddingHorizontal: 20,
          position: "relative",
          height: '100%', width: '100%',
         
        }}>



          <Text
            style={{
              fontSize: 14,
              borderRadius: 16,
              alignSelf: 'flex-start',
              maxWidth: '70%',
              marginTop: 15,
              color: Colors.black,
              fontFamily: "Poppins-Regular",
              paddingHorizontal: 22,


            }}>
            I'm Cynthia. How can I help you?
          </Text>

          <AutoScrollFlatList
            nestedScrollEnabled={true}
            data={res}
            threshold={20}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <Text
                    style={{
                      padding: 8,
                      fontSize: 14,
                      borderRadius: 16,
                      backgroundColor: item.type === 0 ? Colors.surfblur : Colors.white,
                      alignSelf: item.type === 0 ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      marginLeft: 8,
                      //marginRight: 8,
                      marginTop: 8,
                      marginBottom: 4,
                      fontFamily: "Poppins-Regular",
                      color: item.type === 0 ? Colors.white : Colors.black,
                    }}>
                    {item.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginLeft: item.type === 0 ? 8 : 16,
                      marginRight: item.type === 0 ? 16 : 8,
                      marginBottom: 8,
                      alignSelf: item.type === 0 ? 'flex-end' : 'flex-start',
                      color: Colors.gray,
                    }}>
                    {item.date}
                  </Text>
                </View>
              );
            }}
          />
          <View style={{ bottom: 70, position: 'absolute', zIndex: 99, left: 0, right: 0, backgroundColor: Colors.white, }}>
            {
              loading && <Text style={{
                padding: 16,
                fontSize: 14,
                borderRadius: 16,
                backgroundColor: Colors.surfblur,
                alignSelf: 'flex-end',
                maxWidth: '70%',
                marginLeft: 8,
                marginRight: 8,
                marginTop: 88,
                marginBottom: 50,
                color: Colors.white
              }}>{message}</Text>
            }

            {
              loading && <View style={{ flexDirection: 'row' }}>
                <Text style={{
                  fontSize: 14,
                  borderRadius: 16,
                  alignSelf: 'flex-start',
                  maxWidth: '70%',
                  marginLeft: 16,
                  marginTop: 12,
                  backgroundColor: Colors.white, color: Colors.black
                }}>typing</Text>
                <TypingAnimation
                  dotColor="black"
                  dotMargin={3}
                  dotAmplitude={2}
                  dotSpeed={0.15}
                  dotRadius={1}
                  dotX={8}
                  dotY={0}
                  style={{ marginTop: 25, marginLeft: -3 }}
                />
              </View>
            }

            <View style={{
            backgroundColor: Colors.white,
            borderColor: Colors.BorderColor,
            borderWidth: 1, borderRadius: 5,
           // height: 45
             margin: 16,
            paddingLeft: 8, paddingRight: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 0,
   
             
            }}>
              <TextInput
                style={{ width: '90%', backgroundColor: Colors.white, color: Colors.black }}
                placeholder="Type here"
                placeholderTextColor={Colors.black}
                value={message}
                onChangeText={setMessage}>
              </TextInput>
              <TouchableOpacity
                onPress={() => {
                  setLoading(true);
                  dispatch(schoolChat({ message: message })).then((ress) => {
                    setLoading(false);

                    const newTodo1 = {
                      type: 0,
                      message: message,
                      date: getCurrentDateTime(),
                    };
                    const newTodo = {
                      type: 1,
                      message: ress.payload.data.text,
                      date: getCurrentDateTime(),
                    };
                    setMessage('');
                    setRes([...res, newTodo1, newTodo]);

                  }).catch((e) => {
                    alert('Error ==> ' + JSON.stringify(e))
                  });
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  
                }}
              >
                <Image
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: "contain",
                    tintColor: Colors.surfblur,
                  }}
                  source={Images.sendm}
                ></Image>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
                                      </Animated.View>
                                    </View>
                                  </Modal>
                               
      </>
    );
  };
  const TaxHistory = () => {
    return (
      <>
        <View style={{paddingHorizontal: 20}}>
          <View style={styles.address}>
            <View style={{width: '50%'}}>
              <Text style={styles.property}>Taxes</Text>
              <Text style={styles.props}>
                Annual amount: {tax.taxannualamount}
              </Text>
              <Text style={styles.props}>Taxes: {tax.taxes}</Text>
              <Text style={styles.props}>Tax year: {tax.taxyear}</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#5BB3FF',
            position: 'absolute',
            zIndex: 99,
            left: 0,
            top: 0,
          }}>
          <Loader />
        </View>
      ) : null}
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <ScrollView>
          <View style={styles.headerIcon}>


<TouchableOpacity
  style={{
    position: "absolute",
    left: 5,
    top: -2,
    flexDirection: 'row',
    alignItems: 'flex-start',

    justifyContent: 'flex-start',
width:50,
height:50,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  }}
  onPress={() => navigation.goBack()}  >
  <Image
    style={{
      width: DeviceInfo.getDeviceType() === 'Tablet'?57:27,
      height: DeviceInfo.getDeviceType() === 'Tablet'?57:27,
      resizeMode: 'contain',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      resizeMode: "contain",
      tintColor: "white"
    }}
    source={Images.leftnewarrow}></Image>
</TouchableOpacity>
</View>
        <View  style={{
justifyContent:"center",
alignItems:"center"
            }}>
        <View
            style={{
              height: firstViewHeight,
              width: ScreenWidth - 16,
              zIndex: 999,
              alignItems:"center",
              marginTop:8
              
              
            }}>
            <View
              style={{
                width: '100%',
                height:'100%'
              }}>
              <View
                style={[
                  {
                    width: '100%',
                    height:'100%',
                    zIndex: 999,
                  },
                ]}>
                <CardsSwipe
                  style={{
                    height:'100%'
                  }}
                  loop={true}
                  cards={data}
                  onSwipedLeft={() => {
                    trashfile(property?.ID);
                  }}
                  onSwipedRight={() => {
                    savefile(property?.ID);
                  }}
                  renderNope={() =>
                    props.route.params.from === 'MyFavorites' || props.route.params.from === 'Home' ?
                      <View
                        style={{
                          height: screenHeight - firstViewHeight - 27, width:screenWidth - 16 ,  backgroundColor:'red',
                          borderRadius: 15,
                          overflow: "hidden",
                        }}>
                        <View style={{
                          position: "absolute",
                          width: "100%", height: '100%', justifyContent: "center", alignItems: 'center'
                        }}>
                          <View
                            style={{
                              backgroundColor: Colors.white,
                              height: 50,
                              width: 50,
                              borderRadius: 100,
                              alignItems: 'center',
                              justifyContent: 'center',

                            }}>
                            <Image
                              source={Images.deletethumb}
                              style={{
                                height: 25,
                                width: 25,
                                tintColor: "red",
                              }}
                            />
                          </View>
                        </View>
                      </View> : null
                  }
                  renderYep={() => (
                    props.route.params.from === 'RecycleBin' || props.route.params.from === 'Home' ?
                      <View
                        style={{

                          height:  screenHeight - firstViewHeight - 27, width: screenWidth, backgroundColor: "green",
                          borderRadius: 15,
                          // marginTop: 10,
                          overflow: "hidden", position: "absolute",
                          // left: 5,
                        }}>
                        <View style={{
                          position: "absolute",
                          height: '100%', width: '100%', alignItems: 'center', justifyContent: "center"
                        }}>
                          <View
                            style={{
                              backgroundColor: Colors.white,
                              height: 50,
                              width: 50,
                              borderRadius: 100,
                              alignItems: 'center',
                              justifyContent: 'center',

                            }}>
                            <Image
                              source={Images.ThumbUp}
                              style={{
                                height: 25,
                                width: 25,
                                tintColor: "green",
                              }}
                            />
                          </View>
                        </View>
                      </View> : null
                  )}

                  renderCard={(item, index) => (
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor:Colors.white
                      }}>
                        <View style={{
                              height: '60%',}}>
                        <TouchableOpacity
                          style={{backgroundColor: Colors.white}}
                          onPress={() =>
                            navigation.navigate('ViewPropertiyImage', {
                              postid: postid.ID,
                            })
                          }>
                          <Image
                            style={{
                              height: '100%',
                              width: '100%',
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                              borderRadius: 15,
                              overflow: 'hidden',
                              marginBottom: 0,
                            }}
                            source={{uri: item?.featured_image_src}}
                          />
                        </TouchableOpacity></View>
                      <View style={{height: '40%'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            marginTop: 10,
                            // height:'40%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // backgroundColor: Colors.white,
                            paddingHorizontal: 12,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              //  backgroundColor: Colors.white,
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                setProductId(item.ID);
                                setReviewTitle(item.title);
                                toggleModal();
                                dispatch(getRating(item.ID)).then(response => {
                                  setRatingData(response.payload.data);
                                  setRating(
                                    response?.payload?.data[0]
                                      ?.photo_wuality_rating,
                                  );
                                  setRating1(
                                    response?.payload?.data[0]
                                      ?.description_review_stars,
                                  );
                                  setRating2(
                                    response?.payload?.data[0]
                                      ?.price_review_stars,
                                  );
                                  setRating3(
                                    response?.payload?.data[0]
                                      ?.interest_review_stars,
                                  );
                                });
                              }}>
                              <Image
                                 source={
                                  item?.Total_average_rating > 0
                                    ? Images.startfill
                                    : Images.star2
                                }
                                style={{
                                  height: 23,
                                  width: 23,
                                  resizeMode: 'contain',
                                }}></Image>
                            </TouchableOpacity>
                            {item?.Total_average_rating > 0 ? (
                            <Text
                              style={{
                                fontSize: 18,
                                color: Colors.black,
                                fontFamily: 'Poppins-Light',
                                marginLeft: 4,
                                marginTop: 8,
                              }}>
                                   {Math.round(
                                              item?.Total_average_rating,
                                            )}
                              {/* {item?.Total_average_rating} */}
                            </Text>
                                 ) : null}
                          </View>

                          <TouchableOpacity onPress={() => handleShare()}>
                            <Image
                              source={Images.sendnew}
                              style={{
                                height: 18,
                                width: 23,
                                resizeMode: 'contain',
                              }}></Image>
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            fontSize:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25,
                            color: '#1450B1',
                            fontWeight: '500',
                            fontFamily: 'Poppins-Medium',
                            width: '100%',
                            textAlign: 'center',
                            backgroundColor: Colors.white,
                          }}>
                          {item?.price}
                        </Text>
                        <View
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            // backgroundColor: Colors.white,
                            paddingHorizontal: 12,
                            paddingBottom: 8,
                          }}>
                          <Text
                            style={{
                              fontSize:
                                DeviceInfo.getDeviceType() === 'Tablet'
                                  ? 22
                                  : 16,
                              color: Colors.black,
                              marginHorizontal: 8,
                              textAlign: 'center',
                              fontFamily: 'Poppins-Light',
                              backgroundColor: Colors.white,
                            }}
                            numberOfLines={1}>
                            {property?.title}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',

                            justifyContent: 'center',

                            // backgroundColor: Colors.white,
                          }}>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',

                                width: '100%',
                                alignSelf: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',

                                  justifyContent: 'center',

                                  width: '100%',
                                  alignSelf: 'center',
                                }}>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                    width:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 100
                                        : 60,
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Image
                                      source={Images.newbed}
                                      style={{
                                        height:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 36
                                            : 21,
                                        width:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 49
                                            : 28,
                                        resizeMode: 'contain',

                                        marginBottom: 5,
                                      }}></Image>
                                    <Text
                                      style={{
                                        fontSize:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 17
                                            : 11,
                                        color: Colors.black,
                                        textAlign: 'center',
                                        fontFamily: 'Poppins-Light',
                                      }}>
                                      {item?.bedrooms ? item.bedrooms : '0'}
                                      {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms : 0} */}
                                      {' Beds'}
                                    </Text>
                                  </View>
                                </View>

                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 100
                                        : 60,
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Image
                                      source={Images.bathtub}
                                      style={{
                                        height:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 44
                                            : 26,
                                        width:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 49
                                            : 28,
                                        resizeMode: 'contain',
                                        marginBottom: 5,
                                      }}></Image>
                                    <Text
                                      style={{
                                        fontSize:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 17
                                            : 11,
                                        color: Colors.black,
                                        textAlign: 'center',
                                        fontFamily: 'Poppins-Light',
                                      }}>
                                      {item?.bathroomsfull.length > 0
                                        ? item.bathroomsfull
                                        : '0'}

                                      {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull : 0} */}
                                      {' Baths'}
                                    </Text>
                                  </View>
                                </View>

                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 100
                                        : 60,
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Image
                                      source={Images.measuringtape}
                                      style={{
                                        height:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 45
                                            : 26,
                                        width:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 47
                                            : 27,
                                        resizeMode: 'contain',
                                        marginBottom: 5,
                                      }}></Image>
                                    <Text
                                      style={{
                                        fontSize:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 17
                                            : 11,
                                        color: Colors.black,
                                        textAlign: 'center',
                                        fontFamily: 'Poppins-Light',
                                      }}>
                                      {item?.details.property_details
                                        .property_size.length > 0
                                        ? item.details.property_details
                                            .property_size
                                        : '0'}

                                      {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size : 0} */}
                                      {' sqft'}
                                    </Text>
                                  </View>
                                </View>

                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 100
                                        : 60,
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Image
                                      source={Images.hoa2}
                                      style={{
                                        height:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 47
                                            : 26,
                                        width:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 51
                                            : 27,
                                        resizeMode: 'contain',
                                        marginBottom: 5,
                                      }}></Image>
                                    <Text
                                      style={{
                                        fontSize:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 17
                                            : 11,
                                        color: Colors.black,
                                        textAlign: 'center',
                                        fontFamily: 'Poppins-Light',
                                      }}>
                                      {'$'}
                                      {item?.hoa_fee.length > 0
                                        ? item.hoa_fee
                                        : '0'}

                                      {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].hoa_fee.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].hoa_fee : 0} */}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 100
                                        : 60,
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Image
                                      source={Images.taxnew}
                                      style={{
                                        height:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 47
                                            : 27,
                                        width:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 43
                                            : 25,
                                        marginTop: 0,
                                        resizeMode: 'contain',
                                        marginBottom: 5,
                                      }}></Image>
                                    <Text
                                      style={{
                                        fontSize:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 17
                                            : 11,
                                        color: Colors.black,
                                        textAlign: 'center',
                                        fontFamily: 'Poppins-Light',
                                      }}>
                                      {item?.details.property_details.taxes
                                        .length > 0
                                        ? item.details.property_details.taxes
                                        : '0'}

                                      {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.taxes.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.taxes : 0} */}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 100
                                        : 60,
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Image
                                      source={Images.cals}
                                      style={{
                                        height:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 34
                                            : 30,
                                        width:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 40
                                            : 30,
                                        marginTop: 0,
                                        resizeMode: 'contain',
                                        marginBottom: 5,
                                      }}></Image>
                                    <Text
                                      style={{
                                        fontSize:
                                          DeviceInfo.getDeviceType() ===
                                          'Tablet'
                                            ? 17
                                            : 11,
                                        color: Colors.black,
                                        textAlign: 'center',
                                        fontFamily: 'Poppins-Light',
                                      }}>
                                      {item?.details.property_details.yearbuilt
                                        .length > 0
                                        ? item.details.property_details
                                            .yearbuilt
                                        : '0'}

                                      {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.yearbuilt.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.yearbuilt : 0} */}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>

          <View style={{flexWrap:"wrap",
          marginHorizontal:16,flexDirection:"column",}} >
            <View>
              <>
                <View style={{flexDirection:"row",
              flexWrap:"wrap",}}>
            <Text
                  numberOfLines={property?.ID == readmore ? 0 :100}
                  style={{
                    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 12,
                    flexDirection: 'row',
                    color: Colors.black,
                    fontFamily: 'Poppins-Light',
                    flexWrap:"wrap",
                    lineHeight: 22,
                    marginTop: DeviceInfo.getDeviceType() === 'Tablet' ? 16 : 0,
                  }}>
                  {typeof property?.content.rendered === 'string' ? (
                    <>
                      {showFullContent ||
                      property?.content.rendered.length < 100
                        ? property?.content.rendered
                        : property?.content.rendered.slice(0, 100) + ''}
                    </>
                  ) : null}
                </Text> 
            </View>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => setShowFullContent(!showFullContent)}>
                  <Text
                    style={{
                      color: '#1450B1',
                      marginVertical: 10,
                      marginBottom:0,
                      fontSize:
                        DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 11,
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {showFullContent ? 'Show Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              </>
            </View>
            <View
              style={{
                borderTopColor: Colors.BorderColor,
                borderTopWidth: 1,
                width: '100%',
                alignSelf: 'center',
                marginBottom: 12,
              }}></View>
            <View style={{justifyContent: 'center', width: '100%'}}>
              <View style={styles.featuresDetails}>
                <ScrollView
                  horizontal={true}
                  scrollEnabled={true}
                  showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 16,
                    }}>
                    <View style={styles.featuersComtainer}>
                      <View style={{justifyContent: 'center'}}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedTab(0);
                          }}
                          style={styles.detailsStyle}>
                          <Image
                            source={Images.details}
                            style={{
                              height:
                                DeviceInfo.getDeviceType() === 'Tablet'
                                  ? 42
                                  : 22,
                              width:
                                DeviceInfo.getDeviceType() === 'Tablet'
                                  ? 40
                                  : 21,
                              resizeMode: 'contain',
                              tintColor:
                                selectedTab == 0 ? '#0165C5' : Colors.black,
                            }}></Image>
                          <Text
                            style={{
                              fontSize:
                                DeviceInfo.getDeviceType() === 'Tablet'
                                  ? 21
                                  : 11,
                              color:
                                selectedTab == 0 ? '#0165C5' : Colors.black,
                              borderBottomColor:
                                selectedTab == 0 ? '#0165C5' : Colors.white,
                              borderBottomWidth: selectedTab == 0 ? 1 : 0,
                              textAlign: 'center',
                              fontFamily:
                                selectedTab == 0
                                  ? 'Poppins-Medium'
                                  : 'Poppins-Light',
                            }}>
                            Details
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.featuersComtainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTab(1);
                          selectedTab ? Colors.darbluec : 'black';
                        }}
                        style={styles.detailsStyle}>
                        <Image
                          source={Images.featuresnew}
                          style={{
                            height:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
                            width:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 31 : 21,
                            resizeMode: 'contain',
                            tintColor:
                              selectedTab == 1 ? '#0165C5' : Colors.black,
                          }}></Image>
                        <Text
                          style={{
                            fontSize:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 11,
                            color: selectedTab == 1 ? '#0165C5' : Colors.black,
                            textAlign: 'center',
                            fontFamily: 'Poppins-Regular',
                            borderBottomColor:
                              selectedTab == 1 ? '#0165C5' : Colors.white,
                            borderBottomWidth: selectedTab == 1 ? 1 : 0,
                          }}>
                          Features
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.featuersComtainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTab(2);
                        }}
                        style={styles.detailsStyle}>
                        <Image
                          source={Images.mapnew}
                          style={{
                            height:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 20,
                            width:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 52 : 20,
                            resizeMode: 'contain',
                            tintColor:
                              selectedTab == 2 ? '#0165C5' : Colors.black,
                          }}></Image>
                        <Text
                          style={{
                            fontSize:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 11,
                            color: selectedTab == 2 ? '#0165C5' : Colors.black,
                            textAlign: 'center',
                            fontFamily: 'Poppins-Regular',
                            borderBottomColor:
                              selectedTab == 2 ? '#0165C5' : Colors.white,
                            borderBottomWidth: selectedTab == 2 ? 1 : 0,
                          }}>
                          Location
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.featuersComtainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTab(6);
                        }}
                        style={styles.detailsStyle}>
                        <Image
                          source={Images.payment}
                          style={{
                            height:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 20,
                            width:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 20,
                            resizeMode: 'contain',
                            tintColor:
                              selectedTab == 6 ? '#0165C5' : Colors.black,
                          }}></Image>
                        <Text
                          style={{
                            fontSize:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 11,
                            color: selectedTab == 6 ? '#0165C5' : Colors.black,
                            textAlign: 'center',
                            fontFamily: 'Poppins-Regular',
                            borderBottomColor:
                              selectedTab == 6 ? '#0165C5' : Colors.white,
                            borderBottomWidth: selectedTab == 6 ? 1 : 0,
                          }}>
                          Payment
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(8);
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.tax}
                        style={styles.detail}></Image>
                      <Text style={styles.detailText}>Taxes</Text>
                    </TouchableOpacity>
                  </View> */}
                    <View style={styles.featuersComtainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTab(3);
                        }}
                        style={styles.detailsStyle}>
                        <Image
                          source={Images.nearBy1}
                          style={{
                            height:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 48 : 20,
                            width:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 52 : 20,
                            resizeMode: 'contain',
                            tintColor:
                              selectedTab == 3 ? '#0165C5' : Colors.black,
                          }}></Image>
                        <Text
                          style={{
                            fontSize:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 11,
                            color: selectedTab == 3 ? '#0165C5' : Colors.black,
                            textAlign: 'center',
                            fontFamily: 'Poppins-Regular',
                            borderBottomColor:
                              selectedTab == 3 ? '#0165C5' : Colors.white,
                            borderBottomWidth: selectedTab == 3 ? 1 : 0,
                          }}>
                          Nearby
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.featuersComtainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTab(7);
                        }}
                        style={styles.detailsStyle}>
                        <Image
                          source={Images.schoolbus}
                          style={{
                            height: 20,
                            width: 20,
                            height:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 46 : 20,
                            width:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 48 : 20,
                            resizeMode: 'contain',
                            tintColor:
                              selectedTab == 7 ? '#0165C5' : Colors.black,
                          }}></Image>
                        <Text
                          style={{
                            fontSize:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 11,
                            color: selectedTab == 7 ? '#0165C5' : Colors.black,
                            textAlign: 'center',
                            fontFamily: 'Poppins-Regular',
                            borderBottomColor:
                              selectedTab == 7 ? '#0165C5' : Colors.white,
                            borderBottomWidth: selectedTab == 7 ? 1 : 0,
                          }}>
                          Schools
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(4);
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.walkScrore}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                          tintColor: selectedTab == 4 ? Colors.primaryBlue : Colors.black,
                        }}></Image>
                      <Text style={{
                        fontSize: 11,
                        color: selectedTab == 4 ? Colors.primaryBlue : Colors.black,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Regular',
                      }}> Walk Score</Text>
                    </TouchableOpacity>
                  </View> */}
                    <View style={styles.featuersComtainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTab(5);
                        }}
                        style={styles.detailsStyle}>
                        <Image
                          source={Images.cloudysun}
                          style={{
                            height:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 20,
                            width:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 20,
                            resizeMode: 'contain',
                            tintColor:
                              selectedTab == 5 ? '#0165C5' : Colors.black,
                          }}></Image>
                        <Text
                          style={{
                            fontSize:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 11,
                            color: selectedTab == 5 ? '#0165C5' : Colors.black,
                            textAlign: 'center',
                            fontFamily: 'Poppins-Regular',
                            borderBottomColor:
                              selectedTab == 5 ? '#0165C5' : Colors.white,
                            borderBottomWidth: selectedTab == 5 ? 1 : 0,
                          }}>
                          Weather
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>

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
                        <ScrollView style={{width: '100%'}}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
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
                                marginTop: 10,
                                // marginRight: 180
                              }}>
                              Your Review
                            </Text>
                          </View>
                          <View style={{width: '100%'}}>
                            <View style={{width: '100%', alignSelf: 'center'}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginTop: 10,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Colors.black,
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  Photos :
                                </Text>
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
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Colors.black,
                                    fontFamily: 'Poppins-Regular',
                                  }}>
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
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Colors.black,
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  Price :
                                </Text>
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
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Colors.black,
                                    fontFamily: 'Poppins-Regular',
                                  }}>
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
                                    value={review}
                                    onChangeText={text =>
                                      setComentContent(text)
                                    }
                                    autoFocus
                                  />
                                ) : (
                                  <TextInput
                                    onChangeText={text =>
                                      setComentContent(text)
                                    }
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
                                    }}></TextInput>
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
              </View>
            </View>
          </View>
        </View>
          {selectedTab == 0 ? (
            <Details />
          ) : selectedTab == 1 ? (
            <Featuers />
          ) : selectedTab == 2 ? (
            <Address />
          ) : selectedTab == 3 ? (
            <NearBy />
          ) : selectedTab == 4 ? (
            <WalkSco />
          ) : selectedTab == 5 ? (
            <CurrentWeather />
          ) : selectedTab == 6 ? (
            <Calculator />
          ) : (
            <School />
          )}

          <View style={{height: 70}}></View>
        </ScrollView>
        <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          backgroundColor: '#f8f8f8',
          paddingVertical: 12,
          alignItems: 'center',
          position:"relative",
          paddingHorizontal:8,
          height:55
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
           // marginTop:12
           width:"33.33%",
           justifyContent:"space-between",
           paddingRight:15
          }}>
      
            <TouchableOpacity
              style={{
             marginRight:16
              }}
              onPress={() => {
                makePhoneCall();
              }}>
              <Image
                source={Images.newcall}
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 26,
                  width: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 26,
                  resizeMode: 'contain',
                }}></Image>
            </TouchableOpacity>
          
        
            <TouchableOpacity
              style={{
       
              }}
              onPress={() => navigation.navigate('ChatSearch')}>
              <Image
                source={Images.chatnew}
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 26,
                  width: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 26,
                  resizeMode: 'contain',
                }}></Image>
            </TouchableOpacity>
        
        </View>

        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center",position:"relative",top:-18, 
         width:"33.33%",
       
         }}>
        <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
               marginHorizontal:8
              }}>
              <Image
                source={Images.RedDown}
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 60,
                  width: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 60,
                  resizeMode: 'contain',
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                marginHorizontal:8
              }}>
              <Image
                source={Images.GreenUp}
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 60,
                  width: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 60,
                  resizeMode: 'contain',
                }}></Image>
            </TouchableOpacity>
          </View>
       

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BookaTour', {
              ID: '',
              PropID: postid?.ID,
              user_id: '',
              user2_id: '',
            });
            
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            borderRadius: 50,
            paddingHorizontal:8,
            lineHeight: 12,
            marginRight: 10,
            borderWidth: 2,
            borderColor: Colors.surfblur,
            height:30,  width:"33.33%",
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 16 : 10,
              color: Colors.surfblur,
              textAlign: 'center',
           
              fontFamily: 'Poppins-Medium',
              position: 'relative',
             
              letterSpacing: 0,
            }}>
            Schedule a Tour
          </Text>
          <LottieView
            style={{
              height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 30,
              width: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 30,
            }}
            source={require('../../assets/animations/SurfVan.json')}
            autoPlay
            loop
          />
        </TouchableOpacity>
      </View>
      </SafeAreaView>

    
    </View>
  );
};

export default ViewPropertiy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverlocation: {
    backgroundColor: 'rgba(255,255,255,.8)',
    height: 38,
    width: 35,
    position: 'absolute',
    top: 15,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    right: 12,
    shadowOffset: {width: -2, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  locationpic: {resizeMode: 'contain', width: 16, height: 16},
  tour: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    marginLeft: 5,
  },
  buttonscroll: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfblur,
    borderRadius: 100,
    height: 45,
    width: 45,
    transform: [{rotate: '-180deg'}],
  },
  call: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
    marginLeft: 5,
  },
  ratetext: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
    marginLeft: 5,
  },
  book: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlue,
    borderRadius: 14,
    height: 40,
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'trasnparent',
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
  rate: {
    justifyContent: 'space-evenly',

    alignItems: 'center',
    alignContent: 'center',
    width: '50%',
    flexDirection: 'row',
  },
  detailsStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 28,

    // width: 100
    // width: 105,
    // paddingHorizontal: 4,
    // backgroundColor: "green",
  },
  map: {
    width: '100%',
    height: 326,
    borderRadius: 22,
    flex: 1,
  },
  maincovermap: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 20, // Set the border radius for the container View
    overflow: 'hidden',
    //backgroundColor: "red",
    //marginHorizontal: 16,
    position: 'relative',
    marginTop: 15,
  },
  detail: {
    height: 20,
    width: 20,
    resizeMode: 'contain',

    // backgroundColor:"green"
  },
  cloud: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  imagedata: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '45deg' }],
  },
  addresimage: {
    height: 30,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  screen: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  imgg: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  property: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 15,
    color: Colors.black,
    //fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  detailText: {
    fontSize: 11,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',

    // marginLeft: 5,
    // width
    // width:55
  },
  cloudText: {
    fontSize: 10,
    color: Colors.black,
    textAlign: 'center',
  },
  imgview: {
    flexDirection: 'row',
    width: screenWidth,
    position: 'absolute',
    bottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slide: {
    width: width - 18,
    height: width - 18,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  bottom: {
    flexDirection: 'row',

    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    alignItems: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  viewstyle: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
  },
  address: {
    width: '100%',

    marginTop: 20,
    justifyContent: 'center',
  },
  addresss: {
    width: '100%',
    justifyContent: 'center',
  },
  props: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    color: Colors.black,
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },
  
  prop: {
    fontSize: 13,
    color: Colors.black,
  },
  view: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 5,
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  community: {
    fontSize: 16,
    color: Colors.black,

    fontWeight: '700',
  },
  featuresDetails: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    paddingVertical: 0,
    justifyContent: 'center',
    // borderColor: Colors.BorderColor,

  },

  featuersComtainer: {
    // width: 100,
    // backgroundColor: "red"
    justifyContent: 'center',
  },

  headerIcon: {
    width: '100%',
    zIndex: 9999,
    position: 'absolute',
    top: 20,
    left: 10,
  },

  rating: {
    marginVertical: 2,
  },
  propertyt: {
    fontSize: 18,
    color: Colors.black,
    marginTop: 20,
    paddingStart: 20,
    fontFamily: 'Poppins-SemiBold',
    // fontWeight: 'bold'
  },
  //addresss: { height: 1400 },
  propertyts: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 20,
    fontFamily: 'Poppins-Medium',
    // fontWeight: 'bold'
  },
  propsmain: {
    fontFamily: 'Poppins-Medium',
    color: Colors.sitegray,
    paddingBottom: 4,
  },
  propsinnermain: {fontFamily: 'Poppins-Regular'},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0065C4',
  },
  card: {
    // backgroundColor: '#fdfdfd',
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '92%',
    height: '70%',
  },
  card: {
    width: '100%',
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 3.3,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
});
