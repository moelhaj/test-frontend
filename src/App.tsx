import { Routes, Route } from "react-router-dom";
import RequireAuth from "./lib/auth-guard";
import Layout from "./components/layout";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";

function App() {
	return (
		<Routes>
			<Route path="login" element={<Login />} />
			<Route path="register" element={<Register />} />
			<Route element={<RequireAuth />}>
				<Route element={<Layout />}>
					<Route path="/">
						<Route index element={<Dashboard />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
