# サンプル・ビジネスプラットフォーム テンプレート

このリポジトリは、業務アプリやサービス開発を効率化するための「フルスタック開発テンプレート」です。
Node.js/Express/Prisma/PostgreSQLのバックエンドと、React/Vite/TailwindCSSのフロントエンドを組み合わせ、Dockerで一括起動できる構成になっています。

- このプロジェクトはMonorepo形式でFrontendとBackendの両方を含んだリポジトリとなっています。pnpmのワークスペース機能を使用し、一元的に管理しています。これにより、copilotによる自動化が促進され、一度のプロンプトでFrontendとBackendの両方をケアできるようになっています。

---

## 事前準備

このテンプレートを使うには、以下のソフトウェアが必要です。

- **Node.js（バージョン24系）**: JavaScript/TypeScriptを動かすための実行環境です。
- **pnpm**: Node.jsのパッケージ管理ツール。npmやyarnより速く、依存関係の管理がしやすいです。
- **Docker / Docker Compose**: "仮想のパソコン"を作り、DBやAPIサーバー、フロントエンドをまとめて起動・管理できます。開発環境と本番環境の差異を減らせます。

> Node.jsとpnpmは主にローカル開発やテスト時に使います。
> Dockerは、開発・本番問わずサービス全体を一括で動かすために使います。

---

### ESLint コード規約

このプロジェクトでは、JavaScript/TypeScriptのコード品質を保つためにESLintというツールを使っています。

- **書き方のルール**が決まっています。たとえば：
  - 使っていない変数や関数は警告が出ます。
  - `console.log`や`debugger`の使いすぎは注意されます。
  - 似た名前のプロパティを重複して書くとエラーになります。
  - 空っぽの`catch`以外の空ブロックは禁止です。
  - Reactのフック（useStateなど）は正しい使い方をしないとエラーになります。
  - import文の順番も自動で整えられます。
- **TypeScript**を使っているので、型の間違いも早めに気づけます。
- **Prettier**でコードの見た目（インデントやスペース）も自動で整います。

これらのルールは、誰が見ても同じ書き方で迷わず開発できるようにするためのものです。

---

## 特徴

- **Docker Composeによる一括起動**: `docker-compose up` だけでDB・API・フロントエンドが立ち上がります。
- **PostgreSQL + Prisma**: 本格的なデータベース(PostgreSQL)と、型安全なORM(Prisma)で開発効率と保守性を両立。
- **ExpressベースAPI**: Node.jsで人気のWebフレームワーク。API設計がしやすいです。
- **React + Viteフロントエンド**: モダンなUI設計と高速な開発体験。
- **認証・認可の雛形**: JWTによる認証機能を実装済み。ユーザー管理の土台になります。
- **国際化対応**: i18nextで多言語対応。日本語・英語など切り替え可能。
- **テスト・Lint・型チェック**: 品質担保のための設定済み。
- **E2E（エンドツーエンド）テスト**: フロントエンドにはPlaywrightを用いたE2Eテスト（`frontend/e2e/`配下）が実装されています。実際のブラウザ操作を自動化し、ユーザー視点での画面遷移・入力・多言語切替などの動作確認が可能です。コマンド例: `cd frontend && pnpm exec playwright test e2e`。テスト結果はHTMLレポートとして出力され、UI品質の担保やリグレッションチェックに活用できます。
- **API仕様自動生成**: swagger-jsdocでOpenAPI仕様を自動生成・管理。
- **型安全なバリデーション**: zodで入力値の検証も型安全に。
- **データ取得・状態管理**: react-queryでAPI通信・キャッシュ管理が簡単。

---

## ディレクトリ構成

- `backend/` ... Node.js/Express/Prisma バックエンド
- `frontend/` ... React/Vite フロントエンド
- `docker-compose.yml` ... サービス一括管理

---

## 開発を始めるには

### 前提

