import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useConfig } from "@/hooks/useConfig";
import { motion } from "motion/react";

export default function Settings() {
	const { config, setOption } = useConfig();

	return (
		<motion.div
			initial={{ y: -20, filter: "blur(2px)", opacity: 0 }}
			animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
			transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
			className="flex flex-1 flex-col gap-1"
		>
			<section className="flex items-center justify-between bg-card p-4 rounded-md shadow-sm">
				<article className="flex flex-col">
					<Label htmlFor="launchAtStartup">Launch At System Startup</Label>
					<p>recommended</p>
				</article>

				<Switch id="launchAtStartup" checked={config?.launchOnStartup} onCheckedChange={(checked) => setOption("launchOnStartup", checked)} />
			</section>

			<section className="flex items-center justify-between bg-card p-4 rounded-md shadow-sm">
				<Label htmlFor="notifications">Display Notifications</Label>
				<Switch id="notifications" checked={config?.notifications} onCheckedChange={(checked) => setOption("notifications", checked)} />
			</section>
		</motion.div>
	);
}
