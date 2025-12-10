# メッセージフォーム

可愛いアニメーション付きのメッセージフォームです。送信された内容は即座にGmailに転送されます。

## 📁 ファイル構成

- `index.html` - メインHTMLファイル
- `style.css` - スタイルシート
- `script.js` - JavaScript（フォーム送信、アニメーション）

## 🚀 セットアップ手順

### 1. Googleドライブの画像を設定

1. Googleドライブに画像をアップロード
2. 画像を右クリック → 「共有」→ 「リンクを知っている全員」に変更
3. 共有リンクをコピー（例: `https://drive.google.com/file/d/XXXXX/view?usp=sharing`）
4. リンクを以下の形式に変換:
   ```
   https://drive.google.com/uc?export=view&id=XXXXX
   ```
5. `index.html` の以下の部分を編集:
   ```html
   <img src="YOUR_GOOGLE_DRIVE_IMAGE_URL_1" alt="キャラクター1" class="character-img">
   <img src="YOUR_GOOGLE_DRIVE_IMAGE_URL_2" alt="キャラクター2" class="character-img">
   ```

### 2. Gmail送信を設定

#### 方法A: FormSubmit（簡単・無料）

1. `script.js` の `RECIPIENT_EMAIL` を変更:
   ```javascript
   const RECIPIENT_EMAIL = 'your-email@gmail.com';
   ```

2. 初回送信時、FormSubmitから認証メールが届くので、リンクをクリックして認証

#### 方法B: EmailJS（推奨・より高機能）

1. [EmailJS](https://www.emailjs.com/) でアカウント作成（無料）
2. Gmailサービスを接続
3. メールテンプレートを作成
4. `script.js` のコメントアウトされた部分を有効化し、設定を入力:
   ```javascript
   const SERVICE_ID = 'your_service_id';
   const TEMPLATE_ID = 'your_template_id';
   const USER_ID = 'your_user_id';
   ```
5. HTMLに以下のスクリプトを追加:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```

### 3. ファイルを開く

ブラウザで `index.html` を開くだけで動作します！

## ✨ 機能

- タイピングアニメーション
- フェードインアニメーション
- レスポンシブデザイン
- Gmail即時送信
- プレゼント画像ダウンロード
- エラーハンドリング

## 🎨 カスタマイズ

### 色を変更

`style.css` の以下の部分を編集:

```css
/* メインカラー */
#FF69B4 → お好みの色

/* 背景グラデーション */
background: linear-gradient(135deg, #FFF5F7 0%, #FFE4E8 100%);
```

### テキストを変更

`script.js` の以下の部分を編集:

```javascript
const TYPING_TEXT = 'お兄ちゃん♡'; // タイピングテキスト
const TYPING_SPEED = 150; // タイピング速度（ミリ秒）
```

## 📝 注意事項

- FormSubmitは初回送信時にメール認証が必要です
- Googleドライブの画像は「リンクを知っている全員」に共有設定してください
- EmailJSは月200通まで無料です

## 🔧 トラブルシューティング

### 画像が表示されない
- Googleドライブの共有設定を確認
- URLが正しい形式か確認（`uc?export=view&id=`）

### メールが届かない
- FormSubmitの認証メールを確認
- スパムフォルダを確認
- EmailJSの設定を確認

### アニメーションが動かない
- ブラウザのキャッシュをクリア
- JavaScriptが有効か確認

## 📧 サポート

問題が発生した場合は、ブラウザのコンソール（F12）でエラーを確認してください。
