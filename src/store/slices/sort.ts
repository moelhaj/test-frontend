import { createSlice } from "@reduxjs/toolkit";

const sortSlice = createSlice({
	name: "sort",
	initialState: {
		sort: null,
	},
	reducers: {
		setSort: (state, action) => {
			state.sort = action.payload.sort;
		},
	},
});

export const { setSort } = sortSlice.actions;
export default sortSlice.reducer;
