import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Switch, FlatList } from 'react-native';
import axios from 'axios';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';

const Notification = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [toggle, setToggle] = useState(false);
  const flatListRef = useRef(null);
  const datan = [
    {
      name: 'Jessica Kent',
      description: 'Called about 221 Main St.',
      date: '07/21/2023'
    },
    {
      name: 'Jessica Kent',
      description: 'Called about 221 Main St.',
      date: '07/21/2023'
    },
  ];

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    setToggle(!isEnabled);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const id = await AsyncStorage.getItem('userId');
    try {
      const response = await axios.get('http://www.surflokal.com/webapi/v1/notifications/?userID=' + id);
      const responseData = response.data;
      const nestedData = responseData.data[0];
      setData(nestedData);

    } catch (error) {
    }
  };

  const renderItem = ({ item, index }) => {
    if (isEnabled) {
      return null;
    }
    return (
      <View style={styles.slideOuter}>
        <Image
          source={{ uri: item.featured_image_url }}
          style={{ height: 100, width: 90, resizeMode: 'contain', borderRadius: 4, marginRight: 8 }}
        />
        <View style={{ flex: 1, flexDirection: 'column', width: '100%', alignItems: 'flex-start', paddingVertical: 8 }}>


          <Text style={{ marginRight: 8, width: "100%", fontSize: 14, color: Colors.black, fontFamily: "Poppins-Medium", }}>{item.post_title}</Text>
          <Text numberOfLines={2} style={{ width: "100%", fontSize: 13, color: Colors.textColorLight, fontFamily: "Poppins-Regular", }}>
            {item.post_content}
          </Text>

          <Text style={{ width: "100%", fontSize: 11, color: Colors.textColorLight, fontFamily: "Poppins-Light", alignItems: "flex-end", justifyContent: "flex-end", textAlign: "right", marginTop: 2 }}>
            {item.post_date}
          </Text>
        </View>


      </View>
    );
  };
  return (
    <View style={styles.container}>

      <View
        style={{

          flexDirection: 'row',
          width: '100%',

          paddingHorizontal: 12,
          backgroundColor: Colors.white,
          paddingVertical: 7,
          justifyContent: "space-between",
          alignItems: "center",

        }}>
        <View
          style={{
            width: "100%",
            position: "absolute",
            right: 0
          }}>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <Animatable.Image
              source={Images.toggle}
              style={{
                height: 25,
                width: 25,
                resizeMode: 'contain',
                tintColor: Colors.black,
              }}

            />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium', width: "100%", textAlign: "center" }}>Notifications</Text>
        {/* <View
          style={{

            justifyContent: 'flex-end',
            alignItems: 'flex-end',

          }}>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <Animatable.Image
              source={Images.surfplan}
              style={{
                height: 35,
                width: 35,
                resizeMode: 'contain',
                tintColor: Colors.surfblur,
              }}

            />
          </TouchableOpacity>
        </View> */}
        <View
          style={{
            width: '100%',
            zIndex: 99,
            position: 'absolute',
            top: 10,
            right: 10,
            justifyContent: "flex-end",
            alignItems: "flex-end"

          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              backgroundColor: Colors.surfblur,
              height: 25,
              width: 25,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate('Home')}
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

      {/* 
<View style={{width:"100%",paddingHorizontal:12,flexDirection:"row",justifyContent:"space-between",paddingVertical:12}}>
<Text style={{fontSize:14,color:Colors.black,fontFamily:"Poppins-Medium",flexBasis:"10%"}}>Type</Text>
<Text style={{fontSize:14,color:Colors.black,fontFamily:"Poppins-Medium",flexBasis:"20%"}}>From</Text>
<Text style={{fontSize:14,color:Colors.black,fontFamily:"Poppins-Medium",flexBasis:"30%"}}>Summary</Text>
<Text style={{fontSize:14,color:Colors.black,fontFamily:"Poppins-Medium",flexBasis:"20%"}}>Date</Text>
</View>


      <FlatList
      data={datan}
      // renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
      
          <View style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.BorderColor, width: '100%', paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, alignItems: 'flex-start' }}>
            <Image source={Images.greenphone} style={{ height: 35, width: 35, resizeMode: 'contain', flexBasis: '10%' }} />
            <Text style={{ fontSize: 13, color: Colors.black, fontFamily: 'Poppins-Medium', flexBasis: '20%' }}>{item.name}</Text>
            <Text style={{ fontSize: 13, color: Colors.black, fontFamily: 'Poppins-Medium', flexBasis: '30%' }}>{item.description}</Text>
            <Text style={{ fontSize: 13, color: Colors.black, fontFamily: 'Poppins-Medium', flexBasis: '20%' }}>{item.date}</Text>
          </View>
        )}
    
    />  */}




      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          alignSelf: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 12
        }}
      >
        <Text style={{ fontSize: 16, color: Colors.black, fontFamily: 'Poppins-Medium', marginLeft: 12 }}>
          Allow Notification
        </Text>
        <View style={{ marginTop: -4 }}>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 10 }}>
        <FlatList data={data} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
      </View>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  viewStyle: {
    //  flexDirection: 'row',
    //  height: 50,
    //  width: '100%',
    //  justifyContent: 'space-between',
    //   alignItems: 'center',
    //  paddingHorizontal: 15,
    // backgroundColor: Colors.white,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginLeft: 0
  },
  slideOuter: {
    paddingVertical: 9,
    paddingHorizontal: 9,
    width: '95%',
    height: 110,
    flex: 1,
    flexDirection: "row",
    alignSelf: 'center',
    alignItems: "center",
    borderRadius: 4,
    paddingLeft: 4,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,

  },
});

export default Notification;
