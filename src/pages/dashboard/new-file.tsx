import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useState, useCallback } from "react";
import { useUploadFileMutation, useAddFileMutation } from "@/store/features/files";
import { useAppSelector } from "@/store/store";

export function UploadDialog({ open, setOpen }: { open: boolean; setOpen: any }) {
	const { user } = useAppSelector((state: any) => state.user);
	const inputFileRef = useRef<HTMLInputElement | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [file, setFile] = useState<File | null>(null);

	const [uploadFile] = useUploadFileMutation();
	const [addFile] = useAddFileMutation();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();

		if (!file) {
			setError("Please select a file to upload");
			setLoading(false);
			return;
		}

		if (file.size > 1024 * 1024 * 10) {
			setError("File size should be less than 10MB");
			setLoading(false);
			return;
		}

		if (file.type.split("/")[0] !== "image" && file.type.split("/")[0] !== "video") {
			setError("Only images and videos are allowed");
			setLoading(false);
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		await uploadFile(formData);
		await addFile({
			name: file.name,
			type: file.type.split("/")[0],
			url: "",
			userId: user.id,
			tags: [],
		});
		setLoading(false);
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button className="flex gap-2">
					<span>Upload File</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-center justify-between">
						<AlertDialogTitle>Upload New File</AlertDialogTitle>
						<Button onClick={() => setOpen(false)} variant="outline" size="icon">
							<X className="h-4 w-4" />
						</Button>
					</div>
					<AlertDialogDescription>
						You can upload image and videos only.
					</AlertDialogDescription>
					{error !== "" && <div className="text-red-500">{error}</div>}
				</AlertDialogHeader>
				<form className="mt-5" onSubmit={handleSubmit}>
					<Input type="file" required onChange={handleFileChange} ref={inputFileRef} />
					<div className="flex items-center justify-between mt-10">
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							Create
						</Button>
					</div>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
