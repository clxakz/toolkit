import { ipcMain } from "electron";
import { config } from "../main";
import { ConfigSchema } from "@/shared/types";

export const handleIPC = (): void => {
	ipcMain.handle("get-config", (_event): ConfigSchema | null => {
		if (!config) return null;
		return config?.store as ConfigSchema;
	});

	ipcMain.on("save-config", (_event, _config: ConfigSchema): void => {
		if (!config) throw new Error("couldn't save config");
		config?.set(_config);
	});
};
