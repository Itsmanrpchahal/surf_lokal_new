import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, SafeAreaView, StyleSheet } from 'react-native'
import Colors from "../../utils/Colors";
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { chat } from "../../modules/chat";
import { TypingAnimation } from 'react-native-typing-animation';
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";
import Images from "../../utils/Images";
import { sendMessage } from '../../modules/send_message'

const ChatSearch = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [message, setMessage] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.initialMessage && route.params?.agentReply) {
      const initialMessage = route.params.initialMessage;
      const agentReply = route.params.agentReply;
      setRes([
        { type: 1, message: initialMessage },
        { type: 1, message: agentReply },
      ]);
    }
  }, [route.params?.initialMessage, route.params?.agentReply]);
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    const dateTimeString = `${month}/${date}/${year}    ${hours}:${minutes} ${ampm}`;
    return dateTimeString;
  };
  return (
    <SafeAreaView>
      <View style={{ height: "100%", position: 'relative', paddingBottom: 100, backgroundColor: 'white' }}>
        <View style={{ paddingVertical: 10, paddingHorizontal: 12, backgroundColor: Colors.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#c9c9c5' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                height: 40,
                width: 40,
                resizeMode: "contain",
                borderRadius: 50,
                // marginLeft: 2
                // tintColor: Colors.surfblur,
                marginRight: 5,
                borderColor: Colors.surfblur,
                borderWidth: 1,

              }}
              source={Images.user}
            ></Image>

            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', color: Colors.black }}> Powered by Cynthia</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginRight: 0 }}>
            <TouchableOpacity
              onPress={() => { setRes([]) }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 5,
              }}
            >
              <Image
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: "contain",
                  tintColor: Colors.black,
                }}
                source={Images.reload}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { props.route?.params?.from === 'detail' ? navigation.goBack() : navigation.navigate('Home') }}
              style={{

                height: 35,
                width: 35,
                borderRadius: 100,
                // backgroundColor: Colors.surfblur,
                alignItems: "center",


              }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  top: 7,
                  resizeMode: "contain",
                  borderRadius: 50,
                  marginLeft: 2,
                  tintColor: Colors.black,

                }}
                source={Images.close}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{
          marginLeft: 15,
          marginRight: 13, fontSize: 16, borderRadius: 16, alignSelf: 'flex-start', maxWidth: '100%', marginTop: 22, color: Colors.black, fontFamily: "Poppins-Medium",
        }}>Hi I'm Cynthia. What can I help you with today ?</Text>


        <AutoScrollFlatList
          nestedScrollEnabled={true}
          data={res}
          threshold={20}
          renderItem={({ item, index }) => {
            return (
              <View>
                <Text
                  style={{
                    padding: 8,
                    fontSize: 16,
                    borderRadius: 16,
                    backgroundColor: item.type === 0 ? Colors.surfblur : '#D3D3D3',
                    alignSelf: item.type === 0 ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    marginLeft: 8,
                    marginRight: 8,
                    marginTop: 8,
                    marginBottom: 4,
                    color: item.type === 0 ? Colors.white : Colors.black,
                  }}>
                  {item.message}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginLeft: item.type === 0 ? 8 : 16,
                    marginRight: item.type === 0 ? 16 : 8,
                    marginBottom: 8,
                    alignSelf: item.type === 0 ? 'flex-end' : 'flex-start',
                    color: Colors.gray,
                  }}>
                  {item.date}
                </Text>
              </View>
            );
          }}
        />



        <View style={{ bottom: 0, position: 'absolute', zIndex: 99, left: 0, right: 0, backgroundColor: Colors.white }}>
          {
            loading && <Text style={{
              padding: 16,
              fontSize: 16,
              borderRadius: 16,
              backgroundColor: Colors.surfblur,
              alignSelf: 'flex-end',
              maxWidth: '70%',
              marginLeft: 8,
              marginRight: 8,
              marginTop: 8,
              color: Colors.white
            }}>{message}</Text>
          }

          {
            loading && <View style={{ flexDirection: 'row' }}>
              <Text style={{
                fontSize: 12,
                borderRadius: 16,
                alignSelf: 'flex-start',
                maxWidth: '70%',
                marginLeft: 16,
                marginTop: 6,
                color: Colors.black,
                backgroundColor: Colors.white
              }}>typing</Text>
              <TypingAnimation
                dotColor="black"
                dotMargin={3}
                dotAmplitude={2}
                dotSpeed={0.15}
                dotRadius={1}
                dotX={8}
                dotY={0}
                style={{ marginTop: 25, marginLeft: -3 }}
              />
            </View>
          }

          <View style={{
            backgroundColor: Colors.white,
            borderColor: Colors.BorderColor,
            borderWidth: 1, borderRadius: 5,
            height: 45, margin: 16,
            paddingLeft: 8, paddingRight: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8
          }}>
            <TextInput
              style={{ width: '90%', backgroundColor: Colors.white, color: Colors.black }}
              placeholder="Type here ....."
              placeholderTextColor={Colors.textColorLight}
              fontFamily="Poppins-Regular"
              value={message}
              onChangeText={setMessage}>
            </TextInput>
            <TouchableOpacity
              disabled={message === '' && true}
              onPress={() => {
                setLoading(true)
                dispatch(chat({ message: message })).then((ress) => {
                  setLoading(false)

                  const newTodo1 = {

                    type: 0,
                    message: message,
                    date: getCurrentDateTime(),
                  }
                  const newTodo = {
                    type: 1,
                    message: ress.payload.data.text,
                    date: getCurrentDateTime(),
                  };
                  setMessage('')

                  setRes([...res, newTodo1, newTodo])

                }).catch((e) => {
                  alert('Error ==> ' + JSON.stringify(e))
                })
              }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: "contain",
                  tintColor: Colors.primaryBlue,
                }}
                source={Images.sendm}
              ></Image>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default ChatSearch;
const styles = StyleSheet.create({
  imagedata: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '90deg' }],
  },
});