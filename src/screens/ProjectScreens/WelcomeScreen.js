// Import necessary components and libraries from React Native and other dependencies
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { wp, hp } from '../../helpers/common'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { theme } from '../../constants/themes'
import { useNavigation } from '@react-navigation/native'

// Define the WelcomeScreen functional component
const WelcomeScreen = () => {
    // Use navigation hook to enable navigation between screens
    const navigation = useNavigation();

    // Return the JSX layout for the WelcomeScreen
    return (
        <View style={styles.container}>
            {/* Configure the status bar with light content and a transparent background */}
            <StatusBar
                barStyle={'light-content'}
                translucent={true}
                backgroundColor={'transparent'}
            />

            {/* Display a background image */}
            <Image
                source={require('../../drawable/pictures/welcome1.png')}
                style={styles.bgImage}
                resizeMode='cover'
            />

            {/* Animated view container for the main content, with fade-in animation */}
            <Animated.View entering={FadeInUp.duration(600).springify().damping(200)} style={{ flex: 1 }}>
                {/* Linear gradient background at the bottom of the screen */}
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
                    style={styles.LinearGradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.8 }}
                />

                {/* Container for the content in the middle of the screen */}
                <View style={styles.contentcontainer}>
                    {/* Animated title text with fade-in and spring animation */}
                    <Animated.Text
                        entering={FadeInUp.delay(600).springify().damping(200)}
                        style={styles.title}>
                        Zenith Walls
                    </Animated.Text>

                    {/* Animated subtitle text with fade-in and spring animation */}
                    <Animated.Text style={styles.text}
                        entering={FadeInUp.delay(600).springify().damping(200)}
                    >
                        Elevate your screen with Zenith Walls
                    </Animated.Text>

                    {/* Animated view for the start button with fade-in and spring animation */}
                    <Animated.View
                        entering={FadeInUp.delay(600).springify().damping(200)}
                    >
                        {/* Linear gradient for the start button */}
                        <LinearGradient
                            colors={['#5d53f7', '#9820dd']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.Startbutton}
                        >
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Home')}
                                style={styles.StartbuttonInner}
                            >
                                <Text style={styles.Starttext}>
                                    Start Explore
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    )
}

// Export the WelcomeScreen component as the default export
export default WelcomeScreen

// Define the styles used in the WelcomeScreen component
const styles = StyleSheet.create({
    container: {
        flex: 1 // Make the container take up the full screen height
    },
    bgImage: {
        width: wp(100), // Set width to 100% of the screen width
        height: hp(100), // Set height to 100% of the screen height
        position: 'absolute' // Position the image absolutely to fill the container
    },
    LinearGradient: {
        width: wp(100), // Set width to 100% of the screen width
        height: hp(65), // Set height to 65% of the screen height
        position: 'absolute', // Position the gradient absolutely at the bottom
        bottom: 0,
    },
    contentcontainer: {
        flex: 1,
        alignItems: 'center', // Center the content horizontally
        justifyContent: 'flex-end', // Align the content at the bottom
        gap: 14 // Add vertical spacing between elements
    },
    title: {
        fontSize: hp(7), // Set font size based on screen height
        color: "#000", // Set text color to black
        fontWeight: theme.fontWeights.bold // Use bold font weight from theme
    },
    text: {
        fontSize: hp(2), // Set font size based on screen height
        letterSpacing: 1, // Add letter spacing
        marginBottom: 10, // Add bottom margin
        fontWeight: theme.fontWeights.medium, // Use medium font weight from theme
        color: "#000", // Set text color to black
    },
    Startbutton: {
        marginBottom: 50, // Add bottom margin
        borderRadius: theme.radius.xl, // Set border radius from theme
        overflow: 'hidden', // Ensure the gradient doesn't overflow
    },
    StartbuttonInner: {
        padding: 15, // Add padding
        paddingHorizontal: 90, // Add horizontal padding
    },
    Starttext: {
        fontSize: hp(3), // Set font size based on screen height
        color: theme.colors.white, // Set text color to white from theme
        fontWeight: theme.fontWeights.medium, // Use medium font weight from theme
        letterSpacing: 1 // Add letter spacing
    }
})
