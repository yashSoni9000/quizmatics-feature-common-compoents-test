import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setup.ts",
    },
    server: {
        open: true,
    },
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@images": path.resolve(__dirname, "./src/assets/images"),
            "@interfaces": path.resolve(__dirname, "src/ts/interfaces"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@constants": path.resolve(__dirname, "./src/constants"),
            "@context": path.resolve(__dirname, "./src/context"),
            "@layout": path.resolve(__dirname, "./src/layout"),
            "@routes": path.resolve(__dirname, "./src/routes"),
            "@styles": path.resolve(__dirname, "./src/styles"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@themes": path.resolve(__dirname, "/src/themes"),
            "@types": path.resolve(__dirname, "/src/ts/types"),
            "@test": path.resolve(__dirname, "./src/__test__"),
            "@utils": path.resolve(__dirname, "./src/utils"),
        },
    },
});
