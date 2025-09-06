import { lazy, Suspense, useEffect } from "react";
import { useConfig } from "./hooks/useConfig";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import LoadingSpinner from "./components/loading-spinner";

const Options = lazy(() => import("./pages/options"));
const Settings = lazy(() => import("./pages/settings"));

export default function Layout() {
	const { config, setConfig } = useConfig();

	useEffect(() => {
		if (config) return;
		window.ipcRenderer.invoke("get-config").then(setConfig);
	}, []);

	useEffect(() => {
		if (!config) return;
		window.ipcRenderer.send("save-config", config);
	}, [config]);

	return (
		<div className="flex flex-col w-screen h-screen">
			<Navbar />

			<main className="flex flex-1 p-2 overflow-auto overflow-x-hidden">
				<Suspense fallback={<LoadingSpinner />}>
					<Routes>
						<Route path="/" element={<Options />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</Suspense>
			</main>
		</div>
	);
}
