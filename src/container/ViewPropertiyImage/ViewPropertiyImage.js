import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import DeviceInfo from 'react-native-device-info';
import {addToFavorite} from '../../modules/addToFavorite';
import {addRemoveTrash} from '../../modules/addRemoveTrash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import { store } from '../../redux/store';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ViewPropertiyImage = props => {

  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const [orientation, setOrientation] = useState('portrait');
  const [agentData, setAgentData] = useState([0]);
  const [modalVisible, setModalVisible] = useState(false);

  const scrollViewRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };
  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 0);
  };
  const postID = props.route.params;
  const property = data[0];
  useEffect(() => {
    setData(store.getState().getPopertiesDetailsReducer.getPopertiesDetails?.data)
    setAgentData(store.getState().getAgentReducer.getAgentData.data)

    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    const handleChangeOrientation = () => {
      setOrientation(isPortrait() ? 'portrait' : 'landscape');
    };


    Dimensions.addEventListener('change', handleChangeOrientation);

  

  
  }, []);
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

  const makePhoneCall = () => {
    let phoneNumber = agentData[0]?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };





  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innercontainer}>
          <ScrollView ref={scrollViewRef} onScroll={handleScroll}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SingleImage', {
                  imageUri: property?.featured_image_src,
                })
              }>
              <Image
                source={{ uri: property?.featured_image_src }}
                style={styles.slide}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Videoplay', {
                  videoView: property.property_gallery.property_video,
                })
              }>
              <Image
                source={{ uri: property?.featured_image_src }}
                style={styles.slide}
              />
              <View style={styles.videoplayer}>
                <Image
                  source={Images.VideoPlay}
                  style={styles.videoplaterstyle}
                />
              </View>
            </TouchableOpacity>
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
              <Text style={styles.nofound}>No images found.</Text>
            )}
          </ScrollView>
          {isScrolled && (
            <TouchableOpacity onPress={scrollToTop} style={styles.buttonscroll}>
              <Image source={Images.downArrow} style={styles.toptoup} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.leftarrowicon}
            onPress={() => navigation.goBack()}>
            <Image
              style={styles.leftinnerarrow}
              source={Images.leftnewarrow}></Image>
          </TouchableOpacity>

    
          <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
          backgroundColor: '#f8f8f8',
          paddingVertical: 12,
          alignItems: 'center',
          position:"relative",
          paddingHorizontal:8,
          height:55
        }}>
        {/* <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
      
           width:"33.33%",
           justifyContent:"space-between",
           paddingRight:15
          }}>
       */}
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          
        
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
        
        {/* </View> */}

        {/* <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center",position:"relative",top:-18, 
         width:"33.33%",
       
         }}>
        <TouchableOpacity

        onPress={()=>{trashfile(property?.ID)}}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
               marginHorizontal:8
              }}>
              <Animatable.Image
                source={Images.RedDown}
                animation="bounce"
                duration={5000}
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 60,
                  width: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 60,
                  resizeMode: 'contain',
                }}/>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{savefile(property?.ID)}}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                marginHorizontal:8
              }}>
              <Animatable.Image
            
                source={Images.GreenUp}
                animation="bounce"
                duration={5000}
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 60,
                  width: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 60,
                  resizeMode: 'contain',
                }}/>
            </TouchableOpacity>
          </View> */}
       

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BookaTour', {
              ID: '',
              PropID: property?.ID,
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
            // paddingHorizontal:8,
            // paddingVertical:8,
            lineHeight: 12,
            // marginRight: 10,
            borderWidth: 2,
            borderColor: Colors.surfblur,
            height:45,  width:"45%",
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 30 : 18,
              color: Colors.surfblur,
              textAlign: 'center',
            //  marginLeft:10,
              fontFamily: 'Poppins-Medium',
              position: 'relative',
             
              letterSpacing: 0,
            }}>
            Schedule a Tour
          </Text>
       
        </TouchableOpacity>
      </View>
        </View>

      
     
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.white,
  },
  loaderstyle: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.7)',
    position: 'absolute',
    zIndex: 99,
    left: 0,
    top: 0,
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  mr10: { marginRight: 10 },
  slide: {
    width: screenWidth,
    height: screenHeight / 2.5,

    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imagedata: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    transform: [{ rotate: '90deg' }],
  },
  submitcover: {
    height: 35,
    width: '45%',
    borderRadius: 5,
    backgroundColor: Colors.PrimaryColor,
    marginTop: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoplayer: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  submittxt: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  leftarrowicon: {
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: 50,
    height: 50,
  },
  screen: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
    position: 'relative',
    left: 15,
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
    bottom: 80,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray,
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

  filter: {
    height: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBlue,
  },
  innercontainer: {
    height: '100%',
    width: '100%',
  },
  videoplaterstyle: { width: 80, height: 80, tintColor: 'white' },
  toptoup: {
    transform: [{ rotate: '180deg' }],
    width: 12,
    height: 12,
    tintColor: Colors.black,
    resizeMode: 'contain',
  },
  leftinnerarrow: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: 'white',
  },
  leftbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 50,
    paddingHorizontal: 16,
    lineHeight: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: Colors.surfblur,
  },
  buttontextschedule: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 21 : 13,
    color: Colors.surfblur,
    textAlign: 'center',
    marginLeft: 5,
    fontFamily: 'Poppins-Medium',
    position: 'relative',
    top: 2,
    letterSpacing: 0,
  },
  busicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 70 : 50,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 70 : 50,
  },
  mainmodalcover: {
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
  },
  maininnermodal: {
    height: '10%',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalheading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 10,
  },
  labelheadingtxt: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 10,
    marginRight: 180,
  },
  activityIndicatornew: {
    height: 5,
    width: 50,
    borderRadius: 8,
    backgroundColor: Colors.gray,
  },
  labeltext: { fontSize: 12, color: Colors.black },
  updatetext: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.PrimaryColor,
  },
  updatebuttoncover: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  pluscover: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  plusimage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.black,
    transform: [{ rotate: '45deg' }],
  },
  reviewinnertext: { margin: 10, fontSize: 12, color: 'black' },
  edittext: { fontSize: 12, color: 'blue' },
  coverrat: { width: '95%', alignSelf: 'center' },
  nofound: {
    textAlign: "center", fontFamily: "Poppins-Medium", fontSize: 16,
    position: "absolute", top: "50%", left: 0, right: 0, color: "black"
  },
  callicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 29,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 29,
    resizeMode: 'contain',
  },
  chaticon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 28,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 60 : 28,
    resizeMode: 'contain',
  },
  chatcover: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  upperchatcover: {
    justifyContent: 'center',
    alignItems: 'center',
  }, callcover: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginRight: 10,
  },
  calluppercover: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  }, bothicons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '30%',
    flexDirection: 'row',
    left: 10,
  },
  bottomcover: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    alignItems: 'center',
    alignContent: 'center',
  },
  textinputstyle: {
    margin: 10,
    fontSize: 12,
    color: 'black',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
  },
  textinputcover: {
    width: '100%',
    height: 100,
    marginTop: 10,
  },
  inputcont: { margin: 10, fontSize: 12, color: 'black' },
  innercoverrat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calliconnew: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 29,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 58 : 29,
    resizeMode: 'contain',
  }
});

export default ViewPropertiyImage;
