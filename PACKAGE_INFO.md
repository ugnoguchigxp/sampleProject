
---

## 🔧 **開発支援・ビルド・トランスパイル**

|パッケージ名|説明|
|---|---|
|`vite`|高速なフロントエンド開発ビルドツール。|
|`ts-node`|TypeScript ファイルを直接実行するツール。|
|`ts-jest`|Jest で TypeScript を使うためのトランスパイラ。|
|`tsx`|TypeScript 実行のための軽量ランナー。|
|`nodemon`|ファイル変更を監視し、サーバーを自動再起動。|
|`postcss` / `autoprefixer`|CSS にベンダープレフィックスなどを自動付加。|
|`tailwindcss`|ユーティリティファーストな CSS フレームワーク。|

---

## 🧪 **テスト・モック**

|パッケージ名|説明|
|---|---|
|`jest` / `@jest/globals` / `jest-environment-jsdom`|JavaScript テストフレームワークと環境。|
|`ts-jest`|TypeScript を Jest で扱うための設定。|
|`@testing-library/react` / `@testing-library/jest-dom` / `@testing-library/user-event`|React コンポーネントのテスト支援。|
|`supertest` / `@types/supertest`|Express アプリケーションの HTTP テスト。|
|`identity-obj-proxy`|CSS モジュールのモック用。|

---

## 🧹 **コード整形・静的解析・Lint**

|パッケージ名|説明|
|---|---|
|`eslint` / `eslint-config-prettier` / `eslint-plugin-react` / `eslint-plugin-import` / `eslint-plugin-react-hooks` / `eslint-plugin-react-refresh` / `eslint-plugin-vitest-globals`|コードスタイル・構文エラー検出のための Lint 関連パッケージ。|
|`@typescript-eslint/eslint-plugin` / `@typescript-eslint/parser`|TypeScript 用 ESLint プラグインとパーサ。|
|`lint-staged`|git commit 時にファイルに Lint をかけるツール。|

---

## 🧑‍💻 **型定義・補完**

|パッケージ名|説明|
|---|---|
|`@types/node` / `@types/react` / `@types/react-dom` / `@types/jest`|各種ライブラリの TypeScript 型定義。|
|`@types/express` / `@types/cors` / `@types/jsonwebtoken` / `@types/bcryptjs`|サーバー関連ライブラリの型定義。|
|`@types/swagger-jsdoc` / `@types/swagger-ui-express` / `@types/yamljs`|Swagger・YAML 関連の型。|

---

## 🌐 **バックエンド（Express, API）**

|パッケージ名|説明|
|---|---|
|`express`|Node.js 用 Web アプリケーションフレームワーク。|
|`cors`|CORS（クロスオリジンリクエスト）制御ミドルウェア。|
|`helmet`|セキュリティヘッダーの自動設定。|
|`dotenv`|`.env` ファイルから環境変数を読み込む。※2回定義あり|
|`jsonwebtoken` / `jwt-decode`|JWT の生成とデコード。|
|`bcryptjs`|パスワードのハッシュ化。|
|`@prisma/client` / `prisma`|DB クライアントと ORM（スキーマ駆動）ツール。|

---

## 📦 **API・データ通信**

|パッケージ名|説明|
|---|---|
|`axios`|HTTP リクエストライブラリ。|
|`@tanstack/react-query` / `react-query`|データフェッチング・キャッシュ・ステート管理。`react-query` は旧版。|

---

## 🧩 **フォーム管理・バリデーション**

|パッケージ名|説明|
|---|---|
|`react-hook-form`|React のフォーム管理ライブラリ。|
|`@hookform/resolvers`|`zod` や `yup` などのバリデーションライブラリと連携。|
|`zod`|スキーマバリデーションライブラリ。|

---

## 🌍 **国際化（i18n）**

|パッケージ名|説明|
|---|---|
|`i18next` / `react-i18next`|国際化（多言語対応）ライブラリ。|
|`i18next-browser-languagedetector`|ブラウザの言語設定を検出。|
|`i18next-http-backend`|翻訳ファイルを HTTP 経由で取得。|

---

## 🧩 **UI/UX・コンポーネント・アニメーション**

|パッケージ名|説明|
|---|---|
|`@heroicons/react`|Tailwind 対応の SVG アイコン。|
|`react-icons`|各種アイコンライブラリの集約。|
|`framer-motion`|アニメーションライブラリ。|
|`recharts`|グラフ描画ライブラリ。|
|`react-responsive`|レスポンシブ対応コンポーネント。|
|`react-dropzone`|ドラッグ & ドロップ式ファイルアップローダー。|

---

## 🧲 **DnD（ドラッグ＆ドロップ）**

|パッケージ名|説明|
|---|---|
|`@dnd-kit/core` / `@dnd-kit/sortable`|拡張性の高い DnD 機能を提供。ソート対応版も含む。|

---

## 📚 **ドキュメント自動生成（Swagger）**

|パッケージ名|説明|
|---|---|
|`swagger-jsdoc` / `swagger-ui-express`|OpenAPI 仕様から Swagger UI を生成。|
|`yamljs`|YAML 形式のファイル読み取りに使用。|

---
