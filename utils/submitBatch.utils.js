import axios from 'axios';




async function submitBatch(submissionarr){

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        headers: {
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions: submissionarr
        }
    }   

    try {
        const response = await axios.request(options);
        return (response.data);
    } catch (error) {
        console.error(error);
    }
}

export {submitBatch}