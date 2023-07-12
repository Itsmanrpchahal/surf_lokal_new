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
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { getRating } from '../../modules/getRating';
import { postUpdateRating } from '../../modules/postUpdateRating';
import { store } from '../../redux/store';
import { addToFavorite } from '../../modules/addToFavorite';
import { addRemoveTrash } from '../../modules/addRemoveTrash';


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
  console.log(region, "region")

  useEffect(() => {
    getPopertiesDetailsApiCall();
    getRatingApicall()
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
      console.log(data, "dddddddddddddddddddddd");
      setCalData(response.payload.data[0].moartage || []);
      // const mapp =data.map((item) => item.moartage[0].moartage_details || []);
      // console.log(calData, "calculator")
      setweather(response.payload.data[0].current_weather);
      // console.log("checkWeather////////", weather);
      settax(response.payload.data[0].tax_history);
      setWalk(response.payload.data[0].walkscore);
      // console.log(walk,"walk")
      setMap(response.payload.data[0].address.property_address);
      console.log(map, "map");
      const res = [
        {
          ID: "1034295",
          property_longitude: map.property_longitude.toString(),
          property_latitude: map.property_latitude.toString(),
          // other properties
        }
      ];
      const property = res[0];
      const latitude = parseFloat(property.property_latitude);
      const longitude = parseFloat(property.property_longitude);
      console.log(property, "property")
      setPin({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      });
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
            <View style={{ width: '50%' }}>
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
                      <Text>{item}</Text>
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

    return (
      <>
        <View style={{  width: "100%",paddingVertical:16}}>
          <View style={{ marginHorizontal: 10,marginBottom:16 }}>
            {/* <Text style={styles.property}>Address</Text> */}
            <Text style={styles.propsmain}>Address: <Text style={styles.propsinnermain}>{property?.address.property_address.address}</Text></Text>
            <Text style={styles.propsmain}>Area:  <Text style={styles.propsinnermain}>{property?.address.property_address.area}</Text></Text>
            <Text style={styles.propsmain}>State:  <Text style={styles.propsinnermain}>{property?.address.property_address.state_county}</Text></Text>
            <Text style={styles.propsmain}>County: <Text style={styles.propsinnermain}>{property?.address.property_address.Country}</Text></Text>
            <Text style={styles.propsmain}>Zip:  <Text style={styles.propsinnermain}>{property?.address.property_address.zip}</Text></Text>
          </View>
          <View style={styles.maincovermap} >
            <View style={styles.coverlocation}>
            <Image source={Images.graylocation} style={styles.locationpic}></Image>
            </View>
          <MapView
            style={styles.map}
            initialRegion={region}
            provider="google"
            zoomControlEnabled
          >
            {pin && <Marker coordinate={pin} />}
            {pin && (
              <Circle
                center={pin}
                radius={1000}
                fillColor="rgba(255, 0, 0, 0.2)"
                strokeColor="rgba(255, 0, 0, 0.5)"
                strokeWidth={2}
              />
            )}
          </MapView>
          </View>
        </View>
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
        <View style={{ paddingHorizontal: 20,}}>
          <Text style={styles.propertyts}>Current Weather</Text>
          <View style={styles.addresss}>
            <Text style={styles.props}>Location: {weather.location_name}</Text>
            <Text style={styles.props}>Localtime: {weather.location_localtime}</Text>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <Text style={styles.prop}>Condition: {weather.condition_text}</Text>
              <View style={{}}>
                <Image style={{color: "black" }} source={{ uri: weather?.current_condition_icon }} />
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
              source={{ uri: calData?.moartage_details }}
              onLoad={console.log("loaded")}
            />
            <Text style={styles.propertyt}>Moartage Calculator</Text>

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
      <ScrollView>
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
                          paddingHorizontal: 12,
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
                        <TouchableOpacity>
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
                                    ratingColor="#ffbe0b"
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
                                    ratingColor="#ffbe0b"
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
                                    ratingColor="#ffbe0b"
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
                                    ratingColor="#ffbe0b"
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
                      <View style={{    flexDirection: 'row',
    width: '100%',
    alignItems:"center",justifyContent: 'flex-start',}}>
                      <ScrollView horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          //paddingHorizontal: 12,
                          justifyContent: 'flex-start',
                          marginBottom:12
                          
                        }}>
                          
                        {property?.property_bedrooms != '' ? (
                          <View
                            style={{justifyContent: 'flex-start',alignItems: 'center',paddingHorizontal:18}}>
                            <Image
                              source={Images.bed}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                              
                              }}></Image>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.black,
                                textAlign: 'center',
                                fontFamily: 'Poppins-Regular',
                              }}>
                              {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bedrooms}
                              {' Beds'}
                            </Text>
                          </View>
                        ) : null}
                        {property?.bathroomsfull != '' ? (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',paddingHorizontal:18
                          
                            }}>
                            <Image
                              source={Images.bath}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                              }}></Image>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.black,
                                textAlign: 'center',
                                fontFamily: 'Poppins-Regular',
                              }}>
                              {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].bathroomsfull}
                              {' Baths'}

                            </Text>
                          </View>
                        ) : null}
                        
                        {property?.property_size != '' ? (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',paddingHorizontal:18
                            }}>
                            <Image
                              source={Images.measuring}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                              }}></Image>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.black,
                                textAlign: 'center',
                                fontFamily: 'Poppins-Regular',
                              }}>
                              {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.property_size}
                              {' sq ft'}
                            </Text>
                          </View>
                        ) : null}
                        {property?.associationfee != '' ? (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              paddingHorizontal:18
                             
                            }}>
                            <Text
                              style={{
                                fontSize: 13,
                                color: Colors.black,
                                textAlign: 'center',
                                fontWeight: 'bold',
                              }}>
                              {'HOA'}
                            </Text>
                            {/* <Image
              source={Images.hoa}
              style={{height: 25, width: 25, resizeMode: 'contain'}}></Image> */}
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.black,
                                marginTop: 6,
                                textAlign: 'center',
                                fontFamily: 'Poppins-Regular',
                              }}>
                              {"$"}{store.getState().getPopertiesDetails.getPopertiesDetails.data[0].hoa_fee}

                            </Text>
                          </View>
                        ) : null}
                        {item.property_size != '' ? (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',paddingHorizontal:18
                          
                            }}>
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
                                fontSize: 14,
                                color: Colors.black,
                                textAlign: 'center',
                                fontFamily: 'Poppins-Regular',
                              }}>
                              {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].details.property_details.taxes}

                            </Text>
                          </View>
                        ) : null}
                  
                      </View>
                      </ScrollView>
                      </View>
                    </View>
                  </>
                );
              })}
          </View>
          {/* <View style={styles.slideOuter}>

            <Animated.View
              style={[
                position.getLayout(),
                {},
              ]}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.item.ID })} >
                <Image
                  source={{ uri: property?.featured_image_src }} style={styles.slide} />
              </TouchableOpacity>
              <View style={styles.headerIcon}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.screen}>
                  <Image source={Images.downArrow} style={styles.imagedata}></Image>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={Images.address} style={styles.addresimage}></Image>
                </TouchableOpacity>
              </View>
              <View style={styles.imgview}>
                <View style={styles.imgg}>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.item.ID })}>
                  <Image source={Images.imageView} style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
                </TouchableOpacity>
              </View>
              <Animated.View style={{ position: 'absolute', top: 20, left: 20, opacity: likeOpacity }}>
                <Image source={Images.deletelike} style={{ height: 45, width: 45, tintColor: 'transparent' }} />
              </Animated.View>
              <Animated.View style={{ position: 'absolute', top: 20, right: 20, opacity: nopeOpacity }}>
                <Image source={Images.favlike} style={{ height: 45, width: 45, tintColor: 'transparent' }} />
              </Animated.View>
            </Animated.View>
          </View>
          <View style={styles.slideOuter}>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                marginTop: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setProductId(postid.item.ID);
                  setReviewTitle(postid.item.title)
                  toggleModal();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.star}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.black,
                    textAlign: 'center',
                    marginLeft: 5,
                  }}>
                  {property?.Total_average_rating}
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 18,
                  color: Colors.primaryBlue,
                  fontWeight: '500',
                }}>
                {property?.price}
              </Text>
              <TouchableOpacity onPress={() => shareContent()}>
                <Image
                  source={Images.send}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '80%',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 5,
              }}>
              <Text style={{ fontSize: 16, color: Colors.black, textAlign: 'center' }}>
                {property?.title}
              </Text>
            </View>

            <ScrollView horizontal={true} scrollEnabled={true}>


            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                marginTop: 10,
                marginLeft:12
                  // justifyContent: 'space-between',
              }}>
              {property?.bedrooms != '' ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                      marginRight: 12,
                      paddingRight: 12,
                  }}>
                  <Image
                    source={Images.bed}
                    style={{
                      height: 25,
                      width: 25,
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                      marginLeft: 5,
                    }}>
                    {property?.bedrooms} {'Beds'}
                  </Text>
                </View>
              ) : null}
              {property?.bathroomsfull != '' ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                      marginRight: 12,
                      paddingRight: 12,
                  }}>
                  <Image
                    source={Images.bath}
                    style={{
                      height: 25,
                      width: 25,
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                      marginLeft: 5,
                    }}>
                    {property?.bathroomsfull} {'Bath'}
                  </Text>
                </View>
              ) : null}
              {property?.property_size != '' ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                      marginRight: 12,
                      paddingRight: 12,
                  }}>
                  <Image
                    source={Images.measuring}
                    style={{
                      height: 25,
                      width: 25,
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                      marginLeft: 5,
                    }}>
                    {property?.details.property_details.property_size} {"sq ft"}
                  </Text>
                </View>
              ) : null}
              {property?.associationfeefrequency != '' ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                      marginRight: 12,
                      paddingRight: 12,
                    flexDirection: 'row',
                  }}>
                  <Text style={{ color: "black", fontSize: 13 }}>HOA</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      textAlign: 'center',
                      marginLeft: 5,
                    }}>
                    {'$'}{property?.hoa_fee == null ? 0 : property?.hoa_fee}
                  </Text>
                </View>
              ) : null}
                {property?.yearbuilt != '' ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                      paddingRight: 12,
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={Images.calendar}
                      style={{
                        height: 25,
                        width: 25,
                        resizeMode: 'contain',
                      }}></Image>
                    <Text
                      style={{
                        fontSize: 12,
                        color: Colors.black,
                        textAlign: 'center',
                        marginLeft: 5,
                      }}>
                      {property?.yearbuilt == null ? 0 : property?.yearbuilt}
                    </Text>
            </View>
                ) : null}


          </View>
            </ScrollView>

          </View> */}


          <View style={{ width: '100%', 
          paddingHorizontal:8 }}>
            <>
              <Text
                numberOfLines={property?.ID == readmore ? 0 : 100}
                style={{
                  fontSize: 13,
                  flexDirection: 'row',
                  color: Colors.black,
                  width: '100%',
                 fontFamily:"Poppins-Regular"
                }}>
                {typeof property?.content.rendered === 'string' ? (
                  <>
                    {showFullContent || property?.content.rendered.length < 100 ? (
                      property?.content.rendered
                    ) : (
                      property?.content.rendered.slice(0, 100) + '...    '
                    )}
                  </>
                ) : (
                  null
                )}
              </Text>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" ,width:"100%"}}
                onPress={() => setShowFullContent(!showFullContent)}>
                <Text style={{ color: "darkblue", marginVertical: 10, fontSize: 14,fontFamily:"Poppins-Regular" }}>{showFullContent ? 'Show Less' : 'Read More'}</Text>
              </TouchableOpacity>
            </>

          </View>


          <View style={styles.featuresDetails}>
            <ScrollView horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.featuersComtainer}>
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
                      style={styles.detail}></Image>
                    <Text style={styles.detailText}>What's Nearby </Text>
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
                        marginRight: 180
                      }}>
                      Your Review
                    </Text>
                    <Text style={{ margin: 10, fontSize: 12, color: 'black' }}>{ratingData[0]?.comment_content}</Text>
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
                        <Text style={{ fontSize: 12, color: Colors.black, }}>
                          Photos Quality Rating :
                        </Text>
                        <Rating
                          type="custom"
                          ratingCount={5}
                          imageSize={25}
                          startingValue={ratingData[0]?.photo_wuality_rating
                          }
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
                          startingValue={ratingData[0]?.description_review_stars
                          }
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
                          startingValue={ratingData[0]?.price_review_stars
                          }
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
                          startingValue={ratingData[0]?.interest_review_stars
                          }
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
                    <View style={{

                      width: '100%',

                      flexDirection: 'row',
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingHorizontal: 10
                    }}>
                      {isEditing ? (
                        <TouchableOpacity onPress={() => updateReview()} style={{ marginRight: 10 }}>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.PrimaryColor }}>Update</Text>
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
                            alignItems: "center",
                            justifyContent: "center"

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
            </KeyboardAvoidingView>
          </View>


          {selectedTab == 0 ? (<Details />) : selectedTab == 1 ? (<Featuers />) : selectedTab == 2 ? (<Address />) : selectedTab == 3 ? (<NearBy />) : selectedTab == 4 ? (<WalkSco />) : selectedTab == 5 ? (<CurrentWeather />) : selectedTab == 6 ? (<Calculator />) : selectedTab == 7 ? (<School />) : (<TaxHistory />)}
          <ScrollView style={{ flex: 1, marginBottom: 10 }}>
            
          <View
        style={{
          flexDirection: 'row',
          width: '90%',
         // height: 70,
          marginTop: 20,
          justifyContent: 'space-between',
          borderTopWidth: 1,
marginHorizontal:12,
          borderTopColor: Colors.textColorLight,
          alignItems: 'center',
         
          paddingTop:18
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
                setProductId(postid.ID);
                setReviewTitle(postid.title);
                toggleModal();
              }}>
              <Image
                source={Images.reviews}
                style={{height: 25, width: 25, resizeMode: 'contain'}}></Image>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  textAlign: 'center',
                  marginLeft: 5,
                  fontFamily: 'Poppins-Regular',
                }}>
                Rate Property
              </Text>
            </TouchableOpacity>
          </View>
          
        </View>
        <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity  style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }} onPress={() => navigation.navigate('ChatSearch' )}>
              <Image
                source={Images.chat}
                style={{height: 25, width: 25, resizeMode: 'contain'}}></Image>
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
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: Colors.primaryBlue,
              borderRadius: 14,
              height: 40,
             // width: '80%',
             paddingHorizontal:12
            }}>
            <Image
              source={Images.bookTour}
              style={{height: 20, width: 20, resizeMode: 'contain'}}></Image>
            <Text
              style={{
                fontSize: 16,
                color: Colors.white,
                textAlign: 'center',
                marginLeft: 5,
                fontFamily: 'Poppins-Regular',
              }}>
              Book a tour
            </Text>
          </TouchableOpacity>
        </View>
        
      </View>
          </ScrollView>

        </SafeAreaView>
      </ScrollView>
    </>
  )
}

