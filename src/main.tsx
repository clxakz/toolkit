import "./assets/index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./layout";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./hooks/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme="system">
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
