それぞれのビューに対するコントローラを準備しましょう。

## ルートにコントローラをセットする
テンプレートはまだ仮値を表示しているだけの状態です。
テンプレートはモデルを参照しデータを表示しなければなりません。

各ルートにコントローラをセットし任意のルート訪問時にそのルートのみで扱うモデルを定義できるようにしましょう。

### コントローラを準備する
ルート設定は3つなのでコントローラも3つ用意します。

```javascript
angular.module('App', ['ngRoute'])
.config([/* 省略 */])
.controller('SheetListController', [function SheetListController() {/* 一覧用 */}])
.controller('CreationController', [function CreationController() {/* 作成用 */}])
.controller('SheetController', [function SheetController() {/* 詳細用 */}]);
```

### ルートにコントローラをセットする
when メソッドに渡す設定オブジェクトを編集してルートで使用するコントローラを使用します。

```javascript
$routeProvider
  .when('/', {
    templateUrl: 'index-tmpl',
    controller: 'SheetListController'
  })
  .when('/new', {
    templateUrl: 'new-tmpl',
    controller: 'CreationController'
  })
  .when('/sheet/:id', {
    templateUrl: 'sheet-tmpl',
    controller: 'SheetController'
  })
```

設定オブジェクトの controller プロパティにルートで使用するコントローラの名前をセットします。
