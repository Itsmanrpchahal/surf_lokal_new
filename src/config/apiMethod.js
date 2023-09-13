import axios from 'axios';


export const postAPI = async (
  url,
  data,
  header = { 'Content-Type': 'multipart/form-data' },
  params = {},
  Authorization = {},
) => {

  const connection = true;

  if (connection) {
    return axios({
      method: 'post',
      url: url,
      timeout: 1000 * 60,
      data: data,
      headers: header,
      params: params,
      Authorization: Authorization,
    });
  } else {
  
    throw new Error('No Internet Connection');
  }
};


export const uploadImageAPI = async (url, data, header = { 'Content-Type': 'multipart/form-data' }) => {
  
  const connection = true;

  if (connection) {
    return axios({
      method: 'post',
      url: url,
      timeout: 1000 * 60, 
      data: data,
      headers: header,
    });
  } else {
 
    throw new Error('No Internet Connection');
  }
};


export const getAPI = async (
  url,
  header = {},
  params = {},
  Authorization = {},
) => {
 
  const connection = true;
 
  if (connection) {
    return axios({
      method: 'get',
      url: url,
      timeout: 10000 * 60, 
      headers: header,
      params: params,
      Authorization: Authorization,
    });
  } else {
   
    throw new Error('No Internet Connection');
  }
};

export const putAPI = async (url, data, header = {}) => {

  const connection = true;

  if (connection) {
    return axios({
      method: 'put',
      url: url,
      timeout: 1000 * 60, 
      data: data,
      headers: header,
    });
  } else {
    
    throw new Error('No Internet Connection');
  }
};

export const deleteAPI = async (url, data, header = {}) => {
  
  const connection = true;

  if (connection) {
    return axios({
      method: 'delete',
      url: url,
      timeout: 1000 * 60, 
      data: data,
      headers: header,
    });
  } else {

    throw new Error('No Internet Connection');
  }
};
