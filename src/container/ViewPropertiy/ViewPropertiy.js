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
  useWindowDimensions
} from 'react-native';
import clamp from 'clamp';
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
import MapView, { PROVIDER_GOOGLE, Callout, Circle, Marker } from "react-native-maps";
import { getRating } from '../../modules/getRating';
import { postUpdateRating } from '../../modules/postUpdateRating';
import { store } from '../../redux/store';
import { addToFavorite } from '../../modules/addToFavorite';
import { addRemoveTrash } from '../../modules/addRemoveTrash';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import { getAgent } from '../../modules/getAgent';
import * as Animatable from 'react-native-animatable';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const { width } = Dimensions.get('screen');
const SWIPE_THRESHOLD = 0.25 * width;

const ViewPropertiy = (props, imageUrl) => {

  const postid = props.route.params
  console.log("postidpostid", postid.item.ID)
  const [showCallout, setShowCallOut] = useState(false)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');

  const property = data[0];
  console.log(property, "propertypropertyproperty");
  const [calData, setCalData] = useState([]);
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const [readmore, setreadmore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  // const [filterData, setFilterData] = useState([]);
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
  console.log(region, "region")

  useEffect(() => {
    getPopertiesDetailsApiCall();
    getRatingApicall();
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
          if (velocity > 0) {

            console.log(
              'right',
              (
                idPost = store.getState().getPopertiesDetails.getPopertiesDetails.data[0].ID)
            );
            savefile(idPost);
          } else {
            console.log(
              'left',
              (
                idPost = store.getState().getPopertiesDetails.getPopertiesDetails.data[0].ID)
            );
            trashfile(idPost);

          }
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
    dispatch(getPopertiesDetails(postid.item.ID)).then(response => {
      console.log("api response getPopertiesDetails", response)
      setLoading(false);
      setData(response.payload.data);
      setCalData(response.payload.data[0].moartage || []);
      setweather(response.payload.data[0].current_weather);
      settax(response.payload.data[0].tax_history);
      setWalk(response.payload.data[0].walkscore);
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
  const handleShare = () => {
    Share.share({
      message: 'Check out this cool article I found!',
      url: 'https://example.com/article',
      title: 'Cool Article',
    });
  };
  const getRatingApicall = () => {
    dispatch(getRating()).then(response => {
      console.log('MMM', response.payload.data)
      setRatingData(response.payload.data)
    })
  }
  const savefile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');

    let payload = {
      userID: userID,
      post_id: post_id,
    };
    console.log('tarsh payload', payload);

    await dispatch(addToFavorite(payload)).then(response => {
      if (response.payload.success) {
        // Alert.alert('Alert', response.payload.message);
      } else {
        // Alert.alert('Alert', response.payload.message);
      }
    });
  };
  const getAgentApicall = () => {
    dispatch(getAgent()).then(response => {
      console.log('rrrohan', response.payload.data);
      setAgentData(response.payload.data);


    });
  }

  const trashfile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');

    let payload = {
      userID: userID,
      post_id: post_id,
    };
    console.log('tarsh payload', payload);

    await dispatch(addRemoveTrash(payload)).then(response => {
      if (response.payload.success) {
        // Alert.alert('Alert', response.payload.message);
      } else {
        // Alert.alert('Alert', response.payload.message);
      }
    });
  };


  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
              <Text style={styles.props}>A/C: {data.map((item) => item.details.interior_features.A_C)} </Text>
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
            <Text style={styles.props}>Listing Office: {data.map((item) => item.details.miscellaneous_details.listing_office)} sq ft </Text>

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
                        style={{ height: 15, width: 15, resizeMode: 'contain', marginRight: 15 }}></Image>
                      <Text style={{ color: "black" }}>{item}</Text>
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
      console.log('Callout pressed!');
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
            <View style={styles.coverlocation}>
              <Image source={Images.graylocation} style={styles.locationpic}></Image>

            </View>
            <MapView
              provider={PROVIDER_GOOGLE}
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
                <Image source={Images.lot} style={{ height: 50, width: 100, resizeMode: 'contain' }} />

                <Callout style={{height:70,alignItems:"center",alignSelf:"center"}}>

                  <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' ,
             
                  }}>
                    <Text style={{
                      position:"relative",height:100,
                      borderRadius:100,top:-30
                       }}><Image style={{ height:100, width: 100,borderRadius:100,resizeMode:"stretch", }} source={{ uri: property?.featured_image_src }} resizeMethod='auto' />
                    </Text>
                    <View style={{flexWrap:"wrap" ,top:-5 }}>
                      <Text style={{ color: 'black', marginLeft: 10, fontWeight: '500', flexWrap:"wrap"  }}>{property?.address.property_address.address} | {property?.address.property_address.state_county}</Text>
                      <Text style={{ color: Colors.primaryBlue, marginLeft: 10, fontWeight: '500' }}>{data.map((item) => item.details.property_details.price)}</Text>
                      <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        <Text>{store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms : 0}
                          {' Beds'}    </Text>
                        <Text >{store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull : 0}
                          {' Baths'}   </Text>
                        <Text>{store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size : 0}
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
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.propertyts}>Nearby</Text>
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
                      <Image style={{ height: 15, width: 100, }} source={{ uri: item.image_url }} />
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
          {console.log('url ===>', walk?.walkscore_details)}
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
                <Image style={{ color: "black" }} source={{ uri: weather?.current_condition_icon }} />
              </View>
            </View>
            <Text style={styles.props}>Temperature: {weather.current_temp}</Text>
          </View>
        </View>
      </>
    )
  }
  const Calculator = () => {
    return (
      <>
        <View style={{ height: "100%", width: "100%" }}>
          <Text style={styles.propertyt}>Moartage Calculator</Text>
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
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}> School Rating</Text>
            </View>
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
      <ScrollView >
        <SafeAreaView style={{ flex: 1 }}>

          <View
            style={{
              width: '92%',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            {data
              .slice(0, 2)
              .reverse()
              .map((item, index, items) => {
                const isLastItem = index === items.length - 1;
                const panHandlers = isLastItem
                  ? { ..._panResponder.panHandlers }
                  : {};
                const isSecondToLast = index === items.length - 2;
                const rotate = animation.x.interpolate({
                  inputRange: [-200, 0, 200],
                  outputRange: ['-30deg', '0deg', '30deg'],
                  extrapolate: 'clamp',
                });
                const animatedCardStyles = {
                  transform: [{ rotate }, ...animation.getTranslateTransform()],
                  opacity,
                };
                const cardStyle = animatedCardStyles;
                const nextStyle = isSecondToLast && {
                  transform: [{ scale: scale }],
                  borderRadius: 5,
                };

                return (
                  <>
                    <View style={{ position: 'relative', width: '100%' }}>
                      <View style={styles.headerIcon}>
                        <TouchableOpacity
                          onPress={() => navigation.goBack()}
                          style={styles.screen}>
                          <Image source={Images.downArrow} style={styles.imagedata}></Image>
                        </TouchableOpacity>
                      </View>
                      <Animated.View
                        {...panHandlers}
                        style={[styles.card, cardStyle, nextStyle]}
                        key={item.id}>
                        <View>
                          <View onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.item.ID })} >
                            <Image
                              source={{ uri: property?.featured_image_src }} style={styles.slide} />
                          </View>
                        </View>
                      </Animated.View>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: Colors.white,
                          //paddingHorizontal: 12,
                          paddingVertical: 12,
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
                            }}>
                            <Image
                              source={Images.star}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                marginTop: -6,
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
                            {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].Total_average_rating}
                          </Text>
                        </View>
                        <Text
                          onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.item.ID })}
                          style={{
                            fontSize: 20,
                            color: Colors.primaryBlue,
                            fontWeight: '500',
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          {store.getState().getPopertiesDetails.getPopertiesDetails.data[0]?.price}
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
                      <KeyboardAvoidingView>
                        <Modal
                          transparent={true}
                          animationType="slide"
                          visible={modalVisible}
                          onRequestClose={toggleModal}>
                          <View
                            style={{

                              // height: '80%',
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
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Colors.gray,
                                  }}></Text>
                              </TouchableOpacity>
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginTop: 10,
                                }}>

                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: Colors.black,
                                    marginTop: 10,
                                    fontFamily: 'Poppins-Regular',
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
                              <View
                                style={{ width: '95%', alignSelf: 'center' }}>
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
                                    ratingColor="blue"
                                  //tintColor="#f1f3f4"
                                  />
                                </View>
                              </View>

                              <View
                                style={{ width: '95%', alignSelf: 'center' }}>
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
                                    ratingColor="blue"
                                  //tintColor="#f1f3f4"
                                  />
                                </View>
                              </View>
                              <View
                                style={{ width: '95%', alignSelf: 'center' }}>
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
                                    ratingColor="blue"
                                  //tintColor="#f1f3f4"
                                  />
                                </View>
                              </View>

                              <View
                                style={{ width: '95%', alignSelf: 'center' }}>
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
                                    ratingColor="blue"
                                  //tintColor="#f1f3f4"
                                  />
                                </View>
                              </View>

                              <View style={{ height: 20 }}></View>
                              <View
                                style={{ width: '95%', alignSelf: 'center' }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Colors.black,
                                    marginTop: 12,
                                    fontFamily: 'Poppins-Regular',
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
                                      alignItems: 'flex-start',
                                      alignSelf: 'flex-start',
                                      verticalAlign: 'top',
                                      fontFamily: 'Poppins-Regular',
                                    }}
                                    //keyboardType="default"
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    placeholderTextColor={Colors.gray}
                                    placeholder="Write a review..."
                                    onChangeText={text => setReview(text)}
                                  />
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
                                      fontFamily: 'Poppins-Regular',
                                    }}>
                                    Submit
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </Modal>
                      </KeyboardAvoidingView>
                      <View
                        style={{
                          justifyContent: 'space-between',
                          backgroundColor: Colors.white,
                        }}>
                        <View
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            backgroundColor: Colors.white,
                            paddingHorizontal: 12,
                          }}>
                          <Text
                            onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.item.ID })}
                            style={{
                              fontSize: 14,
                              color: Colors.black,
                              marginBottom: 15,
                              textAlign: 'center',
                              fontFamily: 'Poppins-Medium',
                            }}>
                            {item.title}
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        // alignItems: "flex-start", 
                        justifyContent: 'space-between',

                      }}>
                        <ScrollView horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false} style={{ width: "100%", }} >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: "center",
                              //paddingHorizontal: 12,
                              justifyContent: 'space-between',
                              // marginBottom: 12,

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
                                  width: 100,
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
                                    {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms : 0}
                                    {' Beds'}
                                  </Text>
                                </View>
                              </View>


                              <View
                                style={{
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',

                                  width: 100,
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
                                    {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull : 0}
                                    {' Baths'}

                                  </Text>
                                </View>
                              </View>



                              <View
                                style={{
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',

                                  width: 100,
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
                                    {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size : 0}
                                    {' sq ft'}
                                  </Text>
                                </View>
                              </View>


                              <View
                                style={{
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',

                                  width: 100,
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
                                    {"$"}{store.getState().getPopertiesDetails.getPopertiesDetails.data[0].hoa_fee.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].hoa_fee : 0}

                                  </Text>
                                </View>
                              </View>


                              <View
                                style={{
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',

                                  width: 100,

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
                                    {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.taxes.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.taxes : 0}

                                  </Text>
                                </View>

                              </View>
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
                                  {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.yearbuilt.length > 0 ? store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.yearbuilt : 0}

                                </Text>
                              </View>
                            </View>

                          </View>
                        </ScrollView>
                      </View>

                    </View >
                  </>
                );
              })}
          </View>


          <View style={{
            width: '100%',
            paddingLeft: 16,
            paddingRight: 2
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
                <Text style={{ color: "darkblue", marginVertical: 10, fontSize: 14, fontFamily: "Poppins-Regular" }}>{showFullContent ? 'Show Less' : 'Read More'}</Text>
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
                          style={styles.detail}></Image>
                        <Text style={styles.detailText}>Details</Text>

                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(1);
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.features}
                        style={styles.detail}></Image>
                      <Text style={styles.detailText}>Features</Text>
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
                        style={styles.detail}></Image>
                      <Text style={styles.detailText}>Map</Text>
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
                        style={styles.detail}></Image>
                      <Text style={styles.detailText}>Moartage Calculator</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.featuersComtainer}>
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
                  </View>
                  <View style={styles.featuersComtainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTab(3);
                      }}
                      style={styles.detailsStyle}>
                      <Image
                        source={Images.nearBy}
                        style={[styles.detail, { tintColor: "blue" }]}></Image>
                      <Text style={[styles.detailText]}>What's Nearby </Text>
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
                        style={styles.detail}></Image>
                      <Text style={styles.detailText}>School Rating</Text>
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
                        style={styles.detail}></Image>
                      <Text style={styles.detailText}> Walk Score</Text>
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
                        style={styles.detail}></Image>
                      <Text style={styles.detailText}>Current Weather</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
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
            </View>

          </View >

          {selectedTab == 0 ? (<Details />) : selectedTab == 1 ? (<Featuers />) : selectedTab == 2 ? (<Address />) : selectedTab == 3 ? (<NearBy />) : selectedTab == 4 ? (<WalkSco />) : selectedTab == 5 ? (<CurrentWeather />) : selectedTab == 6 ? (<Calculator />) : selectedTab == 7 ? (<School />) : (<TaxHistory />)
          }
          <ScrollView style={{ flex: 1, marginBottom: 10 }}>

            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                // height: 70,
                marginTop: 20,
                justifyContent: 'space-between',
                borderTopWidth: 1,
                marginHorizontal: 12,
                borderTopColor: Colors.textColorLight,
                alignItems: 'center',

                paddingTop: 18
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  //width: '50%',
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
                      // setProductId(postid.ID);
                      // setReviewTitle(postid.title);
                      // toggleModal();
                      makePhoneCall()
                    }}>
                    <Image
                      source={Images.call}
                      style={{ height: 22, width: 22, resizeMode: 'contain' }}></Image>
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.black,
                        textAlign: 'center',
                        // marginLeft: 5,
                        fontFamily: 'Poppins-Regular',
                      }}>
                      Call
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  alignContent: 'center',
                }}>
                <TouchableOpacity style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }} onPress={() => navigation.navigate('ChatSearch')}>
                  <Image
                    source={Images.chat}
                    style={{ height: 18, width: 18, resizeMode: 'contain' }}></Image>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.black,
                      textAlign: 'center',
                      //marginLeft: 5,
                      fontFamily: 'Poppins-Regular',

                    }}>
                    Chat
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{

                  // width: '50%',
                }}>
                <TouchableOpacity
                  onPress={() => { navigation.navigate('ChatSearch') }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: Colors.surfblur,
                    borderRadius: 100,
                    //height: 40,
                    alignSelf: "center",
                    // width: '80%',
                    paddingHorizontal: 16,
                    paddingVertical: 8
                  }}>
                  <Image
                    source={Images.bookTour}
                    style={{ height: 18, width: 18, resizeMode: 'contain' }}></Image>
                  <Text
                    style={{
                      fontSize: 10,
                      color: Colors.white,
                      textAlign: 'center',
                      marginLeft: 5,
                      marginTop: 4,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    SCHEDULE A SHOWING
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>


        </SafeAreaView >
      </ScrollView >



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
    paddingRight: 28
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
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    transform: [{ rotate: '90deg' }],
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
    height: 28,
    width: 28,
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
    fontSize: 13,
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
    zIndex: 9,
    position: 'absolute',
    top: 18,
    left: 0
  },


  rating: {
    marginVertical: 2,
  },
  propertyt: {
    fontSize: 18,
    color: Colors.black,
    marginTop: 20,
    paddingStart: 20,
    fontWeight: 'bold'
  },
  addresss: { height: 1400 },
  propertyts: {
    fontSize: 18,
    color: Colors.black,
    marginTop: 20,
    fontWeight: 'bold'
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
    backgroundColor: '#fdfdfd',

  },
})
