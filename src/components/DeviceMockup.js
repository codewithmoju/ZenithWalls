import React from 'react';
import { View, Image, Text, Dimensions, Platform, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/themes';
import { hp, wp } from '../helpers/common';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DeviceMockup = ({ 
  wallpaperUrl, 
  previewMode = 'device', 
  deviceType = 'modern', 
  showTime = true,
  style = {},
  interactive = true 
}) => {
  // Make device much larger - using most of the screen
  const DEVICE_SCALE = Platform.OS === 'ios' ? 1.2 : 1.1;
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [cachedImageUri, setCachedImageUri] = React.useState(wallpaperUrl);

  // Pre-cache the image for faster loading
  React.useEffect(() => {
    const cacheImage = async () => {
      try {
        // Start loading immediately
        setImageLoaded(false);
        setCachedImageUri(wallpaperUrl);
      } catch (error) {
        console.log('Image caching error:', error);
        setCachedImageUri(wallpaperUrl);
      }
    };
    
    if (wallpaperUrl) {
      cacheImage();
    }
  }, [wallpaperUrl]);
  
  const renderStatusBar = () => (
    <View style={styles.statusBar}>
      <Text style={styles.timeText}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <View style={styles.statusIcons}>
        <MaterialIcons name="signal-cellular-4-bar" size={16} color="white" />
        <MaterialIcons name="wifi" size={16} color="white" />
        <Text style={styles.batteryText}>100%</Text>
      </View>
    </View>
  );

  const renderHomeScreen = () => (
    <View style={styles.homeScreenOverlay}>
      {/* Time Widget */}
      <View style={styles.homeTimeWidget}>
        <Text style={styles.homeTimeText}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.homeDateText}>
          {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        </Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="rgba(255, 255, 255, 0.7)" />
        <Text style={styles.searchText}>Search</Text>
      </View>
      
      {/* App Icons Grid */}
      <View style={styles.appGrid}>
        {Array.from({ length: 20 }).map((_, index) => (
          <View key={index} style={styles.appIcon}>
            <View style={[styles.appIconGradient, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
              <MaterialIcons 
                name={getAppIcon(index)} 
                size={Platform.OS === 'ios' ? 22 : 20} 
                color="white" 
              />
            </View>
            <Text style={styles.appLabel} numberOfLines={1}>
              {getAppName(index)}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Enhanced Dock */}
      <View style={styles.dock}>
        {['phone', 'message', 'camera', 'music-note'].map((icon, index) => (
          <View key={index} style={styles.dockIcon}>
            <View style={[styles.dockIconGradient, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <MaterialIcons name={icon} size={Platform.OS === 'ios' ? 30 : 28} color="white" />
            </View>
          </View>
        ))}
      </View>
      
      {/* Page Indicator */}
      <View style={styles.pageIndicator}>
        {[0, 1, 2].map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.pageIndicatorDot, 
              index === 1 && styles.activePageDot
            ]} 
          />
        ))}
      </View>
    </View>
  );

  const renderLockScreen = () => (
    <View style={styles.lockScreenOverlay}>
      {/* Lock Screen Time */}
      <View style={styles.lockScreenTime}>
        <Text style={styles.lockTimeHour}>
          {new Date().toLocaleTimeString([], { hour: '2-digit' })}
        </Text>
        <Text style={styles.lockTimeMinute}>
          {new Date().toLocaleTimeString([], { minute: '2-digit' })}
        </Text>
        <Text style={styles.lockDate}>
          {new Date().toLocaleDateString([], { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      
      {/* Notifications */}
      <View style={styles.notificationsArea}>
        <View style={styles.notification}>
          <View style={styles.notificationIcon}>
            <MaterialIcons name="message" size={16} color={theme.colors.primary} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Messages</Text>
            <Text style={styles.notificationText}>Hey! Check out this wallpaper</Text>
          </View>
        </View>
        
        <View style={styles.notification}>
          <View style={styles.notificationIcon}>
            <MaterialIcons name="photo" size={16} color={theme.colors.accent} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>ZenithWalls</Text>
            <Text style={styles.notificationText}>New wallpapers available!</Text>
          </View>
        </View>
      </View>
      
      {/* Lock Screen Controls */}
      <View style={styles.lockControls}>
        <Pressable style={styles.lockControlItem}>
          <MaterialIcons name="flashlight-on" size={24} color="white" />
        </Pressable>
        <View style={styles.lockSlider}>
          <Text style={styles.lockSliderText}>Slide to unlock</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="rgba(255, 255, 255, 0.7)" />
        </View>
        <Pressable style={styles.lockControlItem}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
        </Pressable>
      </View>
      
      {/* Home Indicator */}
      <View style={styles.lockHomeIndicator} />
    </View>
  );

  const getAppIcon = (index) => {
    const icons = [
      'phone', 'message', 'camera', 'music-note',
      'photo', 'map', 'weather', 'calculator',
      'settings', 'calendar', 'clock', 'contacts',
      'mail', 'games', 'shopping-cart', 'sports',
      'video-library', 'library-books', 'flight', 'restaurant'
    ];
    return icons[index % icons.length];
  };

  const getAppName = (index) => {
    const names = [
      'Phone', 'Messages', 'Camera', 'Music',
      'Photos', 'Maps', 'Weather', 'Calculator',
      'Settings', 'Calendar', 'Clock', 'Contacts',
      'Mail', 'Games', 'Store', 'Sports',
      'Videos', 'Books', 'Travel', 'Food'
    ];
    return names[index % names.length];
  };

  const getAppGradient = (index) => {
    const gradients = [
      theme.colors.gradientRoyal,
      theme.colors.gradientRose,
      theme.colors.gradientOcean,
      theme.colors.gradientSunset,
      theme.colors.gradientAurora,
    ];
    return gradients[index % gradients.length];
  };

  const getDockGradient = (index) => {
    const gradients = [
      [theme.colors.primary, theme.colors.primaryDark],
      [theme.colors.secondary, theme.colors.secondaryDark],
      [theme.colors.accent, theme.colors.accentDark],
      [theme.colors.info, theme.colors.infoDark],
    ];
    return gradients[index % gradients.length];
  };

  // Handle fullscreen mode
  if (previewMode === 'fullscreen') {
    return (
      <View style={[styles.fullscreenContainer, style]}>
        <Image
          source={{ uri: cachedImageUri }}
          style={styles.fullscreenImage}
          resizeMode="cover"
          onLoadStart={() => setImageLoaded(false)}
          onLoadEnd={() => setImageLoaded(true)}
          fadeDuration={150}
          progressiveRenderingEnabled={true}
          priority="high"
        />
        {!imageLoaded && (
          <View style={styles.fullscreenPlaceholder}>
            <LinearGradient
              colors={theme.colors.gradientAurora}
              style={styles.placeholderGradient}
            >
              <MaterialIcons name="wallpaper" size={40} color="white" />
            </LinearGradient>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.deviceContainer}>
        <View style={styles.deviceFrame}>
          {/* Device Notch */}
          <View style={styles.deviceNotch} />
          
          {/* Device Screen with Wallpaper */}
          <Image
            source={{ uri: cachedImageUri }}
            style={styles.deviceScreen}
            resizeMode="cover"
            onLoadStart={() => setImageLoaded(false)}
            onLoadEnd={() => setImageLoaded(true)}
            fadeDuration={150}
            progressiveRenderingEnabled={true}
            priority="high"
          />
          
          {/* Loading placeholder */}
          {!imageLoaded && (
            <View style={styles.devicePlaceholder}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.3)', 'rgba(236, 72, 153, 0.3)']}
                style={styles.placeholderGradient}
              >
                <MaterialIcons name="image" size={30} color="white" />
              </LinearGradient>
            </View>
          )}
          
          {/* Status Bar */}
          {showTime && renderStatusBar()}
          
          {/* Preview Mode Overlay */}
          {previewMode === 'homescreen' && renderHomeScreen()}
          {previewMode === 'lockscreen' && renderLockScreen()}
          
          {/* Home Indicator */}
          <View style={styles.deviceHome} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  deviceContainer: {
    padding: wp(2),
    backgroundColor: 'transparent',
  },
  
  // Fullscreen styles
  fullscreenContainer: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.65,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    ...theme.shadows.xl,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  fullscreenPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Loading placeholder styles
  devicePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  placeholderGradient: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primaryGlow,
  },
  deviceFrame: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.75,
    backgroundColor: theme.colors.black,
    borderRadius: Platform.OS === 'ios' ? 45 : 30,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'ios' ? 2 : 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    ...theme.shadows.md,
  },
  deviceNotch: {
    width: Platform.OS === 'ios' ? wp(15) : wp(12),
    height: Platform.OS === 'ios' ? hp(3) : hp(2.5),
    backgroundColor: theme.colors.black,
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    borderBottomLeftRadius: Platform.OS === 'ios' ? 15 : 10,
    borderBottomRightRadius: Platform.OS === 'ios' ? 15 : 10,
    zIndex: 10,
  },
  deviceScreen: {
    width: '100%',
    height: '100%',
  },
  deviceHome: {
    width: Platform.OS === 'ios' ? wp(10) : wp(8),
    height: Platform.OS === 'ios' ? hp(0.5) : hp(0.7),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? hp(1.5) : hp(2),
    alignSelf: 'center',
    borderRadius: theme.radius.full,
    zIndex: 10,
  },
  
  // Status Bar
  statusBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(6) : hp(4),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(8),
    zIndex: 5,
  },
  timeText: {
    color: 'white',
    fontSize: hp(1.6),
    fontWeight: theme.fontWeights.semibold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  batteryText: {
    color: 'white',
    fontSize: hp(1.4),
    fontWeight: theme.fontWeights.medium,
    marginLeft: wp(1),
  },
  
  // Enhanced Home Screen Overlay
  homeScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
  },
  homeTimeWidget: {
    position: 'absolute',
    top: hp(10),
    left: wp(8),
    right: wp(8),
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.radius.lg,
    padding: wp(4),
  },
  homeTimeText: {
    color: 'white',
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.light,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  homeDateText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: hp(1.4),
    fontWeight: theme.fontWeights.medium,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  searchBar: {
    position: 'absolute',
    top: hp(18),
    left: wp(8),
    right: wp(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.radius.full,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
    gap: wp(2),
  },
  searchText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: hp(1.6),
    fontWeight: theme.fontWeights.medium,
  },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: hp(25),
    paddingHorizontal: wp(10),
    paddingBottom: hp(18),
    gap: hp(3),
  },
  appIcon: {
    width: wp(12),
    height: wp(15),
    alignItems: 'center',
    gap: hp(0.8),
  },
  appIconGradient: {
    width: wp(12),
    height: wp(12),
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  appLabel: {
    color: 'white',
    fontSize: hp(1),
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  dock: {
    position: 'absolute',
    bottom: hp(8),
    left: wp(8),
    right: wp(8),
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: theme.radius.xl,
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    ...theme.shadows.lg,
  },
  dockIcon: {
    width: wp(14),
    height: wp(14),
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  dockIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: hp(15),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(1.5),
  },
  pageIndicatorDot: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activePageDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: wp(3),
  },
  
  // Enhanced Lock Screen Overlay
  lockScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 3,
  },
  lockScreenTime: {
    alignItems: 'center',
    marginTop: hp(12),
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: theme.radius.xl,
    paddingHorizontal: wp(8),
    paddingVertical: hp(2.5),
  },
  lockTimeHour: {
    color: 'white',
    fontSize: hp(6),
    fontWeight: theme.fontWeights.light,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  lockTimeMinute: {
    color: 'white',
    fontSize: hp(6),
    fontWeight: theme.fontWeights.light,
    marginTop: -hp(1.5),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  lockDate: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
    marginTop: hp(0.5),
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  notificationsArea: {
    position: 'absolute',
    top: hp(30),
    left: wp(8),
    right: wp(8),
    gap: hp(1.5),
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: theme.radius.lg,
    padding: wp(3),
    gap: wp(2),
    ...theme.shadows.md,
  },
  notificationIcon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: 'white',
    fontSize: hp(1.4),
    fontWeight: theme.fontWeights.semibold,
  },
  notificationText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: hp(1.2),
    fontWeight: theme.fontWeights.medium,
  },
  lockControls: {
    position: 'absolute',
    bottom: hp(12),
    left: wp(8),
    right: wp(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockControlItem: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  lockSlider: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.radius.full,
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    marginHorizontal: wp(5),
    gap: wp(2),
  },
  lockSliderText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: hp(1.4),
    fontWeight: theme.fontWeights.medium,
  },
  lockHomeIndicator: {
    position: 'absolute',
    bottom: hp(6),
    width: wp(30),
    height: hp(0.5),
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: theme.radius.full,
    alignSelf: 'center',
  },
});

export default DeviceMockup;
