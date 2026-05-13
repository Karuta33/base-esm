/* Downloader by Mohammad Nayan 
Recode by Karuta */
import axios from 'axios';
const apiBaseUrl = 'https://nayan-video-downloader.vercel.app/';
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const createRequest = (endpoint, formatData) => {
  return (url, key) => {
    return new Promise(async (resolve) => {
      try {
        const params = formatData ? formatData(url, key) : { url };
        const response = await axios.get(`${apiBaseUrl}${endpoint}`, { params });
        resolve(response.data);
      } catch (error) {
        resolve({
          developer: 'MOHAMMAD NAYAN',
          status: false,
          msg: `${capitalize(endpoint)} API error`,
        });
      }
    });
  };
};
export const ndown = createRequest('ndown');
export const instagram = createRequest('instagram');
export const tikdown = createRequest('tikdown');
export const ytdown = createRequest('ytdown');
export const threads = createRequest('threads');
export const twitterdown = createRequest('twitterdown');
export const fbdown2 = createRequest('fbdown2', (url, key) => ({ url, key }));
export const GDLink = createRequest('GDLink');
export const pintarest = createRequest('pintarest');
export const capcut = createRequest('capcut');
export const likee = createRequest('likee');
export const alldown = createRequest('alldown');
export const alldownV2 = createRequest('alldown-v2');
export const spotifySearch = createRequest('spotify-search', (name, limit) => ({ name, limit }));
export const soundcloudSearch = createRequest('soundcloud-search', (name, limit) => ({ name, limit }));
export const spotifyDl = createRequest('spotifyDl', (url) => ({ url }));
export const soundcloud = createRequest('soundcloud', (url) => ({ url }));
export const terabox = createRequest('terabox', (url) => ({ url }));