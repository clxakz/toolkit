import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Wrench, Cog } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
	const navigate = useNavigate();

	return (
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
	);
}
