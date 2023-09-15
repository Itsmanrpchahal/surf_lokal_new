import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import { Text, TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import Images from '../utils/Images';
import Colors from '../utils/Colors';
import Home from '../container/Home/Home';
import MyProfile from '../container/MyProfile/MyProfile';
import MyFavorites from '../container/MyFavorites/MyFavorites';
import SavedSearches from '../container/SavedSearches/SavedSearches';
import Conversations from '../container/Conversations/Conversations';
import ContactMyAgent from '../container/ContactMyAgent/ContactMyAgent';
import MakeAnOffer from '../container/MakeAnOffer/MakeAnOffer';
import MyRewards from '../container/MyRewards/MyRewards';
import RecycleBin from '../container/RecycleBin/RecycleBin';
import Settings from '../container/Settings/Settings';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import ChatSearch from '../container/Chat/ChatSearch';
import Notification from '../container/Notification/Notification';
import {store} from '../redux/store';
import {useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const BottomTabNavigator = () => {
  const isFocused = useIsFocused();
  const [data, setdata] = useState();
  const [tabshow, setTabshow] = useState(true)
  
  useEffect(() => {
    if(store?.getState()?.loginUserReducer?.loginData?.data?.user_role==="administrator"){
      // setTabshow(false)
      setTabshow(true)
     }
}, [])

  useEffect(() => {
    setdata(store.getState()?.getUserScore?.getUserScoreData?.data?.points);
  }, [store.getState()?.getUserScore?.getUserScoreData?.data]);

  
  return (
      <Tab.Navigator
        tabBarHideOnKeyboard={true}
        initialRouteName="Home"
        screenOptions={{headerShown: false, keyboardHidesTabBar: true}}
        tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="MyProfile"
          component={MyProfileTab}
          options={{
            tabBarLabel: (
              <Text style={styles.labelmenu} allowFontScaling={false}>
                Profile
                <View style={{position: 'relative'}}>
                  <View
                    style={styles.bedgecover}>
                    <Text
                      style={styles.bedgetext}>
                      2
                    </Text>
                  </View>
                </View>
              </Text>
            ),
            tabBarIcon: Images.newprofile,
            keyboardHidesTabBar: true,
            tabBarHideOnKeyboard: true,
          }}
        />
      {
      tabshow? <Tab.Screen
      name="Rewards"
      component={MyRewards}
      options={{
        tabBarLabel: (
          <View>
            <Text style={styles.rebatemenu} allowFontScaling={true}>
              {data ? '$' + data : '$' + 0}
            </Text>
            <Text
              style={[
                styles.labelmenu,
                {
                  color: isFocused ? Colors.textColorDark : null,
                },
              ]}
              allowFontScaling={false}>
              Rebate
            </Text>
          </View>
        ),
        keyboardHidesTabBar: true,
        tabBarHideOnKeyboard: true,
      }}
    />:null
    }
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: null,

            tabBarIcon: Images.homebig,

            keyboardHidesTabBar: true,
            tabBarHideOnKeyboard: true,
          }}
        />
        {
          tabshow?
          <Tab.Screen
          name="Favorites"
          component={MyFavorites}
          options={{
            tabBarLabel: (
              <Text
                style={styles.labelmenu}
                allowFontScaling={false}>
                Favorites
              </Text>
            ),
            tabBarIcon: Images.upthumb,
            keyboardHidesTabBar: true,
            tabBarHideOnKeyboard: true,
          }}
        />:null
        }
    

        <Tab.Screen
          name="ChatSearch"
          component={ChatSearch}
          options={{
            tabBarLabel: (
              <Text
                style={styles.labelmenu}
                allowFontScaling={false}>
                Chat
              </Text>
            ),
            tabBarIcon: Images.chatnew,
            keyboardHidesTabBar: true,
            tabBarHideOnKeyboard: true,
          }}
        />
      </Tab.Navigator>
  );
};
const MyProfileTab = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="MyFavorites" component={MyFavorites} />
      <Stack.Screen name="SavedSearches" component={SavedSearches} />
      <Stack.Screen name="Conversations" component={Conversations} />
      <Stack.Screen name="ContactMyAgent" component={ContactMyAgent} />
      <Stack.Screen name="MakeAnOffer" component={MakeAnOffer} />
      <Stack.Screen name="MyRewards" component={MyRewards} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="RecycleBinTab" component={RecycleBin} />
    </Stack.Navigator>
  );
};

function CustomTabBar({state, descriptors, navigation}) {
  return (
    <View
      style={{
        width: '100%',
        height: '10%',
        justifyContent:"space-between",
        // marginBottom: 8,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          alignContent: 'center',
          backgroundColor: '#F2F2F2',
          ...ifIphoneX(
            {
              marginBottom: 15,
            },
            {
              marginBottom: 5,
            },
          ),
        }}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const image =
            options.tabBarIcon !== undefined ? options.tabBarIcon : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({name: route.name, merge: true});
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          const getIconStyle = () => {
            if (route.name === 'Home') {
              return {
                height: 62,
                width: 62,
                marginTop: 20,
              };
            }
            return {
              height: 50,
              marginTop: 15,
              width: 30,
              marginBottom:10,
              tintColor: isFocused ? Colors.primaryBlue : Colors.textColorDark,
            };
          };
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.bgbottom}>
              <View
                style={{
                  height: 50,
                  width: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={image}
                  resizeMode="contain"
                  style={getIconStyle()}
                />
              </View>
              <Text
                style={{
                  color: isFocused ? Colors.primaryBlue : Colors.textColorDark,
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  marginBottom: 8,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  labelmenu: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
    fontFamily: 'Poppins-Regular',
  },
  rebatemenu: {
    fontFamily: 'Poppins-Bold',
    position: 'absolute',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
    top: -31,
    color: Colors.black,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  bgbottom:{
    backgroundColor: '#F2F2F2',
    width: '20%',
    maxHeight: 100,

    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: -15,
    marginTop: 1,
  },
  bedgetext:{
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    borderRadius: 100,
  },
  bedgecover:{
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 100,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    top: 50, 
    marginLeft: 0,
  },

});
export default BottomTabNavigator;
