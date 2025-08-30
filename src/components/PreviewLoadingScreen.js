import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/themes';
import { hp, wp } from '../helpers/common';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PreviewLoadingScreen = ({ 
  visible = true,
  title = "Preparing Preview...",
  subtitle = "Loading high quality wallpaper",
  progress = 0
}) => {
  const rotateValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const glowValue = useSharedValue(0.3);
  const progressValue = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      // Rotation animation
      rotateValue.value = withRepeat(
        withTiming(360, { duration: 3000 }),
        -1,
        false
      );

      // Scale animation
      scaleValue.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );

      // Glow animation
      glowValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1,
        true
      );

      // Progress animation
      progressValue.value = withTiming(progress, { duration: 500 });
    }
  }, [visible, progress]);

  const animatedLoaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotateValue.value}deg` },
        { scale: scaleValue.value }
      ],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(glowValue.value, [0.3, 1], [0.3, 0.8]),
      shadowRadius: interpolate(glowValue.value, [0.3, 1], [15, 30]),
    };
  });

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.content}>
        {/* Animated Loader */}
        <Animated.View style={[styles.loaderContainer, animatedGlowStyle]}>
          <Animated.View style={[styles.loader, animatedLoaderStyle]}>
            <LinearGradient
              colors={theme.colors.gradientAurora}
              style={styles.loaderGradient}
            >
              <MaterialIcons name="wallpaper" size={40} color="white" />
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* Loading Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Progress Bar */}
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, animatedProgressStyle]}>
                <LinearGradient
                  colors={theme.colors.gradientRoyal}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        {/* Floating Elements */}
        <View style={styles.floatingElements}>
          {Array.from({ length: 6 }).map((_, index) => (
            <FloatingElement key={index} index={index} />
          ))}
        </View>
      </View>
    </View>
  );
};

const FloatingElement = ({ index }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    const delay = index * 200;
    
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 2000 }),
          withTiming(20, { duration: 2000 })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1,
        true
      )
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const icons = ['photo', 'image', 'wallpaper', 'palette', 'brush', 'color-lens'];
  const positions = [
    { top: '20%', left: '10%' },
    { top: '30%', right: '15%' },
    { top: '60%', left: '20%' },
    { top: '70%', right: '10%' },
    { top: '80%', left: '50%' },
    { top: '40%', right: '40%' }
  ];

  return (
    <Animated.View 
      style={[
        styles.floatingElement, 
        positions[index],
        animatedStyle
      ]}
    >
      <MaterialIcons 
        name={icons[index]} 
        size={24} 
        color={theme.colors.textSecondary} 
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: hp(3),
  },
  loaderContainer: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  loader: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    padding: 3,
  },
  loaderGradient: {
    flex: 1,
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: hp(1),
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.bold,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
    textAlign: 'center',
    opacity: 0.8,
  },
  progressContainer: {
    alignItems: 'center',
    gap: hp(1),
    width: wp(60),
  },
  progressBar: {
    width: '100%',
    height: hp(0.8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
  progressText: {
    color: theme.colors.textSecondary,
    fontSize: hp(1.4),
    fontWeight: theme.fontWeights.medium,
  },
  floatingElements: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: '100%',
  },
  floatingElement: {
    position: 'absolute',
  },
});

export default PreviewLoadingScreen;
