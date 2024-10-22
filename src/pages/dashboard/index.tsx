import { useEffect, useState } from "react";
import { useGetFilesQuery } from "@/store/features/files";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { UploadDialog } from "./new-file";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Files, Images, Share2, Video } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { setSort } from "@/store/slices/sort";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state: any) => state.user);
	const { sort } = useAppSelector((state: any) => state.sort);
	const { data, isLoading } = useGetFilesQuery(user?.id);
	const [uploadDialog, setUploadDialog] = useState(false);
	const [mediaItems, setMediaItems] = useState(data || []);

	useEffect(() => {
		// if (sort) {
		// 	const result: any = [];
		// 	sort.forEach((id: any) => {
		// 		const item = data?.find((item: any) => item.id === id);
		// 		if (item) {
		// 			result.push(item);
		// 		}
		// 	});
		// 	setMediaItems(result);
		// }
		setMediaItems(data);
	}, [data]);

	const handleShare = (url: string) => {
		navigator.clipboard.writeText(url);
	};

	const handleOnDragEnd = (result: any) => {
		if (!result.destination) return;

		const items = Array.from(mediaItems || []);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		// if (sort) {
		// 	const result: any = [];
		// 	sort.forEach((id: any) => {
		// 		const item = data.find((item: any) => item.id === id);
		// 		if (item) {
		// 			result.push(item);
		// 		}
		// 	});
		// 	setMediaItems(result);
		// }

		setMediaItems(items);
		const ids = items.map(item => item.id);

		dispatch(setSort({ sort: ids }));
	};

	if (isLoading) {
		return <div className="w-full h-screen grid place-content-center">Loading...</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex">
				<SidebarTrigger />
				<div className="flex-1"></div>
				<div className="flex items-center space-x-4">
					<UploadDialog open={uploadDialog} setOpen={setUploadDialog} />
				</div>
			</div>
			<div>
				{data?.length === 0 && (
					<div className="w-full h-full grid place-content-center">No files found</div>
				)}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Card className="w-full">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Files</CardTitle>
						<Files className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{data?.length}</div>
					</CardContent>
				</Card>
				<Card className="w-full">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Images</CardTitle>
						<Images className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.filter((item: any) => item.type === "image").length}
						</div>
					</CardContent>
				</Card>
				<Card className="w-full">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Videos</CardTitle>
						<Video className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data?.filter((item: any) => item.type === "video").length}
						</div>
					</CardContent>
				</Card>
			</div>
			<div>
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<Droppable droppableId="gallery" direction="horizontal">
						{provided => (
							<div
								className="gallery"
								{...provided.droppableProps}
								ref={provided.innerRef}
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: "10px",
									overflowX: "auto",
									padding: "10px",
								}}
							>
								{mediaItems?.map((item, index) => (
									<Draggable key={item.id} draggableId={item.id} index={index}>
										{provided => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={{
													userSelect: "none",
													padding: "5px",
													margin: "0 10px 0 0",
													borderRadius: "20px",
													overflow: "hidden",
													display: "flex",
													...provided.draggableProps.style,
												}}
											>
												{item.type === "image" ? (
													<div className="p-4 bg-gray-100 flex flex-col gap-4 rounded-lg">
														<div className="flex">
															<div className="flex-1" />
															<Button
																onClick={() =>
																	handleShare(
																		`${
																			import.meta.env
																				.VITE_API_ABSOLUTE_URL
																		}/file-${item.name}`
																	)
																}
															>
																<Share2 className="h-4 w-4" />
															</Button>
														</div>
														<img
															src={`${
																import.meta.env
																	.VITE_API_ABSOLUTE_URL
															}/file-${item.name}`}
															alt=""
															style={{
																width: "200px",
																height: "200px",
															}}
															className="rounded-lg"
															crossOrigin="anonymous"
														/>
													</div>
												) : (
													<div className="p-4 bg-gray-100 flex flex-col gap-4 rounded-lg">
														<div className="flex">
															<div className="flex-1" />
															<Button
																onClick={() =>
																	handleShare(
																		`${
																			import.meta.env
																				.VITE_API_ABSOLUTE_URL
																		}/file-${item.name}`
																	)
																}
															>
																<Share2 className="h-4 w-4" />
															</Button>
														</div>
														<video
															controls
															src={`${
																import.meta.env
																	.VITE_API_ABSOLUTE_URL
															}/file-${item.name}`}
															style={{
																width: "200px",
																height: "200px",
															}}
															crossOrigin="anonymous"
															muted
															autoPlay={false}
														></video>
													</div>
												)}
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</div>
	);
}
