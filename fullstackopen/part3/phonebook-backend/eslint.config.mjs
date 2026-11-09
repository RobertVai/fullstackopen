import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'frontend/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single', { avoidEscape: true }],
    },
  },
]
