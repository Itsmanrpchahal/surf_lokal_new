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
  Keyboard
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

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const MyFavorites = ({navigation}) => {
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [updatedParameter, setUpdatedParameter] = useState('');
  const [editData, setEditData] = useState(null);
  const inputRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    getSavedApiCall();
  }, []);

  const getSavedApiCall = () => {
    dispatch(getSavedSearch()).then(response => {
      console.log('res', response.payload);
      setImages(response.payload.data);
    });
  };

  const deleteSearchApiCall = (userId, postId) => {
    let data = {
      userID: userId,
      postID: postId,
    };
    dispatch(deleteSearch(data)).then(response => {
      console.log('res', response.payload);
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
      console.log('res', response.payload);
      getSavedApiCall();
    });
  };

  const handleChangeText = (itemId, text) => {
    const updatedList = images.map(item => {
      if (item.ID === itemId) {
        setUpdatedParameter(text);
        return {
          ...item,
          search_parameters: text,
        };
      }
      return item;
    });
    setImages(updatedList);
  };
  const handleEditPress = (item) => {
    setEditing(true);
    setUpdatedParameter(item.search_parameters);
    inputRef.current.focus();
    Keyboard.dismiss();
  };

  const handleSavePress = (item) => {
    setEditing(false);
    editSearchApiCall(item.UserID, item.ID, updatedParameter);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slideOuter}>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={{  width: '90%', alignSelf: 'center', marginHorizontal: 10 ,marginVertical:10}}>
            {/* <Text style={{ fontSize: 20, color: Colors.textColorLight }}> City: </Text> */}
            <Text style={{ fontSize: 20, fontWeight: '500', color: Colors.textColorDark }}>{item.propertycity}</Text>
            <Text style={{ fontSize: 20, color: Colors.textColorLight }}> Parameters: </Text>
            <TextInput
              ref={inputRef}
              value={item.search_parameters}
              style={{ color: 'black' }}
              onChangeText={text => {
                handleChangeText(item.ID, text);
              }}
              editable={editing}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', alignSelf: 'flex-end', marginTop: 10 }}>
            {editing ? (
                <TouchableOpacity
                  onPress={() => handleSavePress(item)}
                  style={{
                    height: 30,
                    borderRadius: 8,
                    width: 80,
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.white }}> Save </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleEditPress(item)}
                  style={{
                    height: 30,
                    borderRadius: 8,
                    width: 80,
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.white }}> Edit </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => deleteSearchApiCall(item.UserID, item.ID)}
                style={{
                  height: 30,
                  borderRadius: 8,
                  width: 100,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.white }}> Delete </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 1, width: '100%', backgroundColor: Colors.BorderColor }}></View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    
    <View
        style={{
          marginTop:8,
          flexDirection: 'row',
          justifyContent: 'space-around',
          width:'90%',
          marginLeft:50
       
        }}>
        <Text style={{ fontSize: 20, color: Colors.black }}>Saved Searches</Text>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
            alignItems:'center',
      
            justifyContent:'center',
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: Colors.gray,
            }}>
            <Image
              source={Images.close}
              style={{
                height: 15,
                width: 15,
                resizeMode: 'contain',
                tintColor: Colors.black,
                transform: [{rotate: '90deg'}],
              }}></Image>
          </TouchableOpacity>
      </View>
      <View style={{ height: '100%', width: '100%', backgroundColor: Colors.white }}>
        <FlatList  ref={flatListRef}
        data={images}
         renderItem={renderItem} 
         keyExtractor={(item, index) => index.toString()}
         contentContainerStyle={{ paddingBottom: 20 }}
         ListFooterComponent={<View style={{ height: 60 }}></View>} />
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