import { FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, removeCredentials } from "./slices/user";

const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_API_URL,
	credentials: "include",
	prepareHeaders: (headers, { getState }: any) => {
		const token = getState().user.token;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithRefresh = async (args: string | FetchArgs, api: any, extraOptions: {}) => {
	let result: any = await baseQuery(args, api, extraOptions);

	if (result?.error?.originalStatus === 403 || result?.error?.originalStatus === 401) {
		const refreshResult: any = await baseQuery("/auth/refresh", api, extraOptions);
		if (refreshResult?.data) {
			const user = api.getState().user.user;
			api.dispatch(setCredentials({ user, token: refreshResult.data.accessToken }));
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(removeCredentials());
		}
	}

	return result;
};

export const api = createApi({
	baseQuery: baseQueryWithRefresh,
	endpoints: builder => ({}),
	tagTypes: ["Files", "Users"],
});
