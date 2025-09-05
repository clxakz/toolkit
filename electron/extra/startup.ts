import { deleteTempFiles, flushDNS } from "./utils";
import { config } from "../main";
import { dialog } from "electron";

export const handleStartup = (): void => {
	if (!config) throw new Error("no config found");

	config.store.startupActions.forEach((action) => {
		switch (action) {
			case "deleteTemp":
				deleteTempFiles().catch((err) => dialog.showErrorBox("Error", err));
				break;
			case "flushDns":
				flushDNS().catch((err) => dialog.showErrorBox("Error", err));
				break;
		}
	});
};