export default ViewPropertiy





const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverlocation:{
    backgroundColor:"rgba(255,255,255,.8)",height:38,width:35,position:"absolute",top:15,zIndex:99,
    alignItems:"center",
    justifyContent:"center",borderRadius:3,
    right:12,
    shadowOffset: {width: -2, height: 4},  
    shadowColor: '#171717',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
  },
  locationpic:{resizeMode:"contain",width:16,height:16},
  tour: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    marginLeft: 5,
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
    // width: 105,
    // paddingHorizontal: 4,
    // backgroundColor:"red"


  },
  map: {
width:"100%",
   height:328,
   borderRadius:22,
   
   flex: 1, 
  },
  maincovermap:{
justifyContent:"center",alignItems:"center", 
flex: 1,
borderRadius: 20, // Set the border radius for the container View
overflow: 'hidden', 
backgroundColor:"red",
marginHorizontal:16,position:"relative"
},
  detail: {
    height: 27,
    width: 27,
    resizeMode: 'contain',
    marginBottom: 5,
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
    fontSize: 18,
    color: Colors.black,
   //fontWeight: 'bold',
    fontFamily:"Poppins-SemiBold"
  },
  detailText: {
    fontSize: 10,
    color: Colors.black,
    textAlign: 'center',

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
    width: screenWidth / 1.02,
    height: screenHeight / 2,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop:6
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
fontFamily:"Poppins-Regular"
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
    width: '95%',
    alignItems:"center",
    borderTopWidth: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    marginHorizontal:8
  },

  featuersComtainer: {
    // height:20,
  width: 95

  },

  headerIcon: {
    width: '100%',
  zIndex: 9,
    position: 'absolute',
    top: 12,
    left:-8
  },


  rating: {
    marginVertical: 5,
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
  propsmain:{fontFamily:"Poppins-Medium",color:Colors.sitegray,paddingBottom:4},
  propsinnermain:{fontFamily:"Poppins-Regular"},
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