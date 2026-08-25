資産管理 Webアプリ版

【内容】
index.html
manifest.webmanifest
sw.js
icon-192.png / icon-512.png
worker.js               Cloudflare Worker API
wrangler.toml.example   Worker設定例

【追加した機能】
1. 資産タブ右下に「☁ サーバー保存」ボタン
   初回タップ時に Worker URL と APIキーを入力します。
   以降はタップ1回で、資産・借入・借入先・返済状況・記録履歴などをまとめて保存します。
   ボタンを約0.9秒長押しすると接続設定を変更できます。

2. Webアプリ起動時
   API URL/キーが設定済みなら、サーバーに保存されたデータを自動取得します。
   端末内 localStorage もバックアップとして残ります。

3. 記録履歴
   日付部分を約0.65秒長押しすると削除確認が出ます。
   OKで、その日1件を削除します。

【Cloudflare側】
A. Workers & Pages → KV で Namespace を1つ作成
B. Workerを作り worker.js を貼り付け
C. Binding:
   Variable name: ASSET_STORE
   作成したKV Namespaceを指定
D. Worker Settings → Variables and Secrets
   API_KEY = 自分だけが分かる長い文字列（Secretにする）
   ALLOWED_ORIGIN = PagesのURL
   例: https://asset-manager.pages.dev
E. デプロイ

【Pages側】
index.html / manifest.webmanifest / sw.js / icon-192.png / icon-512.png
を同じプロジェクトへアップロードして公開します。

初回:
資産タブ → 右下「☁ サーバー保存」
→ Worker URL
例 https://asset-manager-api.xxxxx.workers.dev
→ API_KEYを入力

注意:
API_KEYはHTMLに埋め込まず、ブラウザのlocalStorageに保存します。
URLを他人に知られても、API_KEYが一致しなければサーバーデータは読めません。
