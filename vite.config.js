import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { sites } from "@openai/sites-vite-plugin";

function staticWorker() {
  return {
    name: "static-worker",
    async closeBundle() {
      const serverDir = resolve("dist/server");
      const assetsDir = resolve("dist/assets");
      await mkdir(serverDir, { recursive: true });
      await mkdir(assetsDir, { recursive: true });
      await copyFile(
        resolve("assets/social-preview.png"),
        resolve(assetsDir, "social-preview.png"),
      );
      await writeFile(
        resolve(serverDir, "index.js"),
        "export default { fetch(request, env) { return env.ASSETS.fetch(request); } };\n",
      );
    },
  };
}

export default defineConfig({
  plugins: [sites(), staticWorker()],
});
