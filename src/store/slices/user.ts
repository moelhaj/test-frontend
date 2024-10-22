import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
	name: "user",
	initialState: {
		user: null,
		token: null,
		verifyUser: null,
		deviceId: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		setUser: (state, action) => {
			state.verifyUser = action.payload;
		},
		removeCredentials: state => {
			state.user = null;
			state.token = null;
		},
		updateUser: (state, action) => {
			state.user = action.payload;
		},
	},
});

export const { setCredentials, removeCredentials, setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
