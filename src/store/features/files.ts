import { api } from "../api";

type File = {
	id: string;
	name: string;
	url: string;
	tags: string[];
	userId: string;
};

type FileResponse = File[];

export const fileApi = api.injectEndpoints({
	endpoints: builder => ({
		getFiles: builder.query<FileResponse, void>({
			query: () => "/files",
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({ type: "Files" as const, id })),
							{ type: "Files", id: "LIST" },
					  ]
					: [{ type: "Files", id: "LIST" }],
		}),
		addFile: builder.mutation({
			query: file => ({
				url: "/files",
				method: "POST",
				body: {
					...file,
				},
			}),
			invalidatesTags: [{ type: "Files", id: "LIST" }],
		}),
		uploadFile: builder.mutation({
			query: file => ({
				url: "/files/upload",
				method: "POST",
				body: file,
				formData: true,
			}),
			invalidatesTags: [{ type: "Files", id: "LIST" }],
		}),
		updateFile: builder.mutation({
			query: file => ({
				url: `/files/${file.id}`,
				method: "PUT",
				body: {
					...file.data,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "Files", id: arg.id }],
		}),
	}),
});

export const {
	useAddFileMutation,
	useGetFilesQuery,
	useUpdateFileMutation,
	useUploadFileMutation,
} = fileApi;
