# Copilot 開発規約 (Development Rules)

> このファイルはGitHub Copilotに対する指示として機能します。
> コードを生成する際は必ず以下のルールに従ってください。

## 目次

1. [最重要ルール](#1-最重要ルール-critical-rules)
2. [コーディングスタイル](#2-コーディングスタイル-coding-style)
3. [テスト規約](#3-テスト規約-testing-standards)
4. [フロントエンド実装ルール](#4-フロントエンド実装ルール-frontend-implementation-rules)
5. [バックエンドAPI設計ルール](#5-バックエンドapi設計ルール-backend-api-design-rules)
6. [セキュリティとパフォーマンス](#6-セキュリティとパフォーマンス-security--performance)
7. [ドキュメントと多言語化](#7-ドキュメントと多言語化-documentation--internationalization)
8. [開発フローとGit管理](#8-開発フローとgit管理-development-flow--git-management)
9. [開発ツールと環境設定](#9-開発ツールと環境設定-development-tools--environment)
10. [バックエンドAPI設計における追加ルール](#10-バックエンドapi設計における追加ルール-additional-backend-api-design-rules)
11. [まとめと重要事項](#11-まとめと重要事項-summary--important-points)

## 1. 最重要ルール (Critical Rules)

- **言語**: レスポンスは日本語で返すこと
- **型安全性**: TypeScriptでは型/インターフェース必須、`any`禁止（代わりに`unknown`を使用）
- **コード品質**: 生成コードはセキュリティ、パフォーマンス、可読性を確保すること
- **テスト対応**: 生成されたコードは80%以上のカバレッジでテスト可能な設計にすること
- **コンポーネントID**: テスト可能性のため、UIコンポーネントには必ず`id`属性を設定すること

## 2. コーディングスタイル (Coding Style)

### フロントエンド (React/TypeScript)

- 以下のサンプルコードのコメントが、実際の守るべきルールです。

```typescript
// ファイル名: UserProfile.tsx (PascalCase)
import React, { useState, useEffect } from 'react'; // 1. React/サードパーティライブラリ
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/common'; // 2. 絶対パス
import { fetchUserData } from '../api/user'; // 3. 相対パス
import './UserProfile.css'; // 4. スタイル

// インターフェース名には 'I' 接頭辞をつける
interface IUser {
  id: number;
  name: string;
  email: string;
}

// 関数名はcamelCase、コンポーネントにはidを設定する
export const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const [displayName, setDisplayName] = useState<string>(''); // 変数名はcamelCase
  
  // 非同期処理にはtry/catchを使用
  const { data, isLoading, error } = useQuery<IUser, Error>(
    ['user', userId],
    async () => {
      try {
        return await fetchUserData(userId);
      } catch (err) {
        console.error('Failed to fetch user data');
        throw err;
      }
    }
  );

  return (
    <div id="user-profile-container" className="profile-container">
      {isLoading ? (
        <div id="user-profile-loading">Loading...</div>
      ) : error ? (
        <div id="user-profile-error">Error loading profile</div>
      ) : (
        <>
          <h1 id="user-profile-name">{data?.name}</h1>
          <p id="user-profile-email">{data?.email}</p>
        </>
      )}
    </div>
  );
};
```

### バックエンド (Node.js/TypeScript)

- 以下のサンプルコードのコメントが、実際の守るべきルールです。

```typescript
// ファイル名: user-controller.ts (kebab-case)
import { Request, Response } from 'express';
// zodを使ってValidationを組んでください
import { z } from 'zod';
import prisma from '../../prisma-client';

// クラス名はPascalCase
export class UserController {
  // 関数名はcamelCase
  /**
   * Get user by ID
   * @param req Request with user ID
   * @param res Response with user data
   */
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      
      // データ取得とエラーハンドリング
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
        }
      });
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

### 共通ルール

- **行長**: 100文字以内
- **インデント**: 2スペース
- **strictモード**: 必ず有効化すること

## 3. テスト規約 (Testing Standards)

- **テストファイル配置**: `Test/[用途]/[ファイル名].test.ts` 形式で配置
- **カバレッジ**: 機能がほぼ無く、HTMLを表示するだけのページは不要, snapshotを取って合っているかを検証するタイプのテストは省略,機能がちゃんとある部分は80％のカバレッジを目指してください。
- **言語**: テスト名とコメントは英語で記述（例: `describe('User authentication', () => {...})`）
- **ランダム値の検証**: UUIDやランダム文字列など、理由があってランダム化している部分はテスト対象外とする
- **コンポーネントテスト**: コンポーネントには必ずid属性を設定し、そのidでテスト時に要素を取得すること
- **APIとDB操作**: Mockを使用してテストを行い、実際に書き込まないこと
- **元コードの変更**: テストコードを通すためだけに元コードを編集してはいけない（例外: コンポーネントへのid追加）

```typescript
// src/Test/component/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import { UserProfile } from '@/components/UserProfile';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

// useQueryをモック化
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn()
}));

/**
 * Tests for UserProfile component
 */
describe('UserProfile component', () => {
  const queryClient = new QueryClient();
  
  it('should display user data when loaded', async () => {
    // Arrange
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    
    // useQueryのモックで戻り値を設定
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    });
    
    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId={1} />
      </QueryClientProvider>
    );
    
    // Assert
    expect(screen.getByTestId('user-profile-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-profile-email')).toHaveTextContent('test@example.com');
  });
});
```

### APIとDB操作のMock例

```typescript
// src/Test/api/users.test.ts
import request from 'supertest';
import app from '../../index';
import prisma from '../../prismaClient';

jest.mock('../../prismaClient');

describe('GET /api/users/:id', () => {
  it('should return user data for existing user', async () => {
    // Arrange
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    prisma.user.findUnique.mockResolvedValue(mockUser);
    
    // Act
    const res = await request(app).get('/api/users/1');
    
    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUser);
  });
  
  it('should return 404 for non-existing user', async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue(null);
    
    // Act
    const res = await request(app).get('/api/users/999');
    
    // Assert
    expect(res.statusCode).toBe(404);
  });
});
```

## 4. フロントエンド実装ルール (Frontend Implementation Rules)

- **レスポンシブ対応**: `react-responsive` を使用し、モバイルファーストで実装する
- **フォーム実装**: `react-hook-form` + `zod` での実装を基本とする
- **状態管理**: `react-query` を使用したサーバー状態管理を優先する
- **多言語対応**: `i18next` を使用し、全ての文字列はハードコーディングせず翻訳キーを使用する

```typescript
// フォーム実装例
import { useForm } from 'react-hook-form';
// zodを使ってvalidationを行う
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';

// zodスキーマ定義
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });
  
  const onSubmit = (data: LoginForm) => {
    // フォームデータの送信処理
  };
  
  return (
    <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className={isMobile ? 'form-group-mobile' : 'form-group'}>
        <label htmlFor="email">{t('login.emailLabel')}</label>
        <input id="email-input" {...register('email')} />
        {errors.email && <span id="email-error">{errors.email.message}</span>}
      </div>
      
      <div className={isMobile ? 'form-group-mobile' : 'form-group'}>
        <label htmlFor="password">{t('login.passwordLabel')}</label>
        <input id="password-input" type="password" {...register('password')} />
        {errors.password && <span id="password-error">{errors.password.message}</span>}
      </div>
      
      <button id="login-button" type="submit">{t('login.submitButton')}</button>
    </form>
  );
};
```

## 5. バックエンドAPI設計ルール (Backend API Design Rules)

- **OpenAPI準拠**: 全APIはOpenAPI仕様に従い、JSDocコメントで仕様を記述する
- **データベース**: Prisma Clientを使用し、トランザクションとエラーハンドリングを徹底する
- **入力検証**: zodによる厳密な入力検証を行う
- **環境変数**: 機密情報は必ず環境変数で管理する

```typescript
// OpenAPI JSDocコメント例
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first post
 *               content:
 *                 type: string
 *                 example: This is the content of my post
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/api/posts', authenticateUser, async (req: Request, res: Response) => {
  try {
    // 入力検証
    const postSchema = z.object({
      title: z.string().min(1, 'Title cannot be empty').max(100),
      content: z.string().min(1, 'Content cannot be empty'),
    });
    
    const validationResult = postSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.format() });
    }
    
    const { title, content } = validationResult.data;
    
    // Prismaを使用したDB操作
    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: req.user.id,
      },
    });
    
    return res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
