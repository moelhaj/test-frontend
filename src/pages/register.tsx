import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/store/features/auth";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "@/store/slices/user";

export default function Register() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state: any) => state.user);
	const [register, { isLoading }] = useRegisterMutation();
	const [account, setAccount] = useState({
		email: "",
		password: "",
		name: "",
		error: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

	useEffect(() => {
		setAccount({ ...account, error: "" });
	}, [account.email, account.password, account.name]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (account.name.length < 3) {
			setError("Name must be at least 3 characters long");
			return;
		}

		if (account.password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		if (account.password.length > 50) {
			setError("Password must be at most 50 characters long");
			return;
		}

		// check password with regex for at least one uppercase, one lowercase, one number, and one special character
		if (
			!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,50}$/.test(
				account.password
			)
		) {
			setError(
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
			);
			return;
		}

		if (account.password !== account.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			const { user, accessToken } = await register({
				email: account.email,
				password: account.password,
				name: account.name,
			}).unwrap();
			dispatch(setCredentials({ user, token: accessToken }));
			navigate("/");
		} catch (error) {
			if (error.data) {
				setError(error.data);
			} else {
				setError("Failed to create account");
			}
			setAccount({ ...account });
		}
	};

	return (
		<div className="w-screen h-screen grid place-content-center">
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Sign Up</CardTitle>
					<CardDescription>Enter your information to create an account</CardDescription>
					{error && <div className="text-red-500 text-sm">{error}</div>}
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								value={account.name}
								onChange={e => setAccount({ ...account, name: e.target.value })}
								id="name"
								type="text"
								placeholder=""
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								value={account.email}
								onChange={e => setAccount({ ...account, email: e.target.value })}
								id="email"
								type="email"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								value={account.password}
								onChange={e => setAccount({ ...account, password: e.target.value })}
								id="password"
								type={showPassword ? "text" : "password"}
								required
							/>
							<span
								className="cursor-pointer text-sm text-violet-600"
								onClick={() => setShowPassword(!showPassword)}
							>
								Show Password
							</span>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="confirm-password">Confirm Password</Label>
							<Input
								value={account.confirmPassword}
								onChange={e =>
									setAccount({ ...account, confirmPassword: e.target.value })
								}
								id="confirm-password"
								type={showConfirmPassword ? "text" : "password"}
								required
							/>
							<span
								className="cursor-pointer text-sm text-violet-600"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							>
								Show Password
							</span>
						</div>
						<Button type="submit" disabled={isLoading} className="w-full">
							Create Account
						</Button>
					</form>
					<div className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<Link to="/login" className="underline">
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
