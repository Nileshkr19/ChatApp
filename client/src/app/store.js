import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import {apiSlice} from '../features/api/apiSlice';
import {chatApi} from '../features/chat/chatApi';
import {messageApi} from '../features/message/messageApi';

export const store = configureStore({
    reducer:{
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,

    }, middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiSlice.middleware,
            chatApi.middleware,
            messageApi.middleware
        ),
        

})