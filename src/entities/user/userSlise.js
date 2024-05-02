import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        name: "",
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },

        deleteUser: (state, action) => {
            state.user = ''
        }
    },
});

export const { setUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;