import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store, persister } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { AppProvider } from "./hooks/useApp";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<PersistGate persistor={persister}>
			<AppProvider>
				<HashRouter>
					<App />
				</HashRouter>
			</AppProvider>
		</PersistGate>
	</Provider>
);