```

## 6. セキュリティとパフォーマンス (Security & Performance)

### セキュリティ対策

- **入力検証**: すべてのユーザー入力は検証してからDB操作やAPI呼び出しを行う
- **認証**: JWT/OAuthを適切に実装し、適切な権限チェックを行う
- **OWASP対策**: XSS、CSRF、SQLインジェクションなどの脆弱性対策を徹底する
- **依存関係**: 依存関係を定期的に更新し、セキュリティパッチを適用する

### パフォーマンス最適化

- **DBクエリ最適化**: N+1問題を避け、必要なデータのみを取得する
- **キャッシュ活用**: react-queryのキャッシュ機能を活用する
- **バンドルサイズ縮小**: コード分割や不要なライブラリの削除を行う
- **遅延ロード**: 必要なコンポーネントのみ初期ロードし、残りは遅延ロードする
- **アセット圧縮**: 画像や静的ファイルの最適化を行う

## 7. ドキュメントと多言語化 (Documentation & Internationalization)

### ドキュメント規約

- **API仕様**: OpenAPI形式を使用し、常に最新の状態を保つ
- **Markdown**: markdownLint準拠の書式を守る
- **関数コメント**: すべての関数定義には英語でJSDoc形式のコメントを記載する（無名関数は例外）
- **環境設定**: `README.md`や`.env.example`を常に最新に保つ

### 多言語対応規約

```typescript
// 多言語化の実装例
import { useTranslation } from 'react-i18next';

