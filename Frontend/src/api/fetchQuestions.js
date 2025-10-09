async function fetchQuestionAPI(handleResponse,handleError,setLoading) {
    setLoading(true);
    try{
        const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
        const endpoint = "/api/v1/questions";

        const url = new URL(endpoint,baseURL);

        const response =await fetch(url);
        const jsonData = await response.json();

        if(!response.ok){
            const errorMessage = jsonData.message || "unknown Error occured";
            throw new Error(errorMessage);
        }
        handleResponse(jsonData);
    }catch (error){

        handleError(error);

    }finally{
        
        setLoading(false);
    }
    
}
export default fetchQuestionAPI;