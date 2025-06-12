// 必要なモジュールをインポート
import globals from "globals"; // 環境ごとのグローバル変数を定義
import js from "@eslint/js"; // ESLintの推奨設定
import typescriptPlugin from "@typescript-eslint/eslint-plugin"; // TypeScriptプラグイン
import typescriptParser from "@typescript-eslint/parser"; // TypeScriptパーサー
import prettierConfig from "eslint-config-prettier"; // Prettierとの競合ルールを無効化
import prettierPlugin from "eslint-plugin-prettier"; // PrettierルールをESLintに統合

export default [
  // 1. ESLintの推奨設定を適用
  js.configs.recommended,

  // 2. TypeScript関連の設定
  {
    // TypeScriptファイルにのみ適用
    files: ["**/*.{ts,cts,mts}"], // .ts, .cts, .mts (CommonJS/ES Modules for TypeScript)
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest", // 最新のECMAScriptバージョンをサポート
        sourceType: "module", // ESモジュールをサポート (Node.js環境でも'module'が推奨される場合が多い)
        // jsx: true はバックエンドでは不要なので削除
      },
      // Node.js環境のグローバル変数を設定
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      // TypeScript推奨ルールを適用
      ...typescriptPlugin.configs.recommended.rules,
      // ESLintの`no-unused-vars`はTypeScript版を使うため無効化
      "no-unused-vars": "off",
      // TypeScript版の`no-unused-vars`を設定
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // 3. JavaScriptファイル関連の設定 (バックエンドJavaScript用)
  {
    files: ["**/*.{js,cjs,mjs}"], // .js, .cjs, .mjs (CommonJS/ES Modules for JavaScript)
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      // Node.js環境のグローバル変数を設定
      globals: {
        ...globals.node,
      },
    },
  },

  // 4. Prettierとの競合解消と統合 (prettier-config-eslintは他のルールの後に配置)
  prettierConfig, // 他のプラグインとPrettierの競合するESLintルールを無効化
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "warn", // Prettierのフォーマットと異なる場合に警告
    },
  },

  // 5. 全てのファイルに適用されるカスタムルール
  {
    files: ["**/*.{js,jsx,ts,tsx,cjs,mjs,cts,mts}"], // すべてのコードファイルに適用
    rules: {
      "no-console": "warn", // console.logを警告
      "no-debugger": "warn", // debugger文を警告
      "no-empty": [
        "error",
        {
          allowEmptyCatch: true, // 空のcatchブロックを許可
        },
      ],
      "no-dupe-keys": "error", // オブジェクトリテラル内の重複キーを禁止
      "sort-imports": [
        "warn",
        {
          ignoreCase: true, // 大文字・小文字を区別しない
          ignoreDeclarationSort: true, // インポート宣言自体のソートは無視 (メンバーソートはする)
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"], // メンバーのソート順序
        },
      ],
    },
  },
];

