import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
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
import { theme } from '../constants/themes';
import { hp, wp } from '../helpers/common';

const LoadingIndicator = ({ 
  text = "Loading wallpapers...", 
  size = "large",
  showText = true,
  style = {} 
}) => {
  const rotateValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(0.3);

  React.useEffect(() => {
    // Rotation animation
    rotateValue.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );

    // Scale animation
    scaleValue.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );

    // Opacity animation for shimmer effect
    opacityValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotateValue.value}deg` },
        { scale: scaleValue.value }
      ],
      opacity: opacityValue.value,
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        opacityValue.value,
        [0.3, 1],
        [0.5, 1]
      ),
    };
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 30;
      case 'large': return 40;
      case 'xlarge': return 50;
      default: return 40;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.loaderContainer, animatedStyle]}>
        <LinearGradient
          colors={theme.colors.gradientAurora}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientLoader, { width: getSize(), height: getSize() }]}
        >
          <View style={styles.innerLoader}>
            <ActivityIndicator 
              size={size === 'small' ? 'small' : 'large'} 
              color={theme.colors.white} 
            />
          </View>
        </LinearGradient>
      </Animated.View>
      
      {showText && (
        <Animated.Text style={[styles.loadingText, shimmerStyle]}>
          {text}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  loaderContainer: {
    marginBottom: theme.spacing.md,
  },
  gradientLoader: {
    borderRadius: 50,
    padding: 2,
    ...theme.shadows.lg,
  },
  innerLoader: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: hp(1.8),
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default LoadingIndicator;
