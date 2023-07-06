
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Button,Linking } from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import axios from 'axios';
import { getAgent } from '../../modules/getAgent';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
const ChatSearch = () => {
 
  const [message, setMessage] = useState('');
  const [chatData, setchatData] = useState([]);
  const [ans, setans] = useState([])
  const [agentData,setAgentData]=useState([])

  const myfubx = () => {
    

    let formData = new FormData();
    formData.append('userid', "3");
    formData.append('message', message);
   ;
    axios.post('https://surf.topsearchrealty.com/webapi/v1/chatgpt/', formData)
      .then(response => {
        console.log(Object.values(response.data.data));
        setchatData(response.data.data[0]);
        console.log(chatData, "chat data")
      })
      .catch(error => {
        console.log(error);
      });
    setMessage('');
  };
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(ans, "use??????????");
    getAgentApicall();
  }, [ans]);
  const getAgentApicall = () =>{
    dispatch(getAgent()).then(response =>{
      console.log('rrrohan',response.payload.data);
      setAgentData(response.payload.data);
      

    });
  }

  const makePhoneCall = () => {
    let phoneNumber = agentData[0]?.agent_phone
    Linking.openURL(`tel:${phoneNumber}`);
  };
  return (
    <View style={styles.container}>
      {/* Your other content */}
      <View style={styles.View}>
        <TouchableOpacity>
          <Image
            source={Images.chat}
            style={styles.image1}
          />
        </TouchableOpacity>
        <Text style={{ color: 'black', fontSize: 15,fontFamily:'Poppins-BoldItalic' }}>ChatGPT</Text>
        <TouchableOpacity onPress={()=>makePhoneCall()}>
          <Image
            source={Images.call}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.text}>{data.item.navigation}</Text> */}

      <ScrollView style={{ flex: 0.5, marginBottom: 90, paddingHorizontal: 7 }}>
        <Text style={{ color: 'black',fontFamily:'Poppins-Regular' }}>{chatData.question}</Text>
        <Text style={{ color: 'black',fontFamily:'Poppins-Regular' }}>{chatData.answere}</Text>

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
        <TouchableOpacity onPress={myfubx}>
          <Image
            style={styles.sent}
            source={Images.send} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
    // Set other styles for the container if needed
  },
  text: { marginTop: 10, fontSize: 16, color: 'black', paddingVertical: 20, fontWeight: 'bold' },
  btn: {
    fontSize: 14,
    backgroundColor: Colors.PrimaryColor,
    padding: 5,
    color: "#fff",
    borderRadius: 5
  },
  sent: {
    tintColor: Colors.PrimaryColor,
    height: 30,
    marginRight: 20,
    width: 35
  },
  viewstyle: {
    borderWidth: 2,
    borderRadius: 30,
    paddingStart: 20,
    width: "80%",

    margin: 10
  },
  View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    alignItems: "center",
    borderBottomColor: Colors.gray,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: 'row',
    right: 0,
    // Add any other styles for the button container if needed
  },
  image1: {
    height: 20,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.PrimaryColor,
    borderRadius: 10,
    borderWidth: 1,

    marginBottom: 10
  },
  image:
  {
    height: 20,
    width: 30,
    resizeMode: 'contain',
    tintColor: Colors.PrimaryColor,
    borderRadius: 10,
    borderWidth: 1,

  },
  Text: {
    color: "black",
    fontFamily:'Poppins-Regular'
  }

});

export default ChatSearch;