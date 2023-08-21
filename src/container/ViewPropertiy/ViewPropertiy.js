import React, { useState, useEffect, useRef } from 'react';
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
  Button,
  Linking,
  Share,
  TouchableHighlight,
  ActivityIndicator,
  useWindowDimensions,
  Platform
} from 'react-native';
import clamp from 'clamp';
import CardsSwipe from 'react-native-cards-swipe';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import { postRating } from '../../modules/postRating';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { getPopertiesDetails } from '../../modules/getPopertiesDetails';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { PROVIDER_GOOGLE, Callout, Circle, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { getRating } from '../../modules/getRating';
import { postUpdateRating } from '../../modules/postUpdateRating';
import { store } from '../../redux/store';
import { addToFavorite } from '../../modules/addToFavorite';
import { addRemoveTrash } from '../../modules/addRemoveTrash';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import { getAgent } from '../../modules/getAgent';
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";
import * as Animatable from 'react-native-animatable';
import { TypingAnimation } from 'react-native-typing-animation';
import { schoolChat } from '../../modules/schoolChat';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import StarRating from 'react-native-star-rating-widget';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const { width } = Dimensions.get('screen');
const cardAspectRatio = 1.2;
const cardWidth = screenWidth;
const cardHeight = cardWidth * cardAspectRatio;
const SWIPE_THRESHOLD = 0.25 * width;

const ViewPropertiy = (props, imageUrl) => {

  const postid = props.route.params

  const [showCallout, setShowCallOut] = useState(false)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [commentContent, setComentContent] = useState('');

  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [viewHeight, setViewHeight] = useState(80)
  const property = data[0];

  const [calData, setCalData] = useState([]);
  const [schoolRating, setSchoolRating] = useState([])
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const [readmore, setreadmore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  // const [filterData, setFilterData] = useState([]);
  const [imageIndex, setImageIndex] = useState(0)
  const [agentData, setAgentData] = useState([])
  const [showFullContent, setShowFullContent] = useState(false);
  const [map, setMap] = useState([]);
  const [lat, setLat] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [weather, setweather] = useState([]);
  const [tax, settax] = useState([]);
  const [walk, setWalk] = useState([]);
  const [showIcon, setShowIcon] = useState(false);
  const [Icon, setIcon] = useState(false)
  const [ratingData, setRatingData] = useState([])
  const [isEditing, setIsEditing] = useState(false);

  const [pin, setPin] = useState(null);
  const [region, setRegion] = useState(null);
  const scrollViewRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 0);
  };
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  }, [])
  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink({
        link: `https://surflokal.page.link/property?propetyID=${postid.ID}`,
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
  const handleShare = async () => {
    const link = await generateLink()
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
    animation.setValue({ x: 0, y: 0 });
  }, []);

  const animation = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const _panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        animation.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (e, { dx, dy, vx, vy }) => {
        let velocity;
        if (vx >= 0) {
          velocity = clamp(vx, 4, 5);
        } else if (vx < 0) {
          velocity = clamp(Math.abs(vx), 4, 5) * -1;
        }
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.spring(animation, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 0.9,
              friction: 4,
              useNativeDriver: false,
            }),
          ]).start();
          // if (velocity > 0) {


          //   (
          //     idPost = store.getState().getPopertiesDetails.getPopertiesDetails.data[0].ID)

          //   savefile(idPost);
          // } else {

          //   (
          //     idPost = store.getState().getPopertiesDetails.getPopertiesDetails.data[0].ID)

          //   trashfile(idPost);

          // }
        } else {
          Animated.spring(animation, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;
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
      setPin({ latitude: response.payload.data[0].address.property_address.property_latitude, longitude: response.payload.data[0].address.property_address.property_longitude })
      const res = [
        {
          ID: productId,
          property_longitude: map.property_longitude.toString(),
          property_latitude: map.property_latitude.toString(),
          // other properties
        }
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

    const formData = new FormData()
    formData.append('userID', userID)
    formData.append('post_id', post_id)


    await dispatch(addToFavorite(formData)).then(response => {
      if (response.payload.success) {
        // Alert.alert('Alert', response.payload.message);
      } else {
        // Alert.alert('Alert', response.payload.message);
      }
    });
    navigation.goBack()
  };
  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {

      setAgentData(response.payload.data);


    });
  }

  const trashfile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');
    const formData = new FormData()
    formData.append('userID', userID)
    formData.append('post_id', post_id)


    await dispatch(addRemoveTrash(formData)).then(response => {
      if (response.payload.success) {
        // Alert.alert('Alert', response.payload.message);
      } else {
        // Alert.alert('Alert', response.payload.message);
      }
    });

    navigation.goBack()
  };

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

    console.log("addddddddddd ratingggggg", formData)

    dispatch(postRating(formData)).then(response => {
      ;
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

  const Details = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.viewstyle}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Property Details</Text>
              <Text style={styles.props}>Price: {data.map((item) => item.details.property_details.price)} </Text>
              <Text style={styles.props}>Property Size: {data.map((item) => item.details.property_details.property_size)} sq ft </Text>
              <Text style={styles.props}>Bedrooms: {data.map((item) => item.details.property_details.bedrooms)} </Text>
              <Text style={styles.props}>Year Built : {data.map((item) => item.details.property_details.yearbuilt)} </Text>
              <Text style={styles.props}>Toatl Stories: {data.map((item) => item.details.property_details.storiestotal)} </Text>
              <Text style={styles.props}>Days on Market : </Text>
              <Text style={styles.props}>Garage Spaces:  {data.map((item) => item.details.property_details.garagespaces)}  </Text>
            </View>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Community Details</Text>
              <Text style={styles.props}>Community Name:  {data.map((item) => item.details.community_details.community_name)}  </Text>
              <Text style={styles.props}>HOA Fee: {data.map((item) => item.hoa_fee)}</Text>
              <Text style={styles.props}>HOA Fee Frequency: {data.map((item) => item.associationfeefrequency)}  </Text>
              <Text style={styles.props}>Lot Size: {data.map((item) => item.hoa_fee)}</Text>
              <Text style={styles.props}>Est. Taxes: {data.map((item) => item.details.property_details.taxes)}  </Text>
            </View>
          </View>
          <View style={styles.viewstyle}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Interior Features
              </Text>
              <Text style={styles.props}>A/C: {"\n"}{data.map((item) => item.details.interior_features.A_C)} </Text>
              <Text style={styles.props}>Heating: {data.map((item) => item.details.interior_features.heating)}</Text>
              <Text style={styles.props}>Flooring: {data.map((item) => item.details.interior_features.flooring)} </Text>
              <Text style={styles.props}>Property Rooms: {data.map((item) => item.details.interior_features.property_rooms)} </Text>

            </View>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Exterior Features</Text>
              <Text style={styles.props}>Architectural Style:  {data.map((item) => item.details.exterior_features.architecturalstyle)}  </Text>
              <Text style={styles.props}>Construction: {data.map((item) => item.details.exterior_features.construction)}</Text>
              <Text style={styles.props}>Roofing: {data.map((item) => item.details.exterior_features.roofing)}  </Text>
              <Text style={styles.props}>Water Source: {data.map((item) => item.details.exterior_features.watersource)}</Text>
            </View>
          </View>

          <View style={{ width: '60%', marginTop: 30 }}>
            <Text style={styles.property}>Miscellaneous Details</Text>
            <Text style={styles.props}>Driving Directions:{data.map((item) => item.details.miscellaneous_details.driving_directions)} </Text>
            <Text style={styles.props}>Listing Office: {data.map((item) => item.details.miscellaneous_details.listing_office)}  </Text>

          </View>
        </View>
      </>
    )
  }

  const Featuers = () => {
    return (
      <>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
            <View style={{ width: '100%' }}>
              <Text style={styles.property}> Features</Text>
              <FlatList
                data={property?.features?.property_features}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <>
                    <View style={{ width: "100%", paddingHorizontal: 4, height: 30, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                      <Image
                        source={Images.check}
                        style={{ height: 15, width: 15, resizeMode: 'contain', marginRight: 5 }}></Image>
                      <Text style={{ color: Colors.black, fontFamily: "Poppins-Regular" }}>{item}</Text>
                    </View>
                  </>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
  const Address = () => {

    const handleCalloutPress = () => {
      // Code to handle the press event on the callout

    };

    return (
      <>
        <View style={{ width: "100%", paddingVertical: 16 }}>
          <View style={{ marginHorizontal: 10, marginBottom: 16 }}>
            {/* {/ <Text style={styles.property}>Address</Text > /} */}
            < Text style={styles.propsmain}>Address: <Text style={styles.propsinnermain}>{property?.address.property_address.address}</Text></Text>
            <Text style={styles.propsmain}>Area:  <Text style={styles.propsinnermain}>{property?.address.property_address.area}</Text></Text>
            <Text style={styles.propsmain}>State:  <Text style={styles.propsinnermain}>{property?.address.property_address.state_county}</Text></Text>
            <Text style={styles.propsmain}>County: <Text style={styles.propsinnermain}>{property?.address.property_address.Country}</Text></Text>
            <Text style={styles.propsmain}>Zip:  <Text style={styles.propsinnermain}>{property?.address.property_address.zip}</Text></Text>
            {/* {/ <Text style={styles.propsmain}>Zip: {JSON.stringify(pin)} <Text style={styles.propsinnermain}>{property?.address.property_address.zip}</Text ></Text> /} */}

          </View >
          <View style={styles.maincovermap} >

            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              region={{
                latitude: parseFloat(pin.latitude),
                longitude: parseFloat(pin.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >


              <Marker
                showCallout={true}
                coordinate={{ latitude: parseFloat(pin.latitude), longitude: parseFloat(pin.longitude) }}
              >
                <Image source={Images.locationss} style={{ height: 50, width: 100, resizeMode: 'contain', }} />

                <Callout onPress={() => { navigation.navigate('ViewProperty2', { property }) }}
                  style={{
                    height: 70, alignItems: "center", alignSelf: "center",
                    marginLeft: 20, top: -15,
                  }}>

                  <View style={{
                    flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginLeft: 20, top: -12,

                  }}>
                    <Text style={{
                      position: "relative", height: 100,
                      top: -20
                    }}><Image style={{ height: 80, width: 100, resizeMode: "stretch", }} source={{ uri: property?.featured_image_src }} resizeMethod='auto' />
                    </Text>
                    <View style={{ flexWrap: "wrap", top: -5 }}>
                      <Text style={{ color: 'black', marginLeft: 10, fontWeight: '500', flexWrap: "wrap" }}>{property?.address.property_address.address} | {property?.address.property_address.state_county}</Text>
                      <Text style={{ color: Colors.primaryBlue, marginLeft: 10, fontWeight: '500' }}>{data.map((item) => item.details.property_details.price)}</Text>
                      <View style={{ flexDirection: 'row', marginLeft: 10, }}>
                        <Text style={{ color: Colors.black }}>{store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms : 0}
                          {' Beds'}    </Text>
                        <Text style={{ color: Colors.black }}>{store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull : 0}
                          {' Baths'}   </Text>
                        <Text style={{ color: Colors.black }}>{store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size : 0}
                          {' sq ft'}   </Text>
                      </View>

                    </View>
                  </View>
                </Callout>
              </Marker>




            </MapView>
          </View>
        </View >
      </>
    )
  }
  const NearBy = () => {

    return (
      <>

        <Text style={[styles.propertyt, { marginBottom: 0, paddingBottom: 0 }]}>What's Nearby</Text>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
            <FlatList
              data={property?.what_is_nearby}
              renderItem={({ item }) => (
                <>
                  <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', marginVertical: 5, justifyContent: 'space-between' }}>
                    <View style={{ width: "70%" }}>
                      <Text style={{ color: "black" }}>{item.unite_name}</Text>
                      <Text style={{ color: "gray" }}>{item.unit_distance}</Text>
                    </View>
                    <View>
                      <Image style={{ height: 15, width: 100, resizeMode: "contain" }} source={{ uri: item.image_url }} />
                    </View>
                  </View>
                </>
              )}
            />

          </View>

        </View>
      </>
    )
  }
  const WalkSco = () => {
    return (
      <>
        <View style={styles.addresss}>

          <WebView
            source={{ uri: walk?.walkscore_details }}
            onLoad={console.log("loaded")}
            style={{ width: "100%" }}
          />
        </View>
      </>
    )
  }
  const CurrentWeather = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20, }}>
          <Text style={styles.propertyts}>Current Weather</Text>
          <View style={styles.addresss}>
            <Text style={styles.props}>Location: {weather.location_name}</Text>
            <Text style={styles.props}>Localtime: {weather.location_localtime}</Text>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <Text style={styles.prop}>Condition: {weather.condition_text}</Text>
              <View style={{}}>
                <Image style={{ color: "black", height: 30, width: 30 }} source={{ uri: weather?.current_condition_icon }} />
              </View>
            </View>
            <Text style={styles.props}>Temperature: {(+weather.current_temp * 9 / 5 + 32).toFixed(2)}{" ℉"}</Text>
          </View>
        </View>
      </>
    )
  }
  const Calculator = () => {
    return (
      <>
        <View style={{ height: "100%", width: "100%" }}>
          <Text style={styles.propertyt}>Mortgage Calculator</Text>
          <View style={styles.addresss}>
            <WebView
              style={{ height: 1000, marginLeft: 20, marginRight: 20 }}
              scrollEnabled={true}
              nestedScrollEnabled
              source={{ uri: calData?.moartage_details }}
              onLoad={console.log("loaded")}
            />

          </View>
        </View>
      </>
    )
  }
  const School = () => {
    const handleLinkPress = (url) => {
      Linking.openURL(url).catch((error) => console.error('An error occurred: ', error));
    };

    return (
      <>
        <Text style={[styles.propertyt, { marginBottom: 0, paddingBottom: 0, padding: 0, margin: 0 }]}>Nearby Schools</Text>

        <View style={{ paddingHorizontal: 20 }}>
          <View>
            <FlatList

              data={schoolRating.school_Info}

              renderItem={({ item }) => (


                <>

                  <View style={{
                    flex: 1, flexDirection: 'row', alignContent: 'center', marginVertical: 5, justifyContent: 'space-between',
                    borderBottomColor: Colors.BorderColor, borderBottomWidth: 1, paddingBottom: 15, marginBottom: 10
                  }}>
                    <View style={{ width: "100%" }}>
                      {/* <Text style={{ color: "black" }}>{item.schools_id}</Text> */}
                      <Text style={{ color: Colors.black, fontSize: 13, fontFamily: "Poppins-Medium" }}>School Name :-<Text style={{ color: Colors.black, fontSize: 13, fontFamily: "Poppins-Regular" }}>{item.schools_name}</Text></Text>
                      <Text style={{ color: Colors.black, fontSize: 13, fontFamily: "Poppins-Medium", lineHeight: 23 }}>Summary:-  <Text style={{ color: Colors.black, fontSize: 13, fontFamily: "Poppins-Regular" }}>{item.school_summary}</Text></Text>
                      <TouchableOpacity onPress={() => handleLinkPress(item.school_website)}>
                        <Text style={{ color: Colors.black, fontSize: 13, fontFamily: "Poppins-Medium" }}>School link:-   <Text style={{ color: Colors.surfblur, fontSize: 12, fontFamily: "Poppins-Regular" }}>{item.school_website}</Text></Text>

                      </TouchableOpacity>

                    </View>
                    {/* <View>
                    <Image style={{ height: 15, width: 100, resizeMode: "contain" }} source={{ uri: item.image_url }} />
                  </View> */}
                  </View>
                </>
              )} />

          </View>

          <View style={{ marginTop: 10, justifyContent: 'flex-end', alignContent: 'flex-end', marginBottom: 10 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Schoolinfo') }}
              style={{ backgroundColor: Colors.surfblur, borderRadius: 20, width: 100, paddingVertical: 10 }}>
              <Text style={{ alignItems: 'center', textAlign: 'center', color: Colors.white }}>School Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }
  const TaxHistory = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Taxes</Text>
              <Text style={styles.props}>Annual amount: {tax.taxannualamount}</Text>
              <Text style={styles.props}>Taxes: {tax.taxes}</Text>
              <Text style={styles.props}>Tax year: {tax.taxyear}</Text>

            </View>
          </View>

        </View>
      </>
    )
  }


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView >
          <View
            style={{
              width: '100%',
              // alignSelf: 'center',
              justifyContent: 'flex-start',

              alignItems: "flex-start", position: "relative",

              zIndex: 999,

            }}>
            <View style={styles.headerIcon}>
            
              
          <TouchableOpacity
            style={{
              alignItems: 'center',
              position: "absolute",
              left: 5,
              top: 5,

              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: 'black',
              shadowOffset: { width: 1, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
            onPress={() => navigation.goBack()}  >
             <Image
            style={{
              width:27,
              height: 27,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              resizeMode:"contain",
              tintColor:"white"
            }}
            source={Images.leftnewarrow}></Image>
          </TouchableOpacity>
            </View>
            <View style={{
              position: 'relative', width: '100%', position: "relative",
              zIndex: 999,
              // marginTop: 40,
              position: "relative",
              zIndex: 999,
            }}>

              <View style={[{
                width: cardWidth,
                backgroundColor: Colors.white,
                position: "relative",
                zIndex: 999,
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: "flex-start",
                height: cardWidth + 125
              }]}>
                <CardsSwipe style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: "flex-start"

                }}
                  loop={true}
                  cards={data}
                  onSwipedLeft={() => {
                    trashfile(property.ID)
                  }}
                  onSwipedRight={() => { savefile(property.ID) }}
                  renderNope={() =>
                    props.route.params.from === 'MyFavorites' || props.route.params.from === 'Home' ?
                      <View
                        style={{
                          height: cardWidth, width: cardWidth - 8, backgroundColor: "red",
                          borderRadius: 15,
                          overflow: "hidden",
                          top: 8,
                          right: 5
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

                          height: cardWidth, width: cardWidth - 8, backgroundColor: "green",
                          borderRadius: 15,
                          marginTop: 10,
                          overflow: "hidden", position: "absolute",
                          left: 5,
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
                    <View style={{
                      width: cardWidth,
                      height: cardWidth + 125
                    }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.ID })}>
                        <Image
                          style={{
                            height: cardWidth,
                            width: cardWidth - 8,
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderRadius: 15,
                            overflow: "hidden",
                            margin: 8,
                            marginBottom: 0
                          }}
                          source={{ uri: item?.featured_image_src }}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: width,
                          // marginTop: 20,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: Colors.white,
                          paddingHorizontal: 12,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              setProductId(item.ID);
                              setReviewTitle(item.title);
                              toggleModal();
                              dispatch(getRating(item.ID)).then(response => {

                                setRatingData(response.payload.data)
                                setRating(response?.payload?.data[0]?.photo_wuality_rating)
                                setRating1(response?.payload?.data[0]?.description_review_stars)
                                setRating2(response?.payload?.data[0]?.price_review_stars)
                                setRating3(response?.payload?.data[0]?.interest_review_stars)
                                console.log(" getRating response data", response?.payload?.data)

                              })
                            }}>
                            <Image
                              source={Images.star}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                // marginTop: -6,
                              }}></Image>
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: 14,
                              color: Colors.black,
                              textAlign: 'center',
                              marginLeft: 5,
                              fontFamily: 'Poppins-SemiBold',
                            }}>
                            {item?.Total_average_rating}
                            {/* {store.getState().getPopertiesDetails.getPopertiesDetails?.data[0]?.Total_average_rating} */}
                          </Text>
                        </View>
                        <Text

                          style={{
                            fontSize: 20,
                            color: Colors.primaryBlue,
                            fontWeight: '500',
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          {item?.price}

                          {/* {store.getState().getPopertiesDetails.getPopertiesDetails?.data[0]?.price} */}
                        </Text>
                        <TouchableOpacity onPress={() => handleShare()}>
                          <Image
                            source={Images.send}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>

                      </View>

                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          justifyContent: 'center',
                          backgroundColor: Colors.white,
                          paddingHorizontal: 12,
                        }}>
                        <Text

                          style={{
                            fontSize: 14,
                            color: Colors.black,
                            marginHorizontal: 8,
                            textAlign: 'center',
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {property?.title}
                        </Text>
                      </View>

                      <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingHorizontal: 18,
                        paddingBottom: 0,
                        justifyContent: 'space-between',
                        // marginTop: 30,
                        backgroundColor: Colors.white,
                      }}>
                        <ScrollView horizontal={true}
                          scrollEnabled={true}
                          showsHorizontalScrollIndicator={false}  >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: "center",
                              justifyContent: 'space-between',
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
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  // backgroundColor: "red",
                                  width: 50,
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
                                      fontSize: 11,
                                      color: Colors.black,
                                      textAlign: 'left',
                                      fontFamily: 'Poppins-Regular',
                                    }}>
                                    {item?.bedrooms ? item.bedrooms : "0"}
                                    {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms : 0} */}
                                    {' Beds'}
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
                                    source={Images.bath}
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
                                      fontFamily: 'Poppins-Regular',
                                    }}>
                                    {item?.bathroomsfull.length > 0 ? item.bathroomsfull : "0"}

                                    {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull : 0} */}
                                    {' Baths'}

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
                                    source={Images.measuring}
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
                                      fontFamily: 'Poppins-Regular',
                                    }}>
                                    {item?.details.property_details.property_size.length > 0 ? item.details.property_details.property_size : "0"}

                                    {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size : 0} */}
                                    {' sqft'}
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
                                      fontSize: 11,
                                      color: Colors.black,
                                      textAlign: 'center',
                                      fontFamily: 'Poppins-Regular',
                                    }}>
                                    {"$"}
                                    {item?.hoa_fee.length > 0 ? item.hoa_fee : "0"}

                                    {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].hoa_fee.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].hoa_fee : 0} */}

                                  </Text>
                                </View>
                              </View>

                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: 50,
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
                                      fontSize: 11,
                                      color: Colors.black,
                                      textAlign: 'center',
                                      fontFamily: 'Poppins-Regular',
                                    }}>
                                    {item?.details.property_details.taxes.length > 0 ? item.details.property_details.taxes : "0"}

                                    {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.taxes.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.taxes : 0} */}

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
                                      fontSize: 11,
                                      color: Colors.black,
                                      textAlign: 'center',
                                      fontFamily: 'Poppins-Regular',
                                    }}>
                                    {item?.details.property_details.yearbuilt.length > 0 ? item.details.property_details.yearbuilt : "0"}

                                    {/* {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.yearbuilt.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.yearbuilt : 0} */}

                                  </Text>
                                </View>
                              </View>

                            </View>
                          </View>
                        </ScrollView>
                      </View>






                    </View>
                  )} />
              </View>
            </View>
          </View>
          <View style={{
            width: '100%',
            paddingLeft: 16,
            paddingRight: 2,


          }}>
            <>
              <Text
                numberOfLines={property?.ID == readmore ? 0 : 100}
                style={{
                  fontSize: 12,
                  flexDirection: 'row',
                  color: Colors.black,
                  width: '100%',
                  fontFamily: "Poppins-Regular", lineHeight: 22
                }}>
                {typeof property?.content.rendered === 'string' ? (
                  <>
                    {showFullContent || property?.content.rendered.length < 100 ? (
                      property?.content.rendered
                    ) : (
                      property?.content.rendered.slice(0, 100) + ''
                    )}
                  </>
                ) : (
                  null
                )}
              </Text>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", width: "100%" }}
                onPress={() => setShowFullContent(!showFullContent)}>
                <Text style={{ color: Colors.darbluec, marginVertical: 10, fontSize: 13, fontFamily: "Poppins-Regular" }}>{showFullContent ? 'Show Less' : 'Read More'}</Text>
              </TouchableOpacity>

            </>

          </View>
          <View style={{
            borderTopColor: Colors.BorderColor, borderTopWidth: 1,
            width: "90%", alignSelf: "center", marginBottom: 12
          }}></View>
          <View style={{ justifyContent: "center", width: "100%", }}>
            <View style={styles.featuresDetails}>
              <ScrollView horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 }}>
                  <View style={styles.featuersComtainer}>
                    <View style={{ justifyContent: "center", }}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTab(0);
                        }}
                        style={styles.detailsStyle}>

                        <Image
                          source={Images.detail}
                          style={{
                            height: 20,
                            width: 20,
                            resizeMode: 'contain',
                            tintColor: selectedTab == 0 ? Colors.primaryBlue : Colors.black,
                          }}></Image>
                        <Text style={{
                          fontSize: 11,
                          color: selectedTab == 0 ? Colors.primaryBlue : Colors.black,
                          textAlign: 'center',
                          fontFamily: 'Poppins-Regular',
                        }}>Details</Text>

                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(1);
                        selectedTab ? Colors.darbluec : "black"
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.features}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                          tintColor: selectedTab == 1 ? Colors.primaryBlue : Colors.black,
                        }}></Image>
                      <Text style={{
                        fontSize: 11,
                        color: selectedTab == 1 ? Colors.primaryBlue : Colors.black,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Regular',
                      }}>Features</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(2);
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.address}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                          tintColor: selectedTab == 2 ? Colors.primaryBlue : Colors.black,
                        }}></Image>
                      <Text style={{
                        fontSize: 11,
                        color: selectedTab == 2 ? Colors.primaryBlue : Colors.black,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Regular',
                      }}>Property Location</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(6);
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.cal}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                          tintColor: selectedTab == 6 ? Colors.primaryBlue : Colors.black,
                        }}></Image>
                      <Text style={{
                        fontSize: 11,
                        color: selectedTab == 6 ? Colors.primaryBlue : Colors.black,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Regular',
                      }}>Mortgage Calculator</Text>
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
                        source={Images.nearBy}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                          tintColor: selectedTab == 3 ? Colors.primaryBlue : Colors.black,
                        }}></Image>
                      <Text style={{
                        fontSize: 11,
                        color: selectedTab == 3 ? Colors.primaryBlue : Colors.black,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Regular',
                      }}>What's Nearby </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(7);
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.sch}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                          tintColor: selectedTab == 7 ? Colors.primaryBlue : Colors.black,
                        }}></Image>
                      <Text style={{
                        fontSize: 11,
                        color: selectedTab == 7 ? Colors.primaryBlue : Colors.black,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Regular',
                      }}>Schools</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.featuersComtainer}>
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
                  </View>
                  <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(5);
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.cloud}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                          tintColor: selectedTab == 5 ? Colors.primaryBlue : Colors.black,
                        }}></Image>
                      <Text style={{
                        fontSize: 11,
                        color: selectedTab == 5 ? Colors.primaryBlue : Colors.black,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Regular',
                      }}>Current Weather</Text>
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
                              borderRadius: 100
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


                              {ratingData.length >0  ? (
                                <TextInput
                                  multiline={true}
                                  style={{
                                    verticalAlign: "top",
                                    borderWidth: 1, borderColor: Colors.BorderColor, borderRadius: 8, paddingHorizontal: 12,
                                    fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", height: 100,
                                    width: "100%"
                                  }}
                                  value={review}
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
                            {ratingData.length >0  ? (
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
                                    height: 45,
                                    width: 130,
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
                                      fontSize: 14,
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

            </View>

          </View >

          {selectedTab == 0 ? (<Details />) : selectedTab == 1 ? (<Featuers />) : selectedTab == 2 ? (<Address />) : selectedTab == 3 ? (<NearBy />) : selectedTab == 4 ? (<WalkSco />) : selectedTab == 5 ? (<CurrentWeather />) : selectedTab == 6 ? (<Calculator />) : (<School />)
          }


        </ScrollView >

      </SafeAreaView >


   
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          position: 'absolute',
          justifyContent: 'space-between',
     
          bottom:0,
          backgroundColor: Colors.white,
         paddingVertical:16,
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '30%',
            flexDirection: 'row',
            left:10

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
                marginRight: 10
              }}
              onPress={() => {
                // setProductId(postID.postid.ID);
                // setReviewTitle(postID.postid.title);
                // toggleModal();
                makePhoneCall()
              }}>
              <Image
                source={Images.newcall}
                style={{ height: 29, width: 29, resizeMode: 'contain' }}></Image>
              {/* <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  textAlign: 'center',
                  marginLeft: 5,
                  fontFamily: 'Poppins-Regular',
                }}>
                Call
              </Text> */}
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
                source={Images.chatnew}
                style={{ height: 28, width: 28, resizeMode: 'contain' }}></Image>
              {/* <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  textAlign: 'center',
                  marginLeft: 5,
                  fontFamily: 'Poppins-Regular',
                }}>
                Chat
              </Text> */}
            </TouchableOpacity>
          </View>
        </View>

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
            alignSelf: 'center',
            //backgroundColor: Colors.surfblur,
            borderRadius: 50,
            paddingVertical: 8,
            paddingHorizontal: 16,
            lineHeight: 12,
            marginRight:10,
            borderWidth:2,
            borderColor:Colors.surfblur
          }}
        >
          
          <Text
            style={{
              fontSize: 13,
              color: Colors.surfblur,
              textAlign: 'center',
              marginLeft: 5,
              fontFamily: 'Poppins-Medium',
              //  paddingTop:2
              position: "relative",
              top: 2,
              letterSpacing:0
            }}
          >
          Schedule a Tour
          </Text>
          <Image
            source={Images.bus}
            style={{

              height: 27, width: 49,
              resizeMode: 'contain',marginLeft:12
            }}
          />
        </TouchableOpacity>


      </View>

    </>
  )
}

