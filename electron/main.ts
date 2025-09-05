import { app, BrowserWindow, dialog, MessageBoxOptions, nativeImage } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { handleIPC } from "./api/api";
import { startTray } from "./extra/tray";
import Store from "electron-store";
import { type ConfigSchema } from "@/shared/types";
import { handleStartup } from "./extra/startup";
import { autoUpdater, UpdateDownloadedEvent } from "electron-updater";
import log from "electron-log";
import { toggleClassicContextMenu } from "./extra/utils";

process.on("uncaughtException", (error) => {
	log.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason) => {
	log.error("Unhandled Rejection:", reason);
});

log.transports.file.level = "info";
autoUpdater.logger = log;
autoUpdater.autoDownload = true;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

const isDev = !app.isPackaged;
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

export let win: BrowserWindow | null;
export const appIcon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, "icon.ico"));

export const createWindow = (): void => {
	win = new BrowserWindow({
		icon: appIcon,
		title: "Toolkit",
		alwaysOnTop: isDev,
		skipTaskbar: true,
		maximizable: false,
		minimizable: false,
		width: 900,
		height: 600,

		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
		win.webContents.openDevTools({ mode: "detach" });
	} else {
		win.loadFile(path.join(RENDERER_DIST, "index.html"));
	}

	win.setMenu(null);
};

app.on("window-all-closed", () => {
	win = null;
});

export let config: Store<ConfigSchema> | null = null;
app.whenReady().then(() => {
	app.setAppUserModelId("com.clxakz.toolkit");

	handleConfig();
	handleIPC();
	startTray();
	handleStartup();
	handleUpdate();
});

const handleConfig = (): void => {
	config = new Store({
		defaults: {
			launchOnStartup: false,
			firstStart: true,
			startupActions: [""],
			classicContextMenu: false,
		},
	});

	config.onDidAnyChange((newval, oldval) => {
		// console.log("Config changed:", { oldval, newval });
		if (!newval || !oldval) return;

		if (newval.launchOnStartup !== oldval.launchOnStartup) {
			app.setLoginItemSettings({
				openAtLogin: newval?.launchOnStartup,
				path: process.execPath,
			});
		}

		if (newval.classicContextMenu !== oldval.classicContextMenu) {
			toggleClassicContextMenu(newval.classicContextMenu).catch((err) => dialog.showErrorBox("Failed to toggle classic context menu", err));
		}
	});

	if (config.store.firstStart) {
		createWindow();
		config.set("firstStart", false);
	}
};

const handleUpdate = (): void => {
	autoUpdater.checkForUpdates();

	autoUpdater.on("update-available", () => {
		log.info("Update available, downloading in background...");
	});

	autoUpdater.on("update-downloaded", (info: UpdateDownloadedEvent) => {
		const releaseName = info.releaseName;

		const dialogOpts: MessageBoxOptions = {
			type: "info",
			buttons: ["Install and Restart", "Later"],
			title: "Update Ready",
			message: "A new version has been downloaded.",
			detail: `Version ${releaseName} is ready to install. Do you want to restart now?`,
		};

		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) {
				autoUpdater.quitAndInstall();
			}
		});
	});

	autoUpdater.on("error", (err) => {
		log.error("Update error:", err);
	});
};
