import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    ignores: ['dist/', 'node_modules/', 'coverage/'],
  },
  {
    files: ['test/cjs-smoke.cjs'],
    languageOptions: {
      globals: {
        require: 'readonly',
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
