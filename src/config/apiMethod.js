import axios from 'axios';

/* Posting Webservice Here */
export const postAPI = async (
  url,
  data,
  header = { 'Content-Type': 'multipart/form-data' },
  params = {},
  Authorization = {},
) => {
  /* Checking for Internet connection */
  const connection = true;
  /* If successfully connected */
  if (connection) {
    return axios({
      method: 'post',
      url: url,
      timeout: 1000 * 60, //Time out of 60 Sec
      data: data,
      headers: header,
      params: params,
      Authorization: Authorization,
    });
  } else {
    /* throw error for No internet connection */
    throw new Error('No Internet Connection');
  }
};

/* Upload image Webservice Here */
export const uploadImageAPI = async (url, data, header = { 'Content-Type': 'multipart/form-data' }) => {
  /* Checking for Internet connection */
  const connection = true;
  /* If successfully connected */
  if (connection) {
    return axios({
      method: 'post',
      url: url,
      timeout: 1000 * 60, //Time out of 60 Sec
      data: data,
      headers: header,
    });
  } else {
    /* throw error for No internet connection */
    throw new Error('No Internet Connection');
  }
};

/* Get Webservice Here */
export const getAPI = async (
  url,
  header = {},
  params = {},
  Authorization = {},
) => {
  /* Checking for Internet connection */
  const connection = true;
  /* If successfully connected */
  if (connection) {
    return axios({
      method: 'get',
      url: url,
      timeout: 10000 * 60, //Time out of 60 Sec
      headers: header,
      params: params,
      Authorization: Authorization,
    });
  } else {
    /* throw error for No internet connection */
    throw new Error('No Internet Connection');
  }
};

export const putAPI = async (url, data, header = {}) => {
  /* Checking for Internet connection */
  const connection = true;
  /* If successfully connected */
  if (connection) {
    return axios({
      method: 'put',
      url: url,
      timeout: 1000 * 60, //Time out of 60 Sec
      data: data,
      headers: header,
    });
  } else {
    /* throw error for No internet connection */
    throw new Error('No Internet Connection');
  }
};

export const deleteAPI = async (url, data, header = {}) => {
  /* Checking for Internet connection */
  const connection = true;
  /* If successfully connected */
  if (connection) {
    return axios({
      method: 'delete',
      url: url,
      timeout: 1000 * 60, //Time out of 60 Sec
      data: data,
      headers: header,
    });
  } else {
    /* throw error for No internet connection */
    throw new Error('No Internet Connection');
  }
};
