import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import babel from "@rollup/plugin-babel";

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
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react', '@babel/preset-typescript'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      commonjs({
        include: 'node_modules/**',
        transformMixedEsModules: true,
        strictRequires: true
      }),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      terser(),
      postcss({ extract: true, inject: true, use: "sass" }),
      json(),
    ],
    external: [
      "react", 
      "react-dom", 
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "react-router-dom",
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [dts.default()],
    external: [/\.scss$/],
  },
];