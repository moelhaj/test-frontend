import { useEffect, useState } from "react";
import { useGetFilesQuery } from "@/store/features/files";
import { useAppSelector } from "@/store/store";
import { UploadDialog } from "./new-file";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

const initialMedia = [
	{ id: "1", type: "image", url: "https://via.placeholder.com/150" },
	{ id: "2", type: "image", url: "https://via.placeholder.com/150/0000FF" },
	{ id: "3", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
	{ id: "4", type: "image", url: "https://via.placeholder.com/150/FF0000" },
	{ id: "5", type: "video", url: "https://www.w3schools.com/html/movie.mp4" },
];

export default function Dashboard() {
	const { user } = useAppSelector((state: any) => state.user);
	const { data, isLoading } = useGetFilesQuery(user?.id);
	const [uploadDialog, setUploadDialog] = useState(false);

	const [mediaItems, setMediaItems] = useState(initialMedia);

	const handleOnDragEnd = (result: any) => {
		if (!result.destination) return;

		const items = Array.from(mediaItems);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setMediaItems(items);
	};

	useEffect(() => {
		console.log(data);
	}, [data]);

	if (isLoading) {
		return <div className="w-screen h-screen grid place-content-center">Loading...</div>;
	}

	return (
		<div className="p-4 space-y-4">
			<div className="flex">
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
									gap: "10px",
									overflowX: "auto",
									padding: "10px",
								}}
							>
								{data?.map((item, index) => (
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
													backgroundColor: "#fff",
													borderRadius: "8px",
													boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
													...provided.draggableProps.style,
												}}
											>
												{item.type === "image" ? (
													<img
														src={item.url}
														alt=""
														style={{ width: "150px", height: "150px" }}
													/>
												) : (
													<video
														controls
														src={item.url}
														style={{ width: "150px", height: "150px" }}
													></video>
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
