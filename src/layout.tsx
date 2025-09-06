import { lazy, Suspense, useEffect } from "react";
import { useConfig } from "./hooks/useConfig";
import { Cog, Loader, Wrench } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Route, Routes, useNavigate } from "react-router-dom";

const Options = lazy(() => import("./pages/options"));
const Settings = lazy(() => import("./pages/settings"));

export default function Layout() {
	const { config, setConfig } = useConfig();
	const navigate = useNavigate();

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
			<nav className="relative flex items-center w-full gap-1 p-4 prose border-b shadow-sm max-w-none bg-card">
				<p className="absolute text-xs right-1 top-1">v{window.appInfo.getVersion()}</p>

				<Wrench className="flex items-center justify-center p-2 rounded-md size-12 text-primary bg-muted" />

				<article>
					<h2 className="leading-none!">Toolkit</h2>
					<p className="leading-none!">Set and forget</p>
				</article>

				<section className="flex items-center ml-auto gap-2 text-primary">
					<ToggleGroup type="single" className="border" defaultValue="options">
						<ToggleGroupItem onClick={() => navigate("/")} value="options">
							<Wrench />
						</ToggleGroupItem>

						<ToggleGroupItem onClick={() => navigate("/settings")} value="settings">
							<Cog />
						</ToggleGroupItem>
					</ToggleGroup>
				</section>
			</nav>

			<main className="flex flex-1 p-2 overflow-auto overflow-x-hidden">
				<Suspense
					fallback={
						<div className="flex items-center justify-center flex-1">
							<Loader className="animate-spin" />
						</div>
					}
				>
					<Routes>
						<Route path="/" element={<Options />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</Suspense>
			</main>
		</div>
	);
}