export default ViewPropertiy





const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverlocation: {
    backgroundColor: "rgba(255,255,255,.8)", height: 38, width: 35, position: "absolute", top: 15, zIndex: 99,
    alignItems: "center",
    justifyContent: "center", borderRadius: 3,
    right: 12,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  locationpic: { resizeMode: "contain", width: 16, height: 16 },
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
    transform: [{ rotate: '-180deg' }]
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
    alignItems: "center",
    justifyContent: 'center',
    paddingRight: 28,

    // width: 100
    // width: 105,
    // paddingHorizontal: 4,
    // backgroundColor: "green",



  },
  map: {
    width: "100%",
    height: 328,
    borderRadius: 22,

    flex: 1,
  },
  maincovermap: {
    justifyContent: "center", alignItems: "center",
    flex: 1,
    borderRadius: 20, // Set the border radius for the container View
    overflow: 'hidden',
    //backgroundColor: "red",
    marginHorizontal: 16, position: "relative"
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
    backgroundColor: "#fff",
    alignItems: 'center',
  },

  imgg: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  property: {
    fontSize: 16,
    color: Colors.black,
    //fontWeight: 'bold',
    fontFamily: "Poppins-SemiBold"
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
    marginTop: 10
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
    fontSize: 12,
    color: Colors.black,
    marginTop: 5,
    fontFamily: "Poppins-Regular"
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
    alignItems: "center",
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    paddingVertical: 10,
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
    left: 10
  },


  rating: {
    marginVertical: 2,
  },
  propertyt: {
    fontSize: 18,
    color: Colors.black,
    marginTop: 20,
    paddingStart: 20,
    fontFamily: "Poppins-SemiBold",
    // fontWeight: 'bold'
  },
  addresss: { height: 1400 },
  propertyts: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 20,
    fontFamily: "Poppins-Medium",
    // fontWeight: 'bold'
  },
  propsmain: { fontFamily: "Poppins-Medium", color: Colors.sitegray, paddingBottom: 4 },
  propsinnermain: { fontFamily: "Poppins-Regular" },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#0065C4"
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
})
