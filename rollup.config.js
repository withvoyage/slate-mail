import postcssImport from "postcss-import";
import { dts } from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

import tailwindConfig from "./tailwind.config";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      peerDepsExternal(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      commonjs(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
  {
    input: "src/styles/index.css",
    plugins: [
      postcss({
        extensions: [".css"],
        minimize: true,
        extract: true,
        plugins: [postcssImport(), tailwindcss(tailwindConfig)],
      }),
    ],
    output: {
      file: "dist/styles/index.css",
    },
  },
];
