import axios from 'axios';

export async function submitToken(tokenstr){

    const options = {
    method: 'GET',
    url: 'https://judge029.p.rapidapi.com/submissions/batch',
    params: {
        tokens: tokenstr,
        base64_encoded: 'true',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': process.env.X_RAPID_API_KEY,
        'x-rapidapi-host': 'judge029.p.rapidapi.com'
    }
    };
    async function submitTokens(){
        try {
            const response = await axios.request(options);
            console.log(response.data);
        } catch (error) {
            console.log("error occured in submit token function")
            console.error(error);
        }
    }
}


async function submitBatch(submissionarr){

    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/about',
    headers: {
        'x-rapidapi-key': process.env.X_RAPID_API_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    },
    data:{
        submissions:submissionarr
    }
    }; 

    try {
        const response = await axios.request(options);
        console.log(`Submitted batch reasult :${response}`)
        return response.data;
    } catch (error) {
        console.log("error occured in submit batch function")
        console.error(error);
    }
}

export {submitBatch}