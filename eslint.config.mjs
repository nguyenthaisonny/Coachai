import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.config({
    extends: ['next'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      
      "no-unused-vars": "warn", // This will warn about unused variables
      "@typescript-eslint/no-unused-vars": "warn",
      "no-var": "warn"

    },
  }),
];

export default eslintConfig;
