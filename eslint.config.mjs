import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "tsconfig.tsbuildinfo",
      "backend/storage/**",
      "design-system/**"
    ]
  }
];

export default eslintConfig;
