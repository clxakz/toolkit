import { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type optionProps = {
	Icon: LucideIcon;
	label: string;
	description: string;
	badges: string[];
	children: ReactNode;
};

const badgeColors: Record<string, string> = {
	startup: "bg-blue-500 border-blue-600",
	performance: "bg-green-500 border-green-600",
};

export default function Option({ Icon, label, description, badges, children }: optionProps) {
	return (
		<div className="flex max-w-none flex-col gap-4 p-6 overflow-hidden prose border rounded-md shadow-md bg-card">
			<section className="flex items-center gap-1">
				<Icon className="text-primary shrink-0" />
				<h3>{label}</h3>

				<section className="ml-auto">{children}</section>
			</section>

			<p className="truncate text-wrap line-clamp-4">{description}</p>

			<section className="flex flex-wrap gap-1 mt-auto">
				{badges.map((badge, index) => (
					<Badge key={index} className={cn("text-white", badgeColors[badge])}>
						{badge}
					</Badge>
				))}
			</section>
		</div>
	);
}
