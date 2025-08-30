// Import necessary components and libraries from React Native and other dependencies
import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import { getImageSize, wp } from '../helpers/common';
import { theme } from '../constants/themes';
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn } from 'react-native-reanimated'

// Define the ImageCard functional component
const ImageCard = ({ item, index, columns }) => {
    const navigation = useNavigation()

    // Function to calculate the height of the image based on its original dimensions
    const getImageHeight = () => {
        let { imageHeight: height, imageWidth: width } = item;
        return { height: getImageSize(height, width) }
    }

    // Function to check if the current item is the last one in its row
    const isLastInRow = () => {
        return (index + 1) % columns === 0
    }

    const handlePress = () => {
        navigation.navigate('Preview', { image: item })
    }

    // Return the JSX layout for the ImageCard
    return (
        // Pressable component to wrap the image, with conditional styling for spacing
        <Animated.View
            entering={FadeIn.delay(index * 100).duration(300)}
            style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}
        >
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [
                    styles.pressable,
                    pressed && styles.pressed
                ]}
            >
                <Image
                    source={{ uri: item?.webformatURL }}
                    style={[styles.Images, getImageHeight()]}
                    resizeMode="cover"
                />
            </Pressable>
        </Animated.View>
    )
}

// Export the ImageCard component as the default export
export default ImageCard

// Define the styles used in the ImageCard component
const styles = StyleSheet.create({
    Images: {
        height: 300, // Default height for the image
        width: '100%', // Image width is 100% of its container
        borderRadius: theme.radius.xl,
    },
    imageWrapper: {
        backgroundColor: theme.colors.surface, // Background color from the theme
        borderRadius: theme.radius.xl, // Border radius from the theme
        borderCurve: 'continuous', // Continuous curve for borders
        overflow: 'hidden', // Ensure content doesn't overflow the container
        marginBottom: wp(2), // Margin at the bottom for spacing
        ...theme.shadows.luxury, // Ultra-premium shadow for luxury feel
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
    },
    spacing: {
        marginRight: wp(2) // Margin on the right for spacing between images
    },
    pressable: {
        width: '100%',
    },
    pressed: {
        opacity: 0.8,
        transform: [{scale: 0.98}]
    }
})
