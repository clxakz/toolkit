import { lazy, Suspense, useEffect } from "react";
import { useConfig } from "./hooks/useConfig";
import { Loader, Wrench } from "lucide-react";
import { Label } from "./components/ui/label";
import { Switch } from "./components/ui/switch";

const Options = lazy(() => import("./pages/options"));

export default function Layout() {
	const { config, setConfig, setOption } = useConfig();

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

				<section className="flex items-center ml-auto gap-2">
					<Label className="text-primary" htmlFor="launchAtStartup">
						Launch at system startup
					</Label>
					<Switch
						id="launchAtStartup"
						checked={config?.launchOnStartup}
						onCheckedChange={(checked) => setOption("launchOnStartup", checked)}
					/>
				</section>
			</nav>

			<main className="flex flex-1 p-2 overflow-auto">
				<Suspense
					fallback={
						<div className="flex items-center justify-center flex-1">
							<Loader className="animate-spin" />
						</div>
					}
				>
					<Options />
				</Suspense>
			</main>
		</div>
	);
}
