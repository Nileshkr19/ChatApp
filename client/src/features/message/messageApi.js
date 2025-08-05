import { apiSlice } from '../api/apiSlice';

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET all messages in a chat
    getMessages: builder.query({
      query: ({ chatId, page = 1, limit = 20 }) =>
        `/messages/${chatId}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { chatId }) =>
        result?.messages
          ? [
              ...result.messages.map((msg) => ({ type: 'Message', id: msg._id })),
              { type: 'Message', id: `LIST-${chatId}` },
            ]
          : [{ type: 'Message', id: `LIST-${chatId}` }],
    }),

    // POST a new message
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `/messages`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message', id: `LIST-${chatId}` },
      ],
    }),

    // DELETE a message
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message', id: `LIST-${chatId}` },
      ],
    }),

    // MARK message as seen
    markAsSeen: builder.mutation({
      query: ({ messageId }) => ({
        url: `/messages/seen/${messageId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message', id: `LIST-${chatId}` },
      ],
    }),

    // Edit a message
    editMessage: builder.mutation({
      query: ({ messageId, content }) => ({
        url: `/messages/${messageId}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message', id: `LIST-${chatId}` },
      ],
    }),


    // get messages by chatId
    getAllMessagesInChat: builder.query({
      query: (chatId, cursor) => {
        const url = new URLSearchParams();
        if(cursor) url.set("cursor", cursor);
        url.set("limit", 20);
        return `/messages/all/${chatId}?${url.toString()}`;
      },
      providesTags: (result, error, {chatId} ) => 
        result?.messages
          ? [
              ...result.messages.map((msg) => ({ type: 'Message', id: msg.id })),
              { type: 'Message', id: `LIST-${chatId}` },
            ]
          : [{ type: 'Message', id: `LIST-${chatId}` }],
    }),

    // Search messages
    searchMessages: builder.query({
      query: ({chatId, limit= 50, page = 1, searchTerm}) => {
        const url = new URLSearchParams();
        url.set("limit", limit);
        url.set("page", page);
        if (searchTerm) url.set("query", searchTerm);
        return `/messages/search/${chatId}?${url.toString()}`;
      },
      providesTags: (result, error, { chatId }) =>
        result?.messages
          ? [
              ...result.messages.map((msg) => ({ type: 'Message', id: msg.id })),
              { type: 'Message', id: `LIST-${chatId}` },
            ]
          : [{ type: 'Message', id: `LIST-${chatId}` }],  
    })
 
  })
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useMarkAsSeenMutation,

} = messageApi;
