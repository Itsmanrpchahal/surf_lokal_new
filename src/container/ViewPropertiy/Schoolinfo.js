import { View,
    
    StyleSheet,
    Text,

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
    Linking,
    Share, } from 'react-native'
import React,{useState,useEffect} from 'react'
import { schoolChat } from '../../modules/schoolChat';
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";
import * as Animatable from 'react-native-animatable';

import { TypingAnimation } from 'react-native-typing-animation';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const Schoolinfo = () => {
    const dispatch = useDispatch();
    const [res, setRes] = useState([])
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false)
    useEffect(() => {

    }, [res])
    const navigation = useNavigation();
    const getCurrentDateTime = () => {
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const date = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const dateTimeString = `${year}-${month}-${date} ${hours}:${minutes}`;
      return dateTimeString;
    };
  
    return (
    
           <View style={{ height: '100%', width: '100%', justifyContent: 'center' }} >
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
        <View style={{ paddingHorizontal: 20, height: 600 }}>
   
          
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              borderBottomWidth: 1,
              borderColor: Colors.gray,
            }}>
            <Image source={Images.train} style={{ height: 30, width: 30 }} />
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: Colors.black }}>
              Powered by Cynthia®
            </Text>
            <TouchableOpacity
              onPress={() => {
                setRes([]);
                
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Image
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: 'contain',
                  tintColor: Colors.black,
                }}
                source={Images.reload}></Image>
            </TouchableOpacity>
          </View>
  
          <Text
            style={{
              fontSize: 16,
              borderRadius: 16,
              alignSelf: 'flex-start',
              maxWidth: '70%',
              marginLeft: 22,
              marginTop: 22,
              color: Colors.black,
            }}>
            I'm Cynthia. How can I help you?
          </Text>
  
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
            backgroundColor: item.type === 0 ? Colors.surfblur : Colors.white,
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
          <View style={{ bottom: 0, position: 'absolute', zIndex: 99, left: 0, right: 0, backgroundColor: Colors.white, }}>
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
                marginBottom: 50,
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
                  marginTop: 12,
                  backgroundColor: Colors.white, color: Colors.black
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
              justifyContent: 'space-between'
            }}>
              <TextInput
                style={{ width: '90%', backgroundColor: Colors.white, color: Colors.black }}
                placeholder="Type here"
                placeholderTextColor={Colors.black}
                value={message}
                onChangeText={setMessage}>
              </TextInput>
              <TouchableOpacity
            onPress={() => {
              setLoading(true);
              dispatch(schoolChat({ message: 'i want to know something about school' })).then((ress) => {
                setLoading(false);

                const newTodo1 = {
                  type: 0,
                  message: message,
                  date: getCurrentDateTime(),
                };
                const newTodo = {
                  type: 1,
                  message: ress.payload.data.text,
                  date: getCurrentDateTime(), 
                };
                setMessage('');
                setRes([...res, newTodo1, newTodo]);

              }).catch((e) => {
                alert('Error ==> ' + JSON.stringify(e))
              });
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
                tintColor: Colors.black,
              }}
              source={Images.sendm}
            ></Image>
          </TouchableOpacity>
            </View>

          </View>
        </View>
        </View>  
    )
}

export default Schoolinfo