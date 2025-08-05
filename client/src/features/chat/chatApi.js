import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';


export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: 'include',
    }),
    tagTypes: ['Chat'],
    endpoints:(builder) => ({
        createChat: builder.mutation({
            query: ({participants, name }) => ({
                url: '/chats',
                method: 'POST',
                body: {participants, name},
            }),
            invalidatesTags:['Chats']
        }),
        getChatById: builder.query({
            query: (chatId) => ({
                url: `/chats/${chatId}`,
            }), 
            providesTags: (result, error, chatId) => [{type: 'Chat', id: chatId}],
        }),
        getUserChats: builder.query({
            query:(userId) => (
                {
                    url: `/chats/user/${userId}`,
   
                }
            ),
            providesTags: ['Chats']
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `/chats/${chatId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, chatId) => [{type: 'Chat', id: chatId}],
        })
    })
})

export const {
    useCreateChatMutation,
    useGetChatByIdQuery,
    useGetUserChatsQuery,
    useDeleteChatMutation,
} = chatApi;