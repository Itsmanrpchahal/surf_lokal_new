import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Images from '../utils/Images';
import Fonts from '../utils/Fonts';
import Colors from '../utils/Colors';
import Rewards from '../container/Rewards/Rewards';
import Favorites from '../container/Favorites/Favorites';
import Home from '../container/Home/Home';
//import HomeNew from '../container/Home/HomeNew';
import MyProfile from '../container/MyProfile/MyProfile';
import MyFavorites from '../container/MyFavorites/MyFavorites';
import SavedSearches from '../container/SavedSearches/SavedSearches';
import Conversations from '../container/Conversations/Conversations';
import ContactMyAgent from '../container/ContactMyAgent/ContactMyAgent';
import MakeAnOffer from '../container/MakeAnOffer/MakeAnOffer';
import MyRewards from '../container/MyRewards/MyRewards';
import RecycleBin from '../container/RecycleBin/RecycleBin';
import Settings from '../container/Settings/Settings';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import ChatSearch from '../container/Chat/ChatSearch';
import Notification from '../container/Notification/Notification';
import Styles from '../container/Rewards/Styles';
import { useIsFocused } from '@react-navigation/native';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRatio = screenHeight / 1000;

const BottomTabNavigator = () => {
  const isFocused = useIsFocused();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, keyboardHidesTabBar: true }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="MyProfile"
        component={MyProfileTab}
        options={{
          tabBarLabel: (
            <Text style={{ fontSize: 10, fontFamily: 'Poppins-Regular' }} allowFontScaling={false}>
              Profile
            </Text>
          ),
          tabBarIcon: Images.profile,
          keyboardHidesTabBar: true,
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={MyRewards}
        options={{


          tabBarLabel: (

            <View >

              <Text style={{
                fontFamily: 'Poppins-Regular',
                position: "absolute",
                fontSize: 32, top: -50,
                color: Colors.black,


              }}
                allowFontScaling={false}> 0</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Poppins-Regular', color: isFocused ? Colors.textColorDark : null }} allowFontScaling={false}>
                Rewards
              </Text>
            </View>
          ),

          keyboardHidesTabBar: true,
          tabBarHideOnKeyboard: true,
        }}

      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: null,

          tabBarIcon: Images.lokal,

          keyboardHidesTabBar: true,
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={MyFavorites}
        options={{
          tabBarLabel: (
            <Text style={{ fontSize: 10, fontFamily: 'Poppins-Regular' }} allowFontScaling={false}>
              Favorites
            </Text>
          ),
          tabBarIcon: Images.upthumb,
          keyboardHidesTabBar: true,
          tabBarHideOnKeyboard: true,
        }}
      />

      <Tab.Screen
        name="ChatSearch"
        component={ChatSearch}
        options={{
          tabBarLabel: (
            <Text style={{ fontSize: 10, fontFamily: 'Poppins-Regular' }} allowFontScaling={false}>
              Chat
            </Text>
          ),
          tabBarIcon: Images.chat,
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

      <Stack.Screen name="RecycleBin" component={RecycleBin} />
    </Stack.Navigator>
  );
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        width: '100%',
        // height:50,
        height: "9%",
        backgroundColor: Colors.white,
        justifyContent: 'center',
        borderTopColor: Colors.gray,
        borderTopWidth: 1,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 8,
        paddingTop: 10
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          alignContent: 'center',
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
          const { options } = descriptors[route.key];
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
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
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
                height: 55,
                width: 45,
                marginTop:10,

                tintColor: isFocused ? Colors.primaryBlue : Colors.textColorDark,

              };
            }
            return {
              height: 25,
              width: 25,
              tintColor: isFocused ? Colors.primaryBlue : Colors.textColorDark,
            };
          };
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                width: "30%",
                maxHeight: 100,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                marginVertical: -10,
                marginTop: 1
              }}>
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
                  fontSize: 12, fontFamily: 'Poppins-Regular',
                  marginBottom:8
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
export default BottomTabNavigator;
