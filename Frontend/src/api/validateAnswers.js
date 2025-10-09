const validateAnswerAPI = async (
  qId,
  answer,
  handleResponse,
  handleError,
  setLoading
) => {
  setLoading(true);
  try {
    const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
    const endpoint = "/api/v1/questions/validate-answer";
    const url = new URL(endpoint, baseURL);

    const requestBody = JSON.stringify({
      qId: qId,
      answer,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    };

    const response = await fetch(url, requestOptions);
    const jsonData = await response.json();

    if (!response.ok) {
      const errorMessage = jsonData.message || "unknown Error Occured";
      throw new Error(errorMessage);
    }
    handleResponse(jsonData);
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};

export default validateAnswerAPI;
