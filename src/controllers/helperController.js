import axios from "axios"
import https from "https"

// Fetch user details based on token
const getUserIdFromToken = async (token) => {
    try {
        let response = { userId: null };
        const agent = new https.Agent({ rejectUnauthorized: false })
        var options = {
            'method': 'GET',
            'url': 'https://mfe-le7r.onrender.com/api/user',
            'httpsAgent': agent,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }
        await axios(options).then((res) => {
            response = { userId: res.data.data._id };
        }).catch((err) => {
            response = { userId: null, error: {error_from_server: err.message, error_msg: "Token not found or Invalid Token or Service is down"} }
        });
        return response;
    } catch (error) {
        // return { userId: null, error: error.message };
        console.error('Error fetching user details:', error);
        throw new Error('Unable to fetch user details');
    }
};

export {
    getUserIdFromToken
}