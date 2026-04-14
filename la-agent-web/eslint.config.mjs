// eslint.config.mjs
import antfu from '@antfu/eslint-config';

export default antfu(
  {
    stylistic: {
      indent: 2, // 4, or 'tab'
      quotes: 'single', // or 'double'
      semi: true,
    },
    vue: true,
    react: true,
    typescript: true,
    formatters: {
      /**
       * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
       * By default uses Prettier
       */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
      /**
       * Format Markdown files
       * Supports Prettier and dprint
       * By default uses Prettier
       */
      markdown: 'prettier',
    },
  },
  {
    rules: {
      'no-console': 'off',
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'antfu/top-level-function': 'off',
      'vue/jsx-uses-vars': 'error',
      'no-use-before-define': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react-hooks-extra/no-unnecessary-use-prefix': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'no-unmodified-loop-condition': 'off',
      'style/max-len': [
        'error',
        {
          code: 120,
          ignorePattern: '^\\s*import\\s+',
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      'ts/no-unsafe-function-type': 'off',
      'ts/no-require-imports': 'off',
      'react/no-create-ref': 'off',
    },
  },
);
