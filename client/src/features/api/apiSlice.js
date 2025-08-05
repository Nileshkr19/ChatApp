import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Mutex} from 'async-mutex';
import {  logout } from '../auth/authSlice';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ,
    credentials: 'include',
    prepareHeaders: (headers, { getState} ) => {
        const token = getState().auth.accessToken;
        if(token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
 })

 const baseQueryWithReauth = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if(result.error?.status === 401){
        if(!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery(
                    {
                        url: '/tokens/refresh-token',
                        method: 'POST',
                        credentials: 'include',
                    },
                    api,
                    extraOptions
                )
                if(refreshResult.data ) {
                    result = await baseQuery(args, api, extraOptions);
                }
                else {
                    api.dispatch(logout());
                }
            
            }
            finally {
                release();
            }
        }
        else {
            console.log('Mutex is locked, waiting for it to be released');
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
  
 }


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});