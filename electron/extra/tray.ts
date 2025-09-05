import { app, Menu, Tray } from "electron";
import { win, createWindow, appIcon } from "../main";

let tray: Tray | null = null;

export const startTray = (): void => {
	tray = new Tray(appIcon);

	const contextMenu = Menu.buildFromTemplate([
		{ label: "Open Settings", type: "normal", click: (): void => openWindow() },
		{ label: "Quit", type: "normal", click: (): void => app.quit() },
	]);

	tray.setToolTip("Toolkit");
	tray.setContextMenu(contextMenu);

	tray.on("click", (): void => openWindow());

	const openWindow = (): void => {
		if (!win) createWindow();
	};
};
