import Cookies from "js-cookie";

const URLAuth = "http://194.26.232.68:8080/";
const URL = "http://194.26.232.68:8000/";


const fetchData = async (request) => {
  try {
    const token = Cookies.get("access_token"); 
    const response = await fetch(`${URL + request}`, {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Authorization": `Bearer ${token}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("data:", request, data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const sendData = async (request, data) => {
  try {
    const token = Cookies.get("access_token"); 
    const formattedRequest = request.endsWith('/') ? request : `${request}`;  
    const response = await fetch(`${URL}${formattedRequest}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("post:", request, result);
    return result;
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
};

const sendDataAuth = async (request, data) => {
    try {
      const formattedRequest = request.endsWith('/') ? request : `${request}`;  
      const response = await fetch(`${URLAuth}${formattedRequest}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        //   "Authorization": `Bearer ${hash}`,
  
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('post:', request, result);
      return result;
    } catch (error) {
      console.error('Error fetching:', error);
      return null;
    }
};

const fetchDataAuth = async (request) => {
  try {
    const response = await fetch(`${URL + request}`, {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",

      }),
      
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("data:", request, data);
    return data;
  } catch (error) {
    return null;
  }
};



export const login = async (data) => {
  const response = await sendDataAuth("token", {
    "username": data.username,
    "password": data.password
  });
  return response;
};


export const getUserClients = async () => {
  const response = await fetchData("client/getUserClients");
  return response;
};
export const addClient = async (formData) => {
  const response = await sendData("client/addClient",formData);
  return response;
};
