import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/store/features/auth";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "@/store/slices/user";

export default function Login() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [showPassword, setShowPassword] = useState(false);

	const [login, { isLoading }] = useLoginMutation();
	const { user } = useAppSelector((state: any) => state.user);
	const [account, setAccount] = useState({
		email: "test.account@filemanament.com",
		password: "password",
		error: "",
	});

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

	useEffect(() => {
		setAccount({ ...account, error: "" });
	}, [account.email, account.password]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const { user, accessToken } = await login({
				email: account.email,
				password: account.password,
			}).unwrap();
			dispatch(setCredentials({ user, token: accessToken }));
			navigate("/");
		} catch (error) {
			setAccount({ ...account, error: "Wrong Credentials" });
		}
	};

	return (
		<div className="w-screen h-screen grid place-content-center">
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
					{account.error !== "" && (
						<div className="text-red-500 text-sm">{account.error}</div>
					)}
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
								value={account.email}
								onChange={e => setAccount({ ...account, email: e.target.value })}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								required
								value={account.password}
								onChange={e => setAccount({ ...account, password: e.target.value })}
							/>
							<span
								className="cursor-pointer text-sm text-violet-600"
								onClick={() => setShowPassword(!showPassword)}
							>
								Show Password
							</span>
						</div>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full"
							onClick={handleSubmit}
						>
							Login
						</Button>
					</div>
					<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link to="/register" className="underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
