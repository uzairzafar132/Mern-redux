import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice'

const store =configureStore({
    reducer:{
        user:userReducer
    }
})

export default store;


// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import { apiSlice } from './slices/apiSlice';

// const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     auth: authReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
//   devTools: true,
// });

// export default store;  



