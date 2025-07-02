// Import necessary components and libraries from React Native and other dependencies
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from './ImageCard';
import { getColumnCount, wp } from '../helpers/common';

// Define the ImageGrid functional component
const ImageGrid = ({ images }) => {
    // Determine the number of columns based on the screen size or other criteria
    const columns = getColumnCount();

    // Return the JSX layout for the ImageGrid
    return (
        <View style={styles.container}>
            {/* MasonryFlashList for displaying images in a masonry grid layout */}
            <MasonryFlashList
                data={images} // Data array containing image items
                contentContainerStyle={styles.FlashListContainer} // Style for the content container
                initailNumToRender={1000} // Initial number of items to render
                numColumns={columns} // Number of columns in the grid
                renderItem={({ item, index }) => (
                    // Render each image item using the ImageCard component
                    <ImageCard item={item} index={index} columns={columns} />
                )}
                estimatedItemSize={200} // Estimated size of each item for efficient rendering
            />
        </View>
    )
}

// Export the ImageGrid component as the default export
export default ImageGrid

// Define the styles used in the ImageGrid component
const styles = StyleSheet.create({
    container: {
        minHeight: 3, // Minimum height for the container
        width: wp(100) // Set width to 100% of the screen width
    },
    FlashListContainer: {
        paddingHorizontal: wp(4), // Horizontal padding for the content container
    }
})
