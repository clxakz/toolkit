import { Loader } from "lucide-react";

export default function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center flex-1">
			<Loader className="animate-spin" />
		</div>
	);
}
