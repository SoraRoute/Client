import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import AppProviders from "./context/AppProviders";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AppProviders>
                <App />
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: "#15161B",
                            color: "#F6F5F1",
                            fontSize: "14px",
                            borderRadius: "12px",
                        },
                        success: { iconTheme: { primary: "#D89A1F", secondary: "#15161B" } },
                        error: { iconTheme: { primary: "#C4453B", secondary: "#F6F5F1" } },
                    }}
                />
            </AppProviders>
        </BrowserRouter>
    </StrictMode>,
);
