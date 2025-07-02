// Import necessary components and libraries from React Native and other dependencies
import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import { getImageSize, wp } from '../helpers/common';
import { theme } from '../constants/themes';

// Define the ImageCard functional component
const ImageCard = ({ item, index, columns }) => {

    // Function to calculate the height of the image based on its original dimensions
    const getImageHeight = () => {
        let { imageHeight: height, imageWidth: width } = item;
        return { height: getImageSize(height, width) }
    }

    // Function to check if the current item is the last one in its row
    const isLastInRow = () => {
        return (index + 1) % columns === 0
    }

    // Return the JSX layout for the ImageCard
    return (
        // Pressable component to wrap the image, with conditional styling for spacing
        <Pressable style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
            {/* Display the image with dynamic height */}
            <Image
                source={{ uri: item?.webformatURL }}
                style={[styles.Images, getImageHeight()]}
            />
        </Pressable>
    )
}

// Export the ImageCard component as the default export
export default ImageCard

// Define the styles used in the ImageCard component
const styles = StyleSheet.create({
    Images: {
        height: 300, // Default height for the image
        width: '100%' // Image width is 100% of its container
    },
    imageWrapper: {
        backgroundColor: theme.colors.grayBG, // Background color from the theme
        borderRadius: theme.radius.xl, // Border radius from the theme
        borderCurve: 'continuous', // Continuous curve for borders
        overflow: 'hidden', // Ensure content doesn't overflow the container
        marginBottom: wp(2) // Margin at the bottom for spacing
    },
    spacing: {
        marginRight: wp(2) // Margin on the right for spacing between images
    }
})
