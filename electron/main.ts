import { app, BrowserWindow, nativeImage } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { handleIPC } from "./api/api";
import { startTray } from "./extra/tray";
import Store from "electron-store";
import { type ConfigSchema } from "@/shared/types";
import { handleStartup } from "./extra/startup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

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
		alwaysOnTop: true,
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

	config = new Store({
		defaults: {
			launchOnStartup: false,
			firstStart: true,
			startupActions: [""],
		},
	});

	config.onDidAnyChange((newval, oldval) => {
		// console.log("Config changed:", { oldval, newval });

		if (newval?.launchOnStartup !== oldval?.launchOnStartup) {
			app.setLoginItemSettings({
				openAtLogin: newval?.launchOnStartup,
				path: process.execPath,
			});
		}
	});

	if (config.store.firstStart) {
		createWindow();
		config.set("firstStart", false);
	}

	handleIPC();
	startTray();
	handleStartup();
});
