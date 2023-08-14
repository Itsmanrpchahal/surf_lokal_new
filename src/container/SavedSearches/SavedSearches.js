import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  FlatList,
  Alert,
  Keyboard,
  RefreshControl
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from './Styles';
import { useSelector, useDispatch } from 'react-redux';
import { getSavedSearch } from '../../modules/getSavedSearch';
import { deleteSearch } from '../../modules/deleteSearch';
import { editSearch } from '../../modules/editSearch';
import * as Animatable from 'react-native-animatable';
import { useIsFocused } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const MyFavorites = ({ navigation }) => {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const [apiResponse, setApiResponse] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [address, setAddress] = useState('');
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [updatedParameters, setUpdatedParameters] = useState({});
  const flatListRef = useRef(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      Promise.all[
        getSavedApiCall()
      ]
    }

  }, [isFocused]);

  const getSavedApiCall = () => {
    dispatch(getSavedSearch()).then(response => {
      if (response.payload.data === 'Record not found!') {
        setShowNoDataMessage(true);
      } else {
        setImages(response.payload.data);
      }
    });
  };

  const deleteSearchApiCall = (userId, postId) => {
    let data = {
      userID: userId,
      postID: postId,
    };
    dispatch(deleteSearch(data)).then(response => {
      getSavedApiCall();
    });
  };

  const editSearchApiCall = (userId, postId, updatedParameter) => {
    let data = {
      userID: userId,
      searchid: postId,
      SearchParameters: updatedParameter,
    };
    dispatch(editSearch(data)).then(response => {
      getSavedApiCall();
    });
  };

  const handleChangeText = (itemId, parameterIndex, text) => {
    setUpdatedParameters(prevState => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        [parameterIndex]: text,
      },
    }));
  };

  const handleEditPress = item => {
    const parameters = item.search_parameters.split(',');
    const updatedParametersObj = {};
    parameters.forEach((parameter, index) => {
      updatedParametersObj[index] = parameter;
    });

    setEditingItemId(item.ID);
    setUpdatedParameters({
      ...updatedParameters,
      [item.ID]: updatedParametersObj,
    });
    Keyboard.dismiss();
  };

  const handleSavePress = item => {
    const updatedParameterArr = Object.values(updatedParameters[item.ID]);
    const updatedParameter = updatedParameterArr.join(',');

    setEditingItemId(null);
    editSearchApiCall(item.UserID, item.ID, updatedParameter);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getSavedApiCall();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => {
    const isEditing = item.ID === editingItemId;
    const parameters = item.search_parameters.split(',');

    return (
      <View style={styles.slideOuter}>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={{
            //height: 170, 
            width: '90%', alignSelf: 'center', marginTop: 3, marginBottom: 12
          }}>
            <View>

              {item.propertycity && (
                <Text
                  style={{ fontSize: 20, fontWeight: '500', color: Colors.textColorDark, fontFamily: 'Poppins-Regular' }}>
                  {item.propertycity}
                </Text>
              )}
            </View>
            <Text style={{ fontSize: 14, marginTop: 10, color: Colors.textColorLight, fontFamily: 'Poppins-Regular' }}>
              Parameters:
            </Text>

            {parameters.map((parameter, parameterIndex) => (
              <TextInput
                key={parameterIndex.toString()}
                value={updatedParameters[item.ID]?.[parameterIndex] ?? parameter}
                style={{
                  color: 'black',
                  height: isEditing ? 40 : 40, borderColor: isEditing ? Colors.white : Colors.BorderColor, borderWidth: 1, padding: 12, borderRadius: 7, verticalAlign: "top",
                  marginBottom: 12
                }}
                onChangeText={text => {
                  handleChangeText(item.ID, parameterIndex, text);
                }}
                editable={isEditing}
              />
            ))}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                // width: '60%',
                alignSelf: 'flex-end',
                alignItems: "center",
                //marginTop: 10,
                // backgroundColor: "red"
                marginHorizontal: 5
              }}>
              {isEditing ? (
                <TouchableOpacity
                  onPress={() => handleSavePress(item)}
                  style={{
                    height: 40,
                    borderRadius: 40,
                    width: 70,
                    backgroundColor: Colors.surfblur,
                    justifyContent: 'center',
                    alignItems: 'center', marginHorizontal: 5
                  }}>
                  <Text style={{ marginHorizontal: 5, fontSize: 16, fontWeight: '600', color: Colors.white, fontFamily: 'Poppins-Regular' }}>
                    Save
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleEditPress(item)}
                  style={{
                    height: 40,
                    borderRadius: 40,
                    width: 70,
                    backgroundColor: Colors.surfblur,
                    justifyContent: 'center',
                    alignItems: 'center', marginHorizontal: 5
                  }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.white, fontFamily: 'Poppins-Regular' }}>
                    Edit
                  </Text>
                  {/* <Image
                    style={{
                      width: 14,
                      height: 14,
                      resizeMode: "contain",
                      tintColor: Colors.white

                    }}
                    source={Images.Edit}
                  ></Image> */}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => deleteSearchApiCall(item.UserID, item.ID)}
                style={{
                  height: 40,
                  borderRadius: 40,
                  width: 40,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 14,
                    height: 14,
                    resizeMode: "contain",
                    tintColor: Colors.white

                  }}
                  source={Images.Trash}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={{ height: 1, width: '90%', backgroundColor: Colors.BorderColor }}></View> */}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,
          marginBottom: 4
        }}>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}>Saved Searches</Text>
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
              right: -12,
              top: -10,

              backgroundColor: Colors.surfblur,
              height: 25,
              width: 25,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <Animatable.Image
              source={Images.whiteclose}
              style={{
                height: 10,
                width: 10,
                resizeMode: 'contain',
                tintColor: Colors.white,
              }}
              animation="flipInY"
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0
        }}>


        <Text
          style={{
            fontSize: 20, color: Colors.black,
            fontFamily: 'Poppins-Regular',
          }}>
          Saved Searches
        </Text>

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
              right:-12,
              top: -6,

              backgroundColor: Colors.surfblur,
              height: 25,
              width: 25,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <Animatable.Image
              source={Images.whiteclose}
              style={{
                height: 10,
                width: 10,
                resizeMode: 'contain',
                tintColor: Colors.white,
              }}
              animation="flipInY"
            />
          </TouchableOpacity>
        </View>
      </View> */}
      {showNoDataMessage ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: Colors.textColorDark,
              fontFamily: 'Poppins-Regular',
            }}>
            No saved searches found!
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          data={images}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />
          }
        />
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    position: "relative"
  },
  slideOuter: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
    borderRadius: 18,
  },
  slide: {
    width: screenWidth - 40,
    height: screenHeight / 3,
    borderRadius: 18,
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'contain',
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
    fontFamily: 'Poppins-Regular',
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

export default MyFavorites;
