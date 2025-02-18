import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import babel from "@rollup/plugin-babel";
import image from '@rollup/plugin-image';

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
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        browser: true,
      }),
      image(),
      babel({
        babelHelpers: "bundled",
        include: [
          "src/**",
          "node_modules/@intersect.mbo/intersectmbo.org-icons-set/**",
        ],
        presets: [
          "@babel/preset-env",
          "@babel/preset-typescript",
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      commonjs({
        include: "node_modules/**",
        exclude: ["node_modules/@babel/runtime/**"],
        transformMixedEsModules: true,
        strictRequires: true,
      }),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      terser(),
      postcss({ extract: true, inject: true, use: "sass" }),
      json(),
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [dts.default()],
    external: [/\.scss$/, /\.png$/],
  }
];