import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Existing demo navigation predates the API slice. Preserve those routes.
  {
    files: [
      "src/app/page.tsx",
      "src/app/client-brain/page.tsx",
      "src/app/mission-control/page.tsx",
    ],
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
];
export default config;
