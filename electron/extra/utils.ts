import { app, Notification } from "electron";
import path from "node:path";
import fs from "fs";
import { exec } from "node:child_process";
import { config } from "../main";

let totalDeletedBytes = 0;
export const deleteTempFiles = (): Promise<void> => {
	const homePath = app.getPath("home");

	const paths = [path.join(homePath, "AppData", "Local", "Temp"), path.join("C:", "Windows", "Temp"), path.join("C:", "Windows", "Prefetch")];

	totalDeletedBytes = 0;
	return new Promise((resolve, reject) => {
		try {
			paths.forEach((_path) => {
				try {
					wipeFolder(_path);
				} catch (err) {
					console.error("Failed to wipe folder:", _path, err);
				}
			});

			const totalMB = (totalDeletedBytes / (1024 * 1024)).toFixed(2);

			if (config?.store.notifications) {
				new Notification({
					title: "Temp Cleaner",
					body: `Deleted ${totalMB} MB from temp folders`,
				}).show();
			}

			resolve();
		} catch (error: any) {
			reject(error.message);
		}
	});
};

const wipeFolder = (folderPath: string) => {
	if (!fs.existsSync(folderPath)) return;

	fs.readdirSync(folderPath).forEach((item) => {
		const fullPath = path.join(folderPath, item);

		try {
			const stats = fs.lstatSync(fullPath);

			if (stats.isDirectory()) {
				wipeFolder(fullPath);

				try {
					fs.rmdirSync(fullPath);
				} catch {}
			} else {
				try {
					totalDeletedBytes += stats.size;
					fs.unlinkSync(fullPath);
				} catch {}
			}
		} catch {}
	});
};

export const flushDNS = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		exec("ipconfig /flushdns", (error, stdout, stderr) => {
			if (error) {
				reject(`Error flushing DNS: ${error.message}`);
				return;
			}
			if (stderr) {
				reject(`Error flushing DNS: ${stderr}`);
				return;
			}
			console.log(stdout);
			resolve();
		});
	});
};

export const toggleClassicContextMenu = (enable: boolean): Promise<void> => {
	const key = "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32";

	return new Promise<void>((resolve, reject) => {
		if (enable) {
			exec(`reg add "${key}" /f`, async (err) => {
				if (err) return reject(`Failed to create key: ${err}`);
				try {
					await restartExplorer();
					resolve();
				} catch (e) {
					reject(`Failed to restart Explorer: ${e}`);
				}
			});
		} else {
			exec(`reg delete "${key}" /f`, async (err) => {
				if (err) return reject(`Failed to delete key: ${err}`);
				try {
					await restartExplorer();
					resolve();
				} catch (e) {
					reject(`Failed to restart Explorer: ${e}`);
				}
			});
		}
	});
};

const restartExplorer = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		exec("taskkill /f /im explorer.exe && start explorer.exe", (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};
