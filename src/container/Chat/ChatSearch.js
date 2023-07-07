import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Button, Linking } from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import axios from 'axios';
import { getAgent } from '../../modules/getAgent';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { chatGpt } from '../../modules/chatGpt';
import { store } from '../../redux/store';

const ChatSearch = () => {
  const [message, setMessage] = useState('');
  const [chatData, setChatData] = useState([]);
  const [ans, setAns] = useState('');
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const myfubx = async (message) => {
    const userID = await AsyncStorage.getItem('userId');
  
    let payload = {
      userid: userID,
      message: message,
    };
    console.log('chatgtp message payload', payload);
  
    setLoading(true); // Set loading to true before making the API call
  
    await dispatch(chatGpt(payload))
      .then((response) => {
        if (response && response.data && response.data.data && response.data.data.length > 0) {
          const answer = response.data.data[0].answere;
          setAns(answer);
          setChatData((prevChatData) => [...prevChatData, answer]);
        } else {
          // console.error('API response is missing data');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the API call completes
      });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(ans, 'use??????????');
    getAgentApicall();
  }, [ans]);

  const getAgentApicall = () => {
    dispatch(getAgent()).then((response) => {
      // console.log('rrrohan',response.payload.data);
      setAgentData(response.payload.data);
    });
  };

  useEffect(() => {
    console.log('message', message);
  }, [ans]);

  const makePhoneCall = () => {
    let phoneNumber = agentData[0]?.agent_phone;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.View}>
        <TouchableOpacity>
          <Image source={Images.chat} style={styles.image1} />
        </TouchableOpacity>
        <Text style={{ color: 'black', fontSize: 15, fontFamily: 'Poppins-BoldItalic' }}>ChatGPT</Text>
        <TouchableOpacity onPress={() => makePhoneCall()}>
          <Image source={Images.call} style={styles.image} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 0.5, marginBottom: 90, paddingHorizontal: 7 }}>
        <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>
          {"Q. "}{store.getState().chatGpt.chatGptData?.data && JSON.stringify(store.getState().chatGpt.chatGptData?.data[0]?.question)}
        </Text>
        <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>
          {"Ans:-"}{store.getState().chatGpt.chatGptData?.data && JSON.stringify(store.getState().chatGpt.chatGptData?.data[0]?.answere)}
        </Text>

        {chatData.map((item, index) => (
          <Text key={index} style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>
            {item}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.viewstyle}>
          <TextInput
            style={styles.Text}
            placeholder='Send a message'
            placeholderTextColor={Colors.black}
            onChangeText={setMessage}
            value={message}
          />
        </View>

        <TouchableOpacity onPress={() => {
          setMessage('');
          myfubx(message);
        }}>
          {loading ? (
            <Image style={styles.loadingIndicator} source={Images.loading} />
          ) : (
            <Image style={styles.sent} source={Images.send} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    alignItems: 'center',
    borderBottomColor: Colors.gray,
  },
  image1: {
    height: 20,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.PrimaryColor,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  image: {
    height: 20,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.PrimaryColor,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    right: 0,
  },
  viewstyle: {
    borderWidth: 2,
    borderRadius: 30,
    paddingStart: 20,
    width: '80%',
    margin: 10,
  },
  Text: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  loadingIndicator: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.PrimaryColor,
  },
  sent: {
    tintColor: Colors.PrimaryColor,
    height: 30,
    marginRight: 20,
    width: 35,
  },
});

export default ChatSearch;
