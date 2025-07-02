// Import axios for making HTTP requests
import axios from "axios";

// Define the API key for Pixabay
const API_KEY = '44401069-62c59acd2779ae397ddb52f51'

// Base URL for the Pixabay API
const apiURL = `https://pixabay.com/api/?key=${API_KEY}`

// Function to format the URL with the provided query parameters
const formatUrl = (params) => {
    // Start with the base URL and some default parameters
    let url = apiURL + "&per_page=25&safesearch=true&editors_choice=true"

    // Return the base URL if no parameters are provided
    if (!params) return url;

    // Get the keys of the parameters object
    let paramKeys = Object.keys(params);

    // Iterate over each parameter key
    paramKeys.map(key => {
        // Encode the parameter value if the key is 'q', otherwise use the value directly
        let value = key == 'q' ? encodeURIComponent(params[key]) : params[key];

        // Append the parameter to the URL
        url += `&${key}=${value}`
    });

    // Return the final formatted URL
    return url;
}

// Function to make an API call with the provided parameters
export const apiCall = async (params) => {
    try {
        // Make a GET request to the formatted URL
        const response = await axios.get(formatUrl(params))

        // Extract the data from the response
        const { data } = response;

        // Return success status and data
        return { success: true, data }
    } catch (err) {
        // Log the error message to the console
        console.log('got error: ', err.message);

        // Return failure status and error message
        return { success: false, msg: err.message };
    }
}
