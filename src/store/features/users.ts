import { api } from "../api";

type User = {
	id: string;
	name: string;
	email: string;
	files: string[];
};

export const userApi = api.injectEndpoints({
	endpoints: builder => ({
		getUser: builder.query<User, string | undefined>({
			query: id => `/users/${id}`,
			providesTags: ["Users"],
		}),
		addUser: builder.mutation({
			query: user => ({
				url: "/users",
				method: "POST",
				body: {
					...user,
				},
			}),
			invalidatesTags: [{ type: "Users", id: "LIST" }],
		}),
		updateUser: builder.mutation({
			query: user => ({
				url: `/users/${user.id}`,
				method: "PUT",
				body: {
					...user.data,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Users", id: arg.id }],
		}),
	}),
});

export const { useAddUserMutation, useGetUserQuery, useUpdateUserMutation } = userApi;