export const WelcomeMessage: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // 言語切り替え関数
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div id="welcome-container">
      <h1 id="welcome-title">{t('welcome.title')}</h1>
      <p id="welcome-message">{t('welcome.message')}</p>
      
      <div id="language-buttons">
        <button onClick={() => changeLanguage('ja')}>日本語</button>
        <button onClick={() => changeLanguage('en')}>English</button>
      </div>
    </div>
  );
};
```

- **実装方法**: 必ず `i18next` を使用する
- **ファイル命名**: 言語ファイルは `[locale].json` 形式（例: `ja.json`, `en.json`）で作成
- **対応言語**: en, ja, cn, kr, de, fr, pt, es, nl
- **キー管理**: 各言語ファイルのキー構造を統一し、翻訳漏れを防ぐ
- **文字列埋め込み禁止**: UIのテキストは必ず翻訳キーを通して表示する

## 8. 開発フローとGit管理 (Development Flow & Git Management)

### ブランチ戦略

```text
main (本番) ←── release/v1.0 ←── develop (統合) ←── feature/login (機能開発)
                                      ↖── fix/auth-bug (バグ修正)
```

- **`main`**: 本番環境用コード（直接コミット禁止）
- **`develop`**: 開発統合ブランチ
- **`feature/[name]`**: 機能開発用ブランチ
- **`fix/[desc]`**: バグ修正用ブランチ
- **`release/[ver]`**: リリース準備用ブランチ

### コミットとPR規約

- **コミットメッセージ**: Conventional Commits形式を使用

  ```text
  feat: ユーザー認証機能の実装
  fix: ログイン時のバリデーションエラーを修正
  docs: APIドキュメントの更新
  refactor: ユーザー処理のリファクタリング
  ```

- **PRプロセス**:
  1. セルフレビューを実施
  2. CIテストの通過を確認
  3. 関連ドキュメントの更新
  4. コードオーナーによるレビュー

## 9. 開発ツールと環境設定 (Development Tools & Environment)

- **リンター**: ESLint & Prettierを使用し、コードスタイルを統一する
- **エディタ設定**: VSCode用の`.editorconfig`と`.vscode`設定を共有する
- **環境変数**: `.env.example`を用意し、必要な環境変数を明示する
- **パッケージ管理**: pnpmを使用し、バージョン固定を行う

### ツール設定ファイル例

#### ESLint設定例 (.eslintrc.js)

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

#### Prettier設定例 (.prettierrc)

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### EditorConfig設定例 (.editorconfig)

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 100
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

## 10. バックエンドAPI設計における追加ルール (Additional Backend API Design Rules)

- **OpenAPI仕様の遵守**: バックエンドAPIはOpenAPI（Swagger）仕様に従って設計・実装すること
- **JSDocコメント**: このプロジェクトでは `swagger-jsdoc` を利用してAPIドキュメント（openapi.json）を自動生成している
- **ドキュメント更新**: エンドポイントやモデルのJSDocコメントはswagger-jsdocの記法に従い、必ず最新の状態を保つこと
- **一貫性**: OpenAPI仕様に基づき、リクエスト・レスポンス・エラー・認証情報などを明確に記述すること

## 11. まとめと重要事項 (Summary & Important Points)

- **コードレビュー**: すべての生成コードはセキュリティ、パフォーマンス、可読性の観点からレビューすること
- **テスト**: 自動テストでカバレッジ80%以上を確保すること
- **ドキュメント**: コードとともにドキュメントも更新すること
- **セキュリティ**: OWASP Top 10の脆弱性対策を常に意識すること
- **言語**: Copilotのレスポンスは日本語で返すこと

---
