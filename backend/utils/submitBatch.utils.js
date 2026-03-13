import axios from 'axios';

export async function submitToken(tokenstr){

    const options = {
        method: 'GET',
        url: `${process.env.JUDGE0_URL}/submissions/batch`,
        params: {
            tokens: tokenstr,
            base64_encoded: 'false',
            fields: '*'
        },
        // headers: {
        //     'x-rapidapi-key': '75c622b151msh55105531490d8dep1dda71jsn872202f61681',
        //     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        // }
    };

    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function checkTokens(){
        try {
            const response = await axios.request(options);
            const {submissions}=response.data
            for (let submission of submissions){
                if(submission && submission.status.id<3){
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
        url: `${process.env.JUDGE0_URL}/submissions/batch`,
        params: {
            base64_encoded: 'false'
        },
        // headers: {
        //     'x-rapidapi-key': '75c622b151msh55105531490d8dep1dda71jsn872202f61681',
        //     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        //     'Content-Type': 'application/json'
        // },
        data: {
            submissions:submissionarr
        }
        }
        console.log({DATA_SENT_TO_JUDGE0:options})
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log("error occured in submit batch function")
        console.error(error);
    }
}

export {submitBatch}