- [Docker](https://www.docker.com/) および [Docker Compose](https://docs.docker.com/compose/) がインストールされていること
- （推奨）[pnpm](https://pnpm.io/) がインストールされていること

### 起動手順

1. リポジトリをクローン

   ```sh
   git clone <このリポジトリのURL>
   cd sample_project
   ```

2. 依存関係のインストール（ローカル開発時）

   ```sh
   # ルートディレクトリで実行すると全パッケージの依存関係がインストールされます
   pnpm install:all
   ```

3. DB初期化 migrationとSeedingを実施します。
  
   ```sh
   #DB初期化
   pnpm db:reset
   ```

4. frontendとbackendのビルド

   ```sh
   pnpm build:all
   ```

   - 初回起動時は依存パッケージのインストールやDBマイグレーションが自動で行われます。

   ```sh
   # dockerの初期化、起動
   pnpm docker:reset:detach
   ```

5. フロントエンドのホットリロードを有効にする為、コンテナ起動を止めて、Frontendを直接起動する。(同様っｊ)

   ```sh
   # docker frontendの停止。
   docker stop frontend
   # ローカルで起動
   pnpm dev:frontend
   ```

6. アクセス

   - フロントエンド: [http://localhost:3000](http://localhost:3000)
   - バックエンドAPI: [http://localhost:3001/api](http://localhost:3001/api)
   - API仕様書: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
   - PostgreSQL: `localhost:5432`（ユーザー/パスワード: postgres/postgres）

### 開発Tips

- バックエンド/フロントエンドのコードはホットリロード対応です。
- モノレポ構成でも各パッケージは独立して動作可能です：
  - バックエンドのみを起動: `pnpm run dev:backend`
  - フロントエンドのみを起動: `pnpm run dev:frontend`
- DBスキーマ変更時は `backend/prisma` ディレクトリで `npx prisma migrate dev` などを利用してください。
- データベース操作が簡単に行えます：
  - DBリセット＋シードデータ投入: `pnpm run db:reset`
  - シードデータのみ投入: `pnpm run seed:all`
- テストは全パッケージで `pnpm run test:all` または各ディレクトリで `pnpm test` で実行できます。
- API関連の操作も簡単です：
  - OpenAPI仕様の生成: `pnpm run generate:api`
  - API仕様書をブラウザで確認: `pnpm run serve:api`

---

## カスタマイズ例

- ビジネスロジックやAPIエンドポイントの追加は `backend/src/` 配下へ。
- UIコンポーネントやページ追加は `frontend/src/` 配下へ。
- `.env` ファイルで環境変数を上書き可能です。

---

## 注意事項

- JWTシークレット等は本番運用時に必ず変更してください。
- このテンプレートは拡張・カスタマイズを前提としています。

---

## バックエンドAPI（OpenAPI仕様）について

このテンプレートのバックエンドAPIは、OpenAPI（Swagger）仕様で設計・ドキュメント化されています。

- `backend/openapi.json` にAPI仕様が記載されています。
- swagger-jsdocとJSDocコメントによりAPI仕様は自動生成・更新されます。
- ユーザー認証（JWT）、カテゴリ・投稿・コメント管理など、BBS（掲示板）機能のエンドポイントが含まれています。
- OpenAPI対応ツール（Swagger UI等）でAPIの動作確認やテストも可能です。
- 仕様変更時はJSDocコメントを必ず最新に保ってください。

### 主なエンドポイント例

- `/api/auth/register` : ユーザー登録
- `/api/auth/login` : ログイン
- `/api/categories` : カテゴリ一覧取得
- `/api/posts` : 投稿一覧取得・作成
- `/api/posts/{id}` : 投稿詳細取得・更新・削除
- `/api/posts/{id}/comments` : コメント追加

APIの詳細仕様やリクエスト/レスポンス例は `backend/openapi.json` をご参照ください。

---

## サンプル実装について

このテンプレートには、実際のビジネスアプリ開発の参考となるサンプル実装が含まれています。

### BBS（掲示板）サンプル

- バックエンド・フロントエンドともに、BBS（掲示板）機能のサンプル実装があります。
- 投稿・コメント・カテゴリ管理、ユーザー認証（JWT）など、実用的なAPI・画面構成を備えています。
- `backend/src/bbs/` や `frontend/src/pages/bbs/` 配下のコードを参考に、独自のビジネスロジックやUIを追加できます。
- このBBSサンプルの設計・構成・API設計（OpenAPI仕様）に習って、独自の業務アプリや新機能を追加してください。

### Step型入力フォームサンプル

- ユーザー情報や設定を段階的に入力する「ステップ入力」UIのサンプルも含まれています。
- `frontend/src/pages/steps/` 配下に、個人情報・設定・確認・完了などの画面遷移例があります。
- ステップごとにバリデーションや状態管理の例も実装されています。
- このサンプルを参考に、複数画面にまたがる業務フローやウィザード形式の入力画面を実装できます。

これらのサンプルをベースに、同様の構成・設計で新しいアプリや機能を追加してください。

---

## Monorepoの使い方

このプロジェクトは、pnpmのワークスペース機能を使用したmonorepoとして構成されています。フロントエンド（frontend）とバックエンド（backend）のパッケージが一つのリポジトリで管理され、共通の設定や依存関係を効率的に扱えるようになっています。

### 主要なコマンド

ルートディレクトリで以下のコマンドを実行することで、複数のパッケージを一括で操作できます。

```bash
# 全パッケージの開発サーバーを同時に起動
pnpm run dev:all

# フロントエンドのみ開発サーバーを起動
pnpm run dev:frontend

# バックエンドのみ開発サーバーを起動
pnpm run dev:backend

# 全パッケージをビルド
pnpm run build:all

# 全パッケージのテストを実行
pnpm run test:all

# データベースのリセットとシードデータ投入（バックエンドのコマンドを実行）
pnpm run db:reset

# シードデータのみ投入（マイグレーションなし）
pnpm run seed:all

# バックエンドのOpenAPI仕様を生成
pnpm run generate:api

# OpenAPI仕様をブラウザで表示
pnpm run serve:api

# Dockerコンテナをクリーンアップ（停止・削除・ボリューム削除）
pnpm run docker:clean

# Dockerコンテナをクリーンアップして再構築・起動
pnpm run docker:reset

# Dockerコンテナをクリーンアップして再構築・バックグラウンドで起動
pnpm run docker:reset:detach
```

### パッケージ間の依存関係

frontendとbackendはそれぞれ独立したパッケージとして管理されています。共通で使用するライブラリとしてはzodなどがありますが、それぞれのパッケージで独自に管理しています。特定のパッケージのみに依存関係を追加する場合は、そのディレクトリで以下のように実行します。

```bash
# フロントエンドに依存関係を追加
cd frontend
pnpm add <パッケージ名>

# バックエンドに依存関係を追加
cd backend
pnpm add <パッケージ名>
```

## Copilot Ruleについて

このプロジェクトでは、GitHub Copilotを活用した効率的な開発を想定し、命名規則・型安全・テスト・コミットルールなど、チーム開発・品質担保のためのルールを `COPILOT_RULES.md` にまとめています。

- 新しい機能やページを追加する際は、必ず `COPILOT_RULES.md` を参照し、ルールに従って実装してください。
- ルール例:
  - 命名規則やインデントの統一
  - 型安全な実装（any禁止、strictモード）
  - テストはMockやカバレッジ基準を遵守
  - JSDocやOpenAPI仕様の自動生成運用
  - 多言語化はi18next、バリデーションはzod、状態管理はreact-queryを利用
- ルールに沿うことで、誰が見ても分かりやすく、保守しやすいコードベースを維持できます。

---

このテンプレートとサンプル、Copilot Ruleを活用し、ビジネス要件に合わせたアプリ開発を効率的に進めてください。

---

## フロントエンドの便利なライブラリ・設定について

- **react-icons** : さまざまなアイコンを簡単に使えます。
  - 公式アイコン一覧: [https://react-icons.github.io/react-icons/](https://react-icons.github.io/react-icons/)
- **tailwindcss** : テーマカラーやフォントなどのデザイン設定が簡単。
  - 設定ファイル: `frontend/tailwind.config.ts`
- **react-responsive** : PC・スマホ両対応のレスポンシブUIが簡単に作れます。
- **react-query** : API通信やサーバーデータの取得・キャッシュ・更新管理を効率化。
- **zod** : 型安全かつ再利用性の高いバリデーションを実現。
- **i18next** : 全画面・全コンポーネントで多言語対応が可能。
  - 言語ファイルは `frontend/src/locales/` 配下に配置し、キー管理を統一しています。

---

## GitHub Actions ワークフローについて

このテンプレートには、Azure Container Apps への自動デプロイを行う GitHub Actions ワークフローが含まれています。

- プロジェクトが異なれば、リソースグループも異なるはずです。リソースグループ名適切な名前に変えましょう。
- ちゃんと名前は体を表す名前をつけてください。

- `.github/workflows/app-env-create.yml` :
  - Log Analytics Workspace と Container App Environment（例: `gdpf-app-env`）を一度だけ作成する専用ワークフローです。frontendやbackendが起動されれば実行されます。
  - Container App Environment名や Log Analytics Workspace名は、用途やプロジェクトに合わせて `app-env-create.yml` の `ENV_NAME` や `gdpf-app-law` を編集してください。

- `.github/workflows/backend-acr-container.yml`, `.github/workflows/frontend-acr-container.yml`, `.github/workflows/postgres-acr-container.yml` :
  - それぞれバックエンド・フロントエンド・Postgres用のビルド＆デプロイワークフローです。
  - デフォルトでは `gdpf-app-env` という Container App Environment 名を参照しています。
  - **Container App名（例: `gdpf-backend-app` など）や環境名を変更したい場合は、各ワークフロー内の `containerAppName` や `CA_GH_ACTION_CONTAINER_APP_ENVIRONMENT` の値を編集してください。**
  - pushやPR時の自動デプロイ設定は `on:` セクションで制御できます。

### カスタマイズ手順例

1. **Container App Environment名やLog Analytics Workspace名を変更したい場合**
   - `.github/workflows/app-env-create.yml` の `ENV_NAME` や `gdpf-app-law` を任意の名前に変更してください。
   - それに合わせて、各デプロイ用ワークフローの `CA_GH_ACTION_CONTAINER_APP_ENVIRONMENT` も同じ名前に揃えてください。

2. **Container App名を変更したい場合**
   - 各ワークフローの `containerAppName`（例: `gdpf-backend-app` など）を任意の名前に変更してください。

3. **自動デプロイのタイミングを変更したい場合**
   - `on:` セクションを編集し、`push` や `workflow_run` など、プロジェクト運用に合わせて調整してください。

---

## 環境ごとのPostgreSQL・環境変数の運用について

- **Dev環境**:
  - **Dev環境のみPostgresqlをContainer Appsで Deployを許可しています**  データのリセット等をやる目的で、独立したDB環境が必要という認識 Postgresql環境は純粋なPostgresql serverのみのインスタンスなので、push毎に自動でdeployはしてくれません。最初だけ手動でworkflowを実行する必要があります。
  - **Dev環境は夜間（20:00）に自動的にサービスが停止する運用となっています。 自前で起動するか、デプロイし直すまで、Dev環境は止まったままです。**
- **UAT/PRD環境（本番・受け入れ）**:
  - UAT/本番用のPostgreSQLサーバー（Azure Database for PostgreSQL等）を利用します。 多用なデータを扱っているので、データベースのリセット、テーブルの削除は出来ない環境と思ってください。バックアップからデータのリストアは出来ますが、他のUAT環境にも影響が出るので、カジュアルには実施できません。Dev環境で十分テストしてください。
  - UATは原則CPUやメモリーのサイズの違いはあれど、基本的な構成は本番と全く変わらない構成を取ってください。
  - UATは、本番と同じ様なデータを使い、本番で問題がないかを検証します。 本番で問題が見つかり、UATで再現を確認し、どの様な改修をすれば解決できるか等を検証する環境でもあります。
  - UATは顧客(納品先)が参照できる環境として活用します。 ある程度自由にデータの入力も許可されて、使用感を顧客が確認する環境です。

### 環境変数の管理

- **Azure Key Vault** を利用し、UAT/PRDなどの機密性の高い環境変数（DB接続情報やシークレット等）はKey Vaultに格納・管理しています。
- GitHub Actionsのデプロイ時には、Key Vaultから必要な値を取得し、Container Apps等の環境変数として安全に注入します。
- ローカル開発時は `.env` ファイルで上書き可能です。

---

### E2Eテスト実装者向けの注意・ベストプラクティス

- **テストは独立性を保つ**  
  各テストは他のテストの実行結果やデータに依存しないように設計してください。必要に応じてテスト前後でデータリセットやセットアップを行いましょう。

- **セレクタはid属性を使う**  
  画面要素の取得には`id`属性を優先して使い、UI変更に強いテストにしてください（`data-testid`は禁止）。

- **テストデータの管理**  
  テスト用ユーザーや投稿データは、事前にシードスクリプトで投入するか、テスト内で作成・削除するようにしてください。DBやAPIへの実書き込みはMockを活用し、必要最小限に。

- **タイミング依存を避ける**  
  固定待機は極力避け、`toBeVisible`や`toHaveText`などの明示的な状態待ちを使いましょう。

- **多言語・レスポンシブ対応**  
  i18nやモバイル/デスクトップ両方のUIでテストが通るか確認してください。

- **HTMLレポート活用**  
  テスト失敗時はPlaywrightのHTMLレポート（`pnpm exec playwright show-report`）で詳細な画面キャプチャやログを確認できます。

- **CI/CD連携**  
  E2EテストはGitHub Actions等のCI/CDでも自動実行されるため、ローカルと同じコマンドで再現できることを意識してください。

- **詳細なルールはCOPILOT_RULES.mdを参照**  
  命名規則やid属性の付与、test-id禁止など、プロジェクト独自のルールがあるため必ずCOPILOT_RULES.mdを確認してください。

---
