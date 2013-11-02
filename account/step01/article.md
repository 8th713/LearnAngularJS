アプリの作成にあたって最低限必要なものを準備します。

まず index.html と app.js を用意します。
作業はこの2つのファイルを編集して行います。

まず index.html を以下のように編集します。
```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>帳票アプリ</title>
</head>
<body ng-app="App">
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0-rc.3/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0-rc.3/angular-route.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

## フレームワークを読み込む
今回は安定版(v1.0.8)ではなく **RC 版(v1.2.0-rc.3)**を使用します。
ソースマップに対応しているので圧縮版で開発しても問題はありません。

アプリケーションのルーティングに必要な [angular-route.js](http://docs.angularjs.org/api/ngRoute) も読み込みます。
ルーティング機能は v1.0.8 ではコアモジュールに実装されていました。
v1.2.0 では本体から分離され独立したモジュールになったため追加で読み込みます。

本来は古い Internet Explorer の為にもう少し色々書く必要がありますが今回は省きます。
詳しくは[公式サイト](http://docs.angularjs.org/guide/ie)を読みましょう。

## モジュールを読み込む
body 要素に `ng-app="App"` を追加します。
この記述で AngularJS はこのページに App モジュールをロードするようになります。
しかしこの時点では App モジュールはまだ存在していないのでコンソールにエラーが出ます。

app.js を編集し App モジュールを作成しましょう。

```javascript
angular.module('App', ['ngRoute']);
```

App モジュール内でルーティング機能が使えるように [ngRoute](http://docs.angularjs.org/api/ngRoute) モジュールに依存することを明記します。
