import { useAppSelector, useAppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { removeCredentials } from "@/store/slices/user";

export default function Header(props: any) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state: any) => state.user);

	useEffect(() => {
		if (!user) navigate("/login");
	}, [user]);

	return (
		<header className="flex items-center w-full p-4">
			<div className="flex-1" />
			<Button onClick={() => dispatch(removeCredentials())} className="mr-4">
				Logout
			</Button>
		</header>
	);
}
