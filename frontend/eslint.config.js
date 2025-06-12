// eslint.config.js

// 必要なモジュールをインポート
import eslint from '@eslint/js';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import vitestGlobalsPlugin from 'eslint-plugin-vitest-globals';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 1. ESLint の推奨ルール (eslint:recommended)
  eslint.configs.recommended,

  // 2. TypeScript 関連の設定
  {
    // TypeScript, TSX ファイルに適用
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest', // es2021 を含む
        sourceType: 'module',
      },
      // browser, node, es2021 (latestに含まれる) 環境グローバル変数
      // vitest-globals は後述のプラグインで注入される
      globals: {
        browser: true,
        node: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      // plugin:@typescript-eslint/recommended のルールを適用
      // これはtsEslintPlugin.configs.recommended.rulesを展開することで実現
      ...tsEslintPlugin.configs.recommended.rules,
      // ユーザーが明示的に設定したTypeScript関連ルール
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      // 通常、TypeScriptを使用する場合はESLintのno-unused-varsは無効化し、@typescript-eslint/no-unused-varsを使用
      'no-unused-vars': 'off',
    },
  },

  // 3. React 関連の設定
  {
    // JavaScript, JSX, TypeScript, TSX ファイルに適用
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react': reactPlugin,
    },
    settings: {
      react: {
        version: 'detect', // "settings": {"react": {"version": "detect"}}
      },
    },
    rules: {
      // plugin:react/recommended のルールを適用
      ...reactPlugin.configs.recommended.rules,
      // ユーザーが明示的に設定したReact関連ルール
      'react/react-in-jsx-scope': 'off', // "react/react-in-jsx-scope": "off"
      'react/prop-types': 'off',          // "react/prop-types": "off"
    },
  },

  // 4. React Hooks 関連の設定
  {
    // JavaScript, JSX, TypeScript, TSX ファイルに適用
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // "react-hooks" プラグインの推奨ルール (recommended configは存在しないため手動で追加)
      'react-hooks/rules-of-hooks': 'error',     // "react-hooks/rules-of-hooks": "error"
      'react-hooks/exhaustive-deps': 'warn',    // "react-hooks/exhaustive-deps": "warn"
    },
  },

  // 5. Vitest Globals 関連の設定
  {
    // テストファイル（例: .test.ts, .spec.tsx）にのみ適用することが一般的
    // プロジェクトの命名規則に合わせてfilesを調整してください
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    plugins: {
      'vitest-globals': vitestGlobalsPlugin,
    },
    languageOptions: {
      globals: {
        // plugin:vitest-globals/recommended が提供するグローバル変数を注入
        ...vitestGlobalsPlugin.configs.recommended.globals,
      },
    },
    rules: {
      // plugin:vitest-globals/recommended のルールを適用
      ...vitestGlobalsPlugin.configs.recommended.rules,
    },
  },

  // 6. その他の共通ルール
  {
    // 全てのJavaScript/TypeScriptファイルに適用
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // ユーザーが明示的に設定したその他のルール
      'no-console': 'warn', // "no-console": "warn"
      'no-debugger': 'warn', // "no-debugger": "warn"
      'no-empty': [          // "no-empty": ["error", {"allowEmptyCatch": true}]
        'error',
        {
          'allowEmptyCatch': true
        }
      ],
      'no-dupe-keys': 'error', // "no-dupe-keys":"error"
      'sort-imports': ['warn', { // "sort-imports": [...]
        'ignoreCase': true,
        'ignoreDeclarationSort': true,
        'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
      }],
    },
  },

  // 7. Prettier との連携 (必ず最後に配置する)
  // Prettier と競合するESLintルールを無効化するために、他の設定の後に配置する必要があります
  prettierConfig,
];
