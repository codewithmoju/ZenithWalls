import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/themes';

const GlassMorphism = ({ 
  children, 
  style, 
  intensity = 20,
  variant = 'light', // 'light', 'medium', 'heavy', 'primary', 'secondary', 'accent'
  borderRadius = theme.radius.lg,
  showBorder = true,
  showGradient = true,
  blurType = 'dark'
}) => {
  const getGlassStyle = () => {
    switch (variant) {
      case 'light':
        return theme.glass.light;
      case 'medium':
        return theme.glass.medium;
      case 'heavy':
        return theme.glass.heavy;
      case 'primary':
        return theme.glass.primaryGlass;
      case 'secondary':
        return theme.glass.secondaryGlass;
      case 'accent':
        return theme.glass.accentGlass;
      default:
        return theme.glass.light;
    }
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return ['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)', 'transparent'];
      case 'secondary':
        return ['rgba(236, 72, 153, 0.1)', 'rgba(236, 72, 153, 0.05)', 'transparent'];
      case 'accent':
        return ['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)', 'transparent'];
      default:
        return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)', 'transparent'];
    }
  };

  const glassStyle = getGlassStyle();
  
  return (
    <View style={[
      styles.container, 
      { borderRadius },
      style
    ]}>
      <BlurView
        intensity={intensity}
        tint={blurType}
        style={[
          StyleSheet.absoluteFillObject,
          { borderRadius }
        ]}
      />
      
      {showGradient && (
        <LinearGradient
          colors={getGradientColors()}
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius }
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      
      <View style={[
        styles.content,
        {
          borderRadius,
          backgroundColor: glassStyle.backgroundColor,
          borderWidth: showBorder ? glassStyle.borderWidth : 0,
          borderColor: showBorder ? glassStyle.borderColor : 'transparent',
        }
      ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    borderCurve: 'continuous',
  },
});

export default GlassMorphism;
