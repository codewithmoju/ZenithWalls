import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS,
  interpolate
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/themes';
import { hp, wp } from '../helpers/common';
import DeviceMockup from './DeviceMockup';
import GlassMorphism from './GlassMorphism';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WallpaperComparison = ({ 
  currentWallpaper, 
  newWallpaper, 
  visible = false,
  onClose,
  previewMode = 'device'
}) => {
  const [showBefore, setShowBefore] = useState(true);
  const slideValue = useSharedValue(SCREEN_WIDTH / 2);
  const opacityValue = useSharedValue(1);

  const handleGesture = (event) => {
    slideValue.value = Math.max(50, Math.min(SCREEN_WIDTH - 50, event.nativeEvent.x));
    
    const shouldShowBefore = event.nativeEvent.x < SCREEN_WIDTH / 2;
    if (shouldShowBefore !== showBefore) {
      runOnJS(setShowBefore)(shouldShowBefore);
    }
  };

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      left: slideValue.value - 2,
    };
  });

  const animatedBeforeStyle = useAnimatedStyle(() => {
    return {
      width: slideValue.value,
    };
  });

  const animatedAfterStyle = useAnimatedStyle(() => {
    return {
      left: slideValue.value,
      width: SCREEN_WIDTH - slideValue.value,
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <GlassMorphism variant="heavy" style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="compare" size={24} color={theme.colors.primary} />
            <Text style={styles.title}>Wallpaper Comparison</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
          </Pressable>
        </View>

        {/* Comparison View */}
        <View style={styles.comparisonContainer}>
          <PanGestureHandler onGestureEvent={handleGesture}>
            <Animated.View style={styles.comparisonView}>
              {/* Before (Current) */}
              <Animated.View style={[styles.beforeContainer, animatedBeforeStyle]}>
                <DeviceMockup
                  wallpaperUrl={currentWallpaper}
                  previewMode={previewMode}
                  style={styles.deviceMockup}
                />
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Current</Text>
                </View>
              </Animated.View>

              {/* After (New) */}
              <Animated.View style={[styles.afterContainer, animatedAfterStyle]}>
                <DeviceMockup
                  wallpaperUrl={newWallpaper}
                  previewMode={previewMode}
                  style={styles.deviceMockup}
                />
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>New</Text>
                </View>
              </Animated.View>

              {/* Slider */}
              <Animated.View style={[styles.slider, animatedSliderStyle]}>
                <View style={styles.sliderHandle}>
                  <MaterialIcons name="drag-handle" size={20} color="white" />
                </View>
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <MaterialIcons name="touch-app" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.instructionText}>
            Drag the slider to compare wallpapers
          </Text>
        </View>

        {/* Current State Indicator */}
        <View style={styles.stateIndicator}>
          <Text style={styles.stateText}>
            Viewing: {showBefore ? 'Current Wallpaper' : 'New Wallpaper'}
          </Text>
        </View>
      </GlassMorphism>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    width: wp(95),
    maxHeight: hp(85),
    padding: wp(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: hp(2.2),
    fontWeight: theme.fontWeights.bold,
  },
  closeButton: {
    padding: wp(2),
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  comparisonContainer: {
    height: hp(50),
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    marginBottom: hp(2),
  },
  comparisonView: {
    flex: 1,
    position: 'relative',
  },
  beforeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  afterContainer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceMockup: {
    transform: [{ scale: 0.6 }],
  },
  labelContainer: {
    position: 'absolute',
    top: hp(2),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: theme.radius.lg,
  },
  label: {
    color: 'white',
    fontSize: hp(1.4),
    fontWeight: theme.fontWeights.semibold,
  },
  slider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.colors.primary,
    zIndex: 10,
  },
  sliderHandle: {
    position: 'absolute',
    top: '50%',
    left: -wp(4),
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -wp(4) }],
    ...theme.shadows.primaryGlow,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    marginBottom: hp(1),
  },
  instructionText: {
    color: theme.colors.textSecondary,
    fontSize: hp(1.5),
    fontWeight: theme.fontWeights.medium,
  },
  stateIndicator: {
    alignItems: 'center',
    paddingVertical: hp(1),
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  stateText: {
    color: theme.colors.primary,
    fontSize: hp(1.6),
    fontWeight: theme.fontWeights.semibold,
  },
});

export default WallpaperComparison;
