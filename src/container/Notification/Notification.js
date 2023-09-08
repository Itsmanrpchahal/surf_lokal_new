import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Switch,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import { store } from '../../redux/store';
const Notification = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [toggle, setToggle] = useState(false);


  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setToggle(!isEnabled);
  };

  useEffect(() => {
    const nestedData =store.getState().getNotifications.getNotificationsData.data
    setData(nestedData[0])
  }, []);


  const renderItem = ({item, index}) => {
    if (!isEnabled) {
      return null;
    }
    return (
      <View style={styles.slideOuter}>
     
        <Image
          source={{uri: item.featured_image_url}}
          style={styles.featuresimage}
        />
        <View style={styles.titlecover}>
          <TouchableOpacity 
          onPress={()=> navigation.navigate('ViewPropertiy',{ID:item.post_id})}>
          <Text numberOfLines={1} style={styles.posttitle}>
            {item.post_title}
          </Text>
          <Text numberOfLines={2} style={styles.postcontent}>
            {item.post_content}
          </Text>

          <Text style={styles.postdate}>{item.post_date}</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headermain}>
        <TouchableOpacity
          style={styles.leftarrow}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.leftarrowimage}
            source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centercover}>
          <Text style={styles.centertext}>Notifications</Text>
        </View>
        <TouchableOpacity
          style={styles.rightmenu}
          onPress={() => navigation.goBack()}>
          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.headerinner}>
          <Text
            style={styles.headercover}>
            You Have <Text style={styles.Notificationcount}>2</Text> New
            Notifications
          </Text>
          <View
            style={styles.mt10}>
            <Switch
              trackColor={{false: '#767577', true: '#11b03e'}}
              thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <View style={styles.notificationdetail}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 5,
  },
  viewStyle: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginLeft: 0,
  },
  notificationdetail: {flex: 1, marginTop: 10},
  slideOuter: {
    paddingVertical: 9,
    paddingHorizontal: 9,
    width: '95%',
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 110 : 110,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingLeft: 4,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,

    resizeMode: 'contain',
  },
  featuresimage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 100 : 100,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 120 : 90,
    resizeMode: 'contain',
    borderRadius: 4,
    marginRight: 8,
  },
  titlecover: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  posttitle: {
    marginRight: 8,
    width: '100%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 14,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  postcontent: {
    width: '100%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 13,
    color: Colors.textColorLight,
    fontFamily: 'Poppins-Regular',
  },
  postdate: {
    width: '100%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 14 : 11,
    color: Colors.textColorLight,
    fontFamily: 'Poppins-Light',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginTop: 0,
    position: 'relative',
    top: DeviceInfo.getDeviceType() === 'Tablet' ? 0 : 6,
  },
  headermain: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
    marginBottom: 12,
  },
  leftarrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  leftarrowimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  centercover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centertext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  rightmenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  headerinner: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 0,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
  },
  Notificationcount: {color: 'red', fontFamily: 'Poppins-SemiBold'},
  headercover:{
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
    marginLeft: 12,
  },
  mt10:{
    marginTop: DeviceInfo.getDeviceType() === 'Tablet' ? 10 : -4,
  }
});

export default Notification;
