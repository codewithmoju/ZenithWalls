import { StyleSheet, View, Platform } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../ProjectScreens/SplashScreen';
import WelcomeScreen from '../ProjectScreens/WelcomeScreen';
import Home from '../ProjectScreens/Home';
import PreviewScreen from '../ProjectScreens/PreviewScreen';
import FavoritesScreen from '../ProjectScreens/FavoritesScreen';
import ProfileScreen from '../ProjectScreens/ProfileScreen';
import EditProfileScreen from '../ProjectScreens/EditProfileScreen';
import SettingsScreen from '../ProjectScreens/SettingsScreen';
import DownloadsScreen from '../ProjectScreens/DownloadsScreen';
import PrivacyPolicyScreen from '../ProjectScreens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../ProjectScreens/TermsOfServiceScreen';
import AboutScreen from '../ProjectScreens/AboutScreen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/themes';
import { FavoritesProvider } from '../../constants/FavoritesContext';
import { ProfileProvider } from '../../constants/ProfileContext';
import { DownloadsProvider } from '../../constants/DownloadsContext';
import { BlurView } from 'expo-blur';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const BOTTOM_TAB_HEIGHT = 70;

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint="dark"
            style={[StyleSheet.absoluteFill, styles.tabBarBackground]}
          />
        ),
        tabBarStyle: [styles.tabBar],
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Appnavigation = () => {
  return (
    <ProfileProvider>
      <FavoritesProvider>
        <DownloadsProvider>
          <BottomSheetModalProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='Welcome'>
              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="Preview" component={PreviewScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Downloads" component={DownloadsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
              <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ headerShown: false }} />
              <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
          </BottomSheetModalProvider>
        </DownloadsProvider>
      </FavoritesProvider>
    </ProfileProvider>
  )
}

export default Appnavigation

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_TAB_HEIGHT,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 10,
  },
  // tabBarBackground: {
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   backgroundColor: 'rgba(30, 27, 75, 0.95)',
  //   borderTopWidth: 1,
  //   borderTopColor: 'rgba(255, 255, 255, 0.1)',
  //   ...theme.shadows.luxury,
  // },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Platform.OS === 'ios' ? 0 : 5,
  },
  tabBarItem: {
    paddingTop: 10,
  },
});