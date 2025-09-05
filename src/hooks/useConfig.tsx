import { ConfigSchema } from "@/shared/types";
import { atom, useAtom } from "jotai";

const configATOM = atom<ConfigSchema | null>(null);

export const useConfig = () => {
	const [config, setConfig] = useAtom(configATOM);

	const setOption = (key: keyof ConfigSchema, value: any): void => {
		setConfig((prev) => {
			if (!prev) return null;
			return { ...prev, [key]: value };
		});
	};

	const toggleStartupOption = (option: string): void => {
		setConfig((prev) => {
			if (!prev) return null;

			const current = prev.startupActions ?? [];
			const updated = current.includes(option) ? current.filter((item) => item !== option) : [...current, option];

			return { ...prev, startupActions: updated };
		});
	};

	return { config, setConfig, setOption, toggleStartupOption };
};
