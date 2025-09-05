import Option from "@/components/option";
import { Switch } from "@/components/ui/switch";
import { useConfig } from "@/hooks/useConfig";
import { HardDrive, Network } from "lucide-react";

export default function Options() {
	const { config, toggleStartupOption } = useConfig();

	return (
		<div className="flex h-fit">
			<section className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto overflow-x-hidden">
				<Option
					Icon={HardDrive}
					label="Delete Temporary Files"
					description="Automatically removes temporary files at startup to free disk space and improve system performance."
					badges={["startup", "performance"]}
				>
					<Switch checked={config?.startupActions.includes("deleteTemp")} onCheckedChange={() => toggleStartupOption("deleteTemp")} />
				</Option>

				<Option
					Icon={Network}
					label="Flush DNS Cache"
					description="Automatically clears the system DNS cache to ensure the latest domain information is used, helping fix website loading issues or connectivity errors."
					badges={["startup", "network"]}
				>
					<Switch checked={config?.startupActions.includes("flushDns")} onCheckedChange={() => toggleStartupOption("flushDns")} />
				</Option>
			</section>
		</div>
	);
}
