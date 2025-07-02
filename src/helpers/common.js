// Import the Dimensions module from React Native to get device width and height
import { Dimensions } from 'react-native'

// Get the width and height of the device screen
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

// Function to calculate width as a percentage of the device width
export const wp = percentage => {
    const width = deviceWidth; // Get the current device width
    return (percentage * width) / 100; // Calculate the width percentage
}

// Function to calculate height as a percentage of the device height
export const hp = percentage => {
    const height = deviceHeight; // Get the current device height
    return (percentage * height) / 100; // Calculate the height percentage
}

// Function to determine the number of columns based on the device width
export const getColumnCount = () => {
    if (deviceWidth >= 1024) {
        // Device is a desktop
        return 4
    } else if (deviceWidth >= 768) {
        // Device is a tablet
        return 3
    } else {
        // Device is a mobile
        return 2
    }
}

// Function to determine the image size based on its aspect ratio
export const getImageSize = (height, width) => {
    if (width > height) {
        // Image is in landscape orientation
        return 250
    } else if (width < height) {
        // Image is in portrait orientation
        return 300
    } else {
        // Image is square
        return 200
    }
}

export const captilization=str=>{
    return str.replace(/\b\w/g, l => l.toUpperCase())
}
