// Import necessary components and libraries from React Native and other dependencies
import { 
    StyleSheet, 
    Text, 
    View, 
    StatusBar, 
    Image, 
    TouchableOpacity, 
    Platform 
} from 'react-native'
import React, { useCallback, memo } from 'react'
import { wp, hp } from '../../helpers/common'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { 
    FadeInUp,
    interpolate,
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withSequence,
    withTiming 
} from 'react-native-reanimated'
import { theme } from '../../constants/themes'
import { useNavigation } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'

// Preload the image
const welcomeImage = require('../../drawable/pictures/welcome1.png')
Image.prefetch(Platform.select({
    ios: Image.resolveAssetSource(welcomeImage).uri,
    android: welcomeImage
}))

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

// Define the WelcomeScreen functional component
const WelcomeScreen = () => {
    const navigation = useNavigation()
    const buttonScale = useSharedValue(1)

    // Optimize button press animation
    const handlePressIn = useCallback(() => {
        buttonScale.value = withSpring(0.95, { damping: 15 })
    }, [])

    const handlePressOut = useCallback(() => {
        buttonScale.value = withSpring(1, { damping: 15 })
    }, [])

    const handleNavigate = useCallback(() => {
        navigation.navigate('Home')
    }, [navigation])

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }]
    }))

    // Return the JSX layout for the WelcomeScreen
    return (
        <View style={styles.container}>
            {/* Configure the status bar with light content and a transparent background */}
            <StatusBar
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
            />

            {/* Optimized background image */}
            <Image
                source={welcomeImage}
                style={styles.bgImage}
                resizeMode="cover"
                defaultSource={welcomeImage}
                loading="eager"
                fadeDuration={0}
            />

            <Animated.View 
                entering={FadeInUp.duration(500).springify()} 
                style={styles.contentWrapper}
            >
                <LinearGradient
                    colors={[
                        'rgba(3, 7, 18, 0)',
                        'rgba(3, 7, 18, 0.4)',
                        'rgba(3, 7, 18, 0.8)',
                        theme.colors.background,
                        theme.colors.background
                    ]}
                    style={styles.linearGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.9 }}
                />

                <View style={styles.contentContainer}>
                    <Animated.Text
                        entering={FadeInUp.delay(200).springify()}
                        style={styles.title}
                    >
                        Zenith Walls
                    </Animated.Text>

                    <Animated.Text 
                        style={styles.text}
                        entering={FadeInUp.delay(300).springify()}
                    >
                        Elevate your screen with Zenith Walls
                    </Animated.Text>

                    <AnimatedTouchableOpacity
                        onPress={handleNavigate}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={[styles.startButton, buttonAnimatedStyle]}
                        activeOpacity={1}
                    >
                        <LinearGradient
                            colors={theme.colors.gradientRoyal}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.startButtonGradient}
                        >
                            <Text style={styles.startText}>
                                Start Explore
                            </Text>
                        </LinearGradient>
                    </AnimatedTouchableOpacity>
                </View>
            </Animated.View>
        </View>
    )
}

// Export the WelcomeScreen component as the default export
export default memo(WelcomeScreen)

// Define the styles used in the WelcomeScreen component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    contentWrapper: {
        flex: 1
    },
    bgImage: {
        width: wp(100),
        height: hp(100),
        position: 'absolute',
        ...Platform.select({
            android: {
                resizeMethod: 'resize'
            }
        })
    },
    linearGradient: {
        width: wp(100),
        height: hp(70),
        position: 'absolute',
        bottom: 0
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: hp(2),
        paddingBottom: hp(8)
    },
    title: {
        fontSize: hp(7),
        color: theme.colors.text,
        fontWeight: theme.fontWeights.bold,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        includeFontPadding: false,
        textAlign: 'center'
    },
    text: {
        fontSize: hp(2),
        letterSpacing: 1,
        marginBottom: hp(1),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.textSecondary,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        includeFontPadding: false,
        textAlign: 'center'
    },
    startButton: {
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        marginTop: hp(2)
    },
    startButtonGradient: {
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(22),
        alignItems: 'center',
        justifyContent: 'center'
    },
    startText: {
        fontSize: hp(2.4),
        color: theme.colors.white,
        fontWeight: theme.fontWeights.semibold,
        letterSpacing: 0.5,
        includeFontPadding: false
    }
})
