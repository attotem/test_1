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

const sendPatchData = async (request, data) => {
  try {
    const token = Cookies.get("access_token"); 
    const formattedRequest = request.endsWith('/') ? request : `${request}`;  
    const response = await fetch(`${URL}${formattedRequest}`, {
      method: "PATCH",
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

const sendPutData = async (request, data) => {
  try {
    const token = Cookies.get("access_token"); 
    const formattedRequest = request.endsWith('/') ? request : `${request}`;  
    const response = await fetch(`${URL}${formattedRequest}`, {
      method: "PUT",
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
const sendDeleteData = async (request, data) => {
  try {
    const token = Cookies.get("access_token"); 
    const formattedRequest = request.endsWith('/') ? request : `${request}`;  
    const response = await fetch(`${URL}${formattedRequest}`, {
      method: "DELETE",
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

const sendDataSinJwt = async (request, data) => {
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

const fetchDataSinJwt = async (request) => {
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
  const response = await sendDataSinJwt("token", {
    "username": data.username,
    "password": data.password
  });
  return response;
};

export const getUserClients = async () => {
  const response = await fetchData("client/getUserClients");
  return response;
};
export const getClientById = async (client_id) => {
  const response = await fetchData(`client/get/${client_id}/`);
  return response;s
};
export const getAllTags = async () => {
  const response = await fetchData(`client/tags/getAll/`);
  return response;s
};
export const getAllSources  = async () => {
  const response = await fetchData(`client/sources/getAll/`);
  return response;s
};
export const addClient = async (formData) => {
  const response = await sendData("client/add",formData);
  return response;
};
export const applyTags = async (formData) => {
  const response = await sendData("client/tags/apply/",formData);
  return response;
};
export const addTag = async (formData) => {
  const response = await sendData("client/tags/add/",formData);
  return response;
};
export const updateClient = async (formData) => {
  const response = await sendPatchData("client/update/",formData);
  return response;
};
export const removeTags = async (formData) => {
  const response = await sendPutData("client/tags/remove/",formData);
  return response;
};
export const deleteClient = async (client_id) => {
  const response = await sendDeleteData(`client/delete/${client_id}/`);
  return response;
};
