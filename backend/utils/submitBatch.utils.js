import axios from 'axios';

export async function submitToken(tokenstr){

    const options = {
        method: 'GET',
        url: `http://localhost:2358/submissions/batch?tokens=${tokenstr.trim(",")}&base64_encoded=false&fields=token,stdout,stderr,status_id,language_id`,
        
        params: {
            tokens: tokenstr,
            base64_encoded: false,
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.X_RAPID_API_KEY,
            'x-rapidapi-host': 'judge029.p.rapidapi.com'
        }
    };

    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function checkTokens(){
        try {
            const response = await axios.request(options);
            const {submissions}=response.data
            for (let submission of submissions){
                if(submission && submission.status.id<4){
                    await sleep(1000)
                    return await checkTokens()
                }
            }
            return submissions
        } catch (error) {
            console.log("error occured in submit token function")
            console.error(error);
        }
    }

    const tokenReasult=await checkTokens()
    return tokenReasult
}


async function submitBatch(submissionarr){

    const options = {
    method: 'POST',
    url: 'http://localhost:2358/submissions/batch?base64_encoded=false',
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
        return response.data;
    } catch (error) {
        console.log("error occured in submit batch function")
        console.error(error);
    }
}

export {submitBatch}