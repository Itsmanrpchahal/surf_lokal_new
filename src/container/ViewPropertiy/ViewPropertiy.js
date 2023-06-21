

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
  Modal,
  Button,
  FlatList
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { getPopertiesDetails } from '../../modules/getPopertiesDetails';
import Swiper from 'react-native-swiper';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;


const renderItem = ({ item }) => {
  return (
    <>
    <View style={{ flex:1,flexDirection:'row',alignContent:'center',marginVertical:5,justifyContent:'space-between'}}>
    <View style={{ }}>
      <Text style={{color:"black"}}>{item.unite_name}</Text>
      <Text style={{color:"gray"}}>{item.unit_distance}</Text>
      </View>
      <View>
        <Image style={{height:15,width:100,}} source={{uri:item.image_url}} />
      </View>
      </View>
    </>
  );
};

const ViewPropertiy = props => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [nearByData, setNearByData] = useState([])
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [readmore, setreadmore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [adress, setAdress] = useState(false);
  const [ans, setans] = useState([])
  const [showDetals, setshowDetals] = useState(false);
  const [ShowNear, setShowNear] = useState(false);
  const [walkScore, setwalkScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const postID = props.route.params
  console.log("testing????????????????????????", postID.data)

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const [rating, setRating] = useState(0);
  const handleRating = rating => {
    setRating(rating);
  };
  useEffect(() => {
    getPopertiesDetailsApiCall();
  }, []);


  const getPopertiesDetailsApiCall = () => {
    console.log("data", postID)
    dispatch(getPopertiesDetails(postID.data.ID)).then(response => {
      console.log("api response", response)
      if (response.payload.data == null) {
        console.log("hello world")
        setLoading(true);
      }
      else {
        setLoading(false)
      }
      setData(response.payload.data);
      console.log(data,"dddddddddddddddddddddd");
      setNearByData(response.payload.data[0].what_is_nearby || []);
      console.log(nearByData,"nearByDatanearByData");
    });
  };
  console.log(data, 'show Api data');

  const Details = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.viewstyle}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Property Details
              </Text>
              <Text style={styles.props}>Price: {data.map((item) => item.price)} </Text>
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
              <Text style={styles.property}>Property Features
              </Text>
              <Text style={styles.props}>{data.map((item) => item.features.property_features.join(', '))} </Text>

            </View>
          </View>
        </ScrollView>
      </>
    )
  }
  const Address = () => {
    return (
      <>
        <View style={{ flex: 1 }}>
          <View style={styles.address}>
            <View style={{ width: '100%', paddingHorizontal: 20, }}>
              <Text style={styles.property}>Property Address
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.props}>Area: {data.map((item) => item.address.property_address.area)}</Text>
                <Text style={styles.props}>City: {data.map((item) => item.address.property_address.city)} </Text>
                <Text style={styles.props}>Country: {data.map((item) => item.address.property_address.Country)} </Text>
                <Text style={styles.props}>Property latitude:{data.map((item) => item.address.property_latitude)}</Text>
                <Text style={styles.props}>Address:{data.map((item) => item.address.property_address.address)} </Text>
                <Text style={styles.props}>State county:{data.map((item) => item.address.property_address.state_county)} </Text>
                <Text style={styles.props}>City: {data.map((item) => item.address.property_address.city)} </Text>
                <Text style={styles.props}>Property longitude: {data.map((item) => item.address.property_longitude)} </Text>
                <Text style={styles.props}>Zip: {data.map((item) => item.address.property_address.zip)} </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    )
  }
  const NearBy = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
              <FlatList
                data={nearByData}
                keyExtractor={(item) => item.unite_name}
                renderItem={renderItem}
              />
          </View>

        </View>
      </>
    )
  }
  const WalkSco = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Walk Sco  </Text>
            </View>
          </View>

        </View>
      </>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.slideOuter}>
        <TouchableOpacity onPress={() =>
          navigation.navigate('ViewPropertiyImage', { data: postID.data })}>
          <Image
            source={{ uri: postID?.data?.featured_image_src }}
            style={styles.slide} />
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.screen}>
            <Image
              source={Images.downArrow}
              style={styles.imagedata}></Image>
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={Images.address}
              style={styles.addresimage}></Image>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            position: 'absolute',
            bottom: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewPropertiyImage', { data: postID.data })}>
            <Image
              source={Images.imageView}
              style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
          </TouchableOpacity>
        </View>
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
              onPress={() => toggleModal()}
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
                {postID.data.total_average_rating}
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 18,
                color: Colors.primaryBlue,
                fontWeight: '500',
              }}>{postID.data?.property_price}
            </Text>
            <TouchableOpacity>
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
            <Text
              style={{ fontSize: 16, color: Colors.black, textAlign: 'center' }}>
              {postID?.data?.title}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            {postID.data.property_bedrooms != '' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
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
                  {postID.data.property_bedrooms} {'Beds'}
                </Text>
              </View>
            ) : null}
            {postID.data.bathroomsfull != '' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
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
                  {postID.data.bathroomsfull} {'Bath'}
                </Text>
              </View>
            ) : null}
            {postID.data.property_size != '' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
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
                  {postID.data.property_size} {'sq ft'}
                </Text>
              </View>
            ) : null}
            {postID.data.associationfee != '' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',

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
                  {'$'}{postID.data.associationfee == null ? 0 : postID.data.associationfee}
                </Text>
              </View>
            ) : null}
          </View>
          </View>



          <View style={{ width: '90%',paddingStart:10, paddingVertical: 10 }}>
            <>
              <Text
                numberOfLines={postID.data.ID == readmore ? 0 : 20}
                style={{
                  fontSize: 14,
                  flexDirection: 'row',
                  color: Colors.black,
                  width: '100%',
                }}>
                {typeof postID.data.content.rendered === 'string' ? (
                  <>
                    {showFullContent || postID.data.content.rendered.length < 20 ? (
                      postID.data.content.rendered
                    ) : (
                      postID.data.content.rendered.slice(0, 20) + '...    '
                    )}

                  </>
                ) : (
                  null
                )}
              </Text>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => setShowFullContent(!showFullContent)}>
                <Text style={{ color: "darkblue", marginTop: 10, fontSize: 16 }}>{showFullContent ? 'Show Less' : 'Read More'}</Text>
              </TouchableOpacity>
            </>
          </View>
         
          <View style={styles.featuresDetails}>

            <TouchableOpacity

              onPress={() => {
                setSelectedTab(0);
              }}
              style={styles.detailsStyle}>
              <Image
                source={Images.detail}
                style={styles.detail}></Image>
              <Text style={styles.detailText}>Detail</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setSelectedTab(1);
            }}
              style={styles.detailsStyle}>
              <Image
                source={Images.features}
                style={styles.detail}></Image>
              <Text style={styles.detailText}>Features</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => {
              setSelectedTab(2);
            }}
              style={styles.detailsStyle}>
              <Image
                source={Images.address}
                style={styles.detail}></Image>
              <Text style={styles.detailText}>Map</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setSelectedTab(3);
            }}
              style={styles.detailsStyle}>
              <Image
                source={Images.nearBy}
                style={styles.detail}></Image>
              <Text style={styles.detailText}>What Nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setSelectedTab(4);
            }}
              style={styles.detailsStyle}>
              <Image
                source={Images.cloud}
                style={styles.cloud}></Image>
              <Text style={styles.cloudText}>Cloud</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setSelectedTab(4);
            }}
              style={styles.detailsStyle}>
              <Image
                source={Images.sch}
                style={styles.detail}></Image>
              <Text style={styles.detailText}>School</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setSelectedTab(4);
            }}
              style={styles.detailsStyle}>
              <Image
                source={Images.cal}
                style={styles.detail}></Image>
              <Text style={styles.detailText}>Calculator</Text>
            </TouchableOpacity>
          </View>
         
       <ScrollView style={{ flex: 1,marginBottom:90 }}>
        {/* {showFeatures && featuers()}
        {adress && address()}
        {showDetals && Details()}
        {ShowNear && nearBy()} */}

        {selectedTab == 0 ? (<Details />) : selectedTab == 1 ? (<Featuers />) : selectedTab == 2 ? (<Address />) : selectedTab == 3 ? (<NearBy />) : (<WalkSco />)}

      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View
          style={{
            // marginTop: 40,
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
                // height:"50%"
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
                  startingValue={rating}
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
                  startingValue={rating}
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
                  startingValue={rating}
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
                  startingValue={rating}
                  ratingBackgroundColor="#c8c7c8"
                  onFinishRating={setRating}
                  style={styles.rating}
                  ratingColor="#ffbe0b"
                //tintColor="#f1f3f4"
                />
              </View>
            </View>


            <View style={{ height: 20,}}></View>
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
                  justifyContent: 'center',
                }}>
                <TextInput
                  allowFontScaling={false}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    height: '100%',
                    paddingHorizontal: 12,
                    color: Colors.black,
                    borderWidth: 1,
                    borderColor: Colors.gray,
                    fontSize: 14,
                    padding: 2,
                  }}
                  keyboardType="default"
                  autoCorrect={false}
                  returnKeyType="done"
                  placeholderTextColor={Colors.gray}
                  placeholder='Write a review...'
                // placeholderTextColor={Colors.black}
                //onChangeText={text => setMobile(text)}
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
                onPress={() => setModalVisible(false)}
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
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ bottom: 0, position: 'absolute', backgroundColor: "#fff" }}>

        <View
          style={styles.bottom}>
          <View
            style={styles.rate}>
            <TouchableOpacity
              onPress={() => toggleModal()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <Image
                source={Images.reviews}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
              <Text
                style={styles.ratetext}>
                Rate Property
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.contactUs}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
              <Text style={styles.call}>Call us  </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: '50%' }}>
            <TouchableOpacity
              style={styles.book}>
              <Image
                source={Images.bookTour}
                style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
              <Text
                style={styles.tour}>
                Book a tour
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    justifyContent: 'center'
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
    height: 15,
    width: 15,
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
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.gray,
  },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  property: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: 'bold'
  },
  detailText: {
    fontSize: 10,
    color: Colors.black,
    textAlign: 'center',
    marginLeft: 5,
  },
  cloudText: {
    fontSize: 10,
    color: Colors.black,
    textAlign: 'center',
  },
  slide: {
    width: screenWidth,
    height: screenHeight / 4,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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
    width: '90%',
    marginTop: 20,
    justifyContent: 'center',
  },
  address: {
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
  },
  props: {
    fontSize: 13,
   
    color: Colors.black,
    marginTop: 5
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

    borderTopWidth: 1,
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.gray
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
  headerIcon: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 99,
    position: 'absolute',
    top: 10,
  },
  //fliter
  filter: {
    height: 60,
  },
  rating: {
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ViewPropertiy;
