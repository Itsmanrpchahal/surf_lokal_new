import {  SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity } from 'react-native'
import React ,{useState} from 'react'
import Colors from '../../utils/Colors';
import { useNavigation } from '@react-navigation/native';
import Images from '../../utils/Images';
import * as Animatable from 'react-native-animatable';
const Challenges = () => {
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const navigation = useNavigation();


    const handleImagePress = () => {
      
        setIsImageChanged(true);
    
        // Reset the image after 2 seconds
        setTimeout(() => {
          setIsImageChanged(false);
        }, 1500);
      };
    
      const handleFavPress = () => {
  
    
        setIsImage(true)
    
        // Reset the image after 2 seconds
        setTimeout(() => {
          setIsImage(false)
        }, 1500);
      };
    
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
    <View
        style={{
          marginTop: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,

          // marginBottom: 4
        }}>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}></Text>
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
       <View style={{justifyContent:'center',alignContent:'center',alignItems:'center',color:Colors.black,height:"100%",paddingBottom:30}}>
       <Text style={{ fontSize:20, color: Colors.black, fontFamily: 'Poppins-Medium' ,color:Colors.black}}>Challenges</Text>
        <Text style={{fontSize:16,fontWeight:'500',marginTop:20, color:Colors.black, fontFamily: 'Poppins-Regular' }}>Q. DO you need health insurance? (1)</Text>
      
       <View style={{flexDirection:"row",justifyContent:'space-evenly',alignItems:'center',alignContent:'center',paddingHorizontal:130}} >
       <TouchableOpacity onPress={handleImagePress}
              activeOpacity={0.8}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
                  <Image
                    source={isImageChanged ? Images.redlike : Images.deletethumb}
                    style={{ height: 50, width: 50, resizeMode: 'contain' }} />
                </TouchableOpacity>
          <TouchableOpacity onPress={handleFavPress}
              activeOpacity={0.8}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={styles.viewstyle}>
                <Image
                  source={isImage ? Images.upgreen : Images.upthumb}
                  style={{ height: 50, width: 50, resizeMode: 'contain' }} />
           
              </View>
            </TouchableOpacity>
       </View>
       </View>
        </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    viewstyle: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 18,
      // height: 60,
      alignItems: 'center',
      paddingVertical: 18
    },
    line: {
      height: 1,
      width: '90%',
      backgroundColor: Colors.BorderColor,
      // marginHorizontal: 50
    },
    text: {
      fontSize: 14,
      color: Colors.black,
      marginLeft: 8,
      fontFamily: 'Poppins-Regular'
    },
    slideOuter: {
      width: "100%",
  
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.white,
      borderRadius: 18,
    },
    // slide: {
    //   width: screenWidth - 40,
    //   height: screenHeight / 3,
    //   borderRadius: 18,
    //   margin: 20,
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    //   resizeMode: 'contain',
    //   flexDirection: 'row',
    // },
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
      fontFamily: 'Poppins-Regular'
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
export default Challenges