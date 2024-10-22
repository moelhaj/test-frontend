import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AppContextType {
	// Define the shape of your context here
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: any }) => {
	return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export default function useApp() {
	return useContext(AppContext);
}
