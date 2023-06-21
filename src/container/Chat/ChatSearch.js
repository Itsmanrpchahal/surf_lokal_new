
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Button } from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import axios from 'axios';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

const ChatSearch = (props) => {
  const data = props.route.params;
  const [message, setMessage] = useState('');
  const [chatData, setchatData] = useState([])
  const [ans, setans] = useState([])


  const myfubx = () => {
    let formData = new FormData();
    formData.append('userid', '3');
    formData.append('message', message);

    axios.post('https://surf.topsearchrealty.com/webapi/v1/chatgpt/', formData)
      .then(response => {
        console.log(Object.values(response.data.data));
        setchatData(response.data.data);
        const Ans = chatData.map((item) => item.answere)
        console.log('Ans:', Ans);
        setans(Ans);

        console.log(ans, "ans")
        console.log(chatData.map((item) => item.answere), "titfortat");
      })
      .catch(error => {
        console.log(error);
      });
    setMessage('');
  };
  useEffect(() => {
    console.log(ans, "use??????????");
  }, [ans]);


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
        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>ChatGPT</Text>
        <TouchableOpacity>
          <Image
            source={Images.call}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.text}>{data.item.navigation}</Text> */}


      <ScrollView style={{ flex: 0.5, marginBottom: 90, paddingHorizontal: 7 }}>
        <Text style={{ color: 'black' }}>{ans}</Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={styles.viewstyle}>

          <TextInput
            placeholder='Send a message'
            placeholderTextColor={Colors.textColorLight}
            onChangeText={setMessage}
            value={message}
          />
          <TouchableOpacity onPress={myfubx}>
            <Image
              style={styles.sent}
              source={Images.send} />
          </TouchableOpacity>
        </View>
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
    height: 25,
    width: 30
  },
  viewstyle: {
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 30,
    marginBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
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

  }

});

export default ChatSearch;