import axios from 'axios';
import { Environment } from '../../../environments/environment';

function setAxiosDefaults() {
  axios.defaults.responseType =  'json';
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = Environment.baseApiUrl;
}

setAxiosDefaults();

export default axios;