import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Image

} from 'react-native';
import React from 'react'
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';


const Notification = () => {
  const navigation = useNavigation();
  
  return (
   <>
   <View
        style={styles.viewStyle}>
        <Text style={{ fontSize: 20, color: Colors.black }}>Notification</Text>
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
   </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  error: {
    color: 'red',
    paddingHorizontal: 22,
    marginTop: 2,
    fontSize: 12
  },
  inputStyle:{
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
  },
  btn:{
    height: 30,
    borderRadius: 8,
    width: 100,
    marginTop: 10,
    marginRight: '10%',
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  slideOuter: {
    // width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
    borderRadius: 18,
  },
  viewStyle:{
    flexDirection:'row',
    width: '90%',
    height: 60,
    justifyContent: 'space-around',
    alignSelf: 'center',
    alignItems: 'center',
  marginLeft:50
},
  view:{
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    alignItems: 'center',

    justifyContent: 'center',
  },
  slide: {
    // width: screenWidth - 40,
    // height: screenHeight / 3,
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

export default Notification