/** @type {import('tailwindcss').Config} */

export default {

    content: ["./index.html", "./src/**/*.{js,jsx}"],

    theme: {
        extend: {
            colors: {
                // Base neutrals
                ink: {
                    DEFAULT: "#15161B",
                    soft: "#2A2C35",
                    muted: "#5B5D68",
                },

                paper: {
                    DEFAULT: "#F6F5F1",
                    raised: "#FFFFFF",
                    line: "#E5E3DB",
                },

                // Portal accents — each portal (customer/seller/admin) gets its own
                // accent drawn from the same hive-inspired palette, so colour itself
                // signals which part of the app you're in.
                gold: {
                    50: "#FBF3E2",
                    100: "#F5E2B8",
                    300: "#E8B94F",
                    500: "#D89A1F",
                    600: "#B87F16",
                    700: "#8F6210",
                },

                teal: {
                    50: "#E7F1EF",
                    100: "#C1DBD6",
                    300: "#5FA79A",
                    500: "#1F6F63",
                    600: "#175B51",
                    700: "#11463F",
                },

                plum: {
                    50: "#F1E7EE",
                    100: "#DABBD0",
                    300: "#8F4E7C",
                    500: "#63305A",
                    600: "#4E2547",
                    700: "#3A1B35",
                },

                danger: {
                    50: "#FBEAE8",
                    300: "#DE8A80",
                    500: "#C4453B",
                    600: "#A3372F",
                },

            },
            fontFamily: {
                display: ["\"Space Grotesk\"", "system-ui", "sans-serif"],
                body: ["\"Inter\"", "system-ui", "sans-serif"],
                mono: ["\"IBM Plex Mono\"", "ui-monospace", "monospace"],
            },
            boxShadow: {
                card: "0 1px 2px rgba(21, 22, 27, 0.06), 0 8px 24px -12px rgba(21, 22, 27, 0.12)",
                pop: "0 12px 32px -8px rgba(21, 22, 27, 0.22)",
            },
            backgroundImage: {
                hex: "radial-gradient(circle at 1px 1px, rgba(21,22,27,0.06) 1px, transparent 0)",
            },
        },
    },
    plugins: [],
};
