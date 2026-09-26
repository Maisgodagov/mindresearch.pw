import axios,{type AxiosError,type InternalAxiosRequestConfig} from 'axios';
const baseURL=import.meta.env.VITE_API_URL??'/api';
let accessToken:string|null=null,refreshPromise:Promise<string|null>|null=null;
const legacyToken=localStorage.getItem('admin_token');if(legacyToken){accessToken=legacyToken;localStorage.removeItem('admin_token')}
export const api=axios.create({baseURL,withCredentials:true});
const authApi=axios.create({baseURL,withCredentials:true});
export function setAccessToken(token:string|null){accessToken=token;localStorage.removeItem('admin_token')}
export function hasAccessToken(){return Boolean(accessToken)}
async function refreshAccessToken(){if(!refreshPromise)refreshPromise=authApi.post('/auth/refresh').then(r=>{accessToken=r.data.token;return accessToken}).catch(()=>{accessToken=null;return null}).finally(()=>{refreshPromise=null});return refreshPromise}
export async function initializeAuth(){return accessToken??refreshAccessToken()}
export async function logout(){try{await authApi.post('/auth/logout')}finally{setAccessToken(null)}}
export async function logoutAll(){try{await api.post('/auth/logout-all')}finally{setAccessToken(null)}}
api.interceptors.request.use(c=>{if(accessToken)c.headers.Authorization=`Bearer ${accessToken}`;return c});
api.interceptors.response.use(r=>r,async(error:AxiosError)=>{const config=error.config as (InternalAxiosRequestConfig&{_authRetry?:boolean})|undefined,isAuthEndpoint=Boolean(config?.url?.startsWith('/auth/'));if(error.response?.status!==401||!config||config._authRetry||isAuthEndpoint)return Promise.reject(error);config._authRetry=true;const token=await refreshAccessToken();if(!token){window.dispatchEvent(new Event('mindresearch:session-ended'));return Promise.reject(error)}config.headers.Authorization=`Bearer ${token}`;return api(config)});
