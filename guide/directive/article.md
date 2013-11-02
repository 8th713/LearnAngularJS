## 役割
ディレクティブは以下の役割を果たすために使用されるものです。

* 宣言的な HTML の拡張（つまり HTML への機能追加）

ディレクティブは HTML に新たな振る舞いを与えたり DOM を変更したりします。

## 使う
HTML 内で普通にマークアップするだけです。
ディレクティブはタグや属性、クラス、コメントなどの方法で呼び出します。
ただし全てのディレクティブで全ての呼び出し方が使えるわけではありません。
実際には多くのディレクティブが属性としてしか呼び出せません。

```html
<div ng-app="App">
  <div ng-controller="MainCtrl">
    <h1 class="ng-bind: title"></h1>
    <button data-ng-click="say()">Click me!!</button>
    <ng-include="template"></ng-include>
  </div>
</div>
```

`ng-` を含むタグ名、属性名、データ属性名、クラス名は全て AngularJS のコアモジュールが提供しているディレクティブです。

各ディレクティブがどんな働きを HTML に追加したのか軽く触れます。

* ngApp
  * App モジュールを起動し子孫要素のテンプレートとディレクティブを解析します。
* ngController
  * ビューに MainCtrl コントローラをアタッチし子孫要素の式のコンテキストを MainCtrl の $scope と結びつけます。
* ngBind
  * $scope.title プロパティの値を自身の textContent に代入します。
* ngClick
  * 自身がクリックされると $scope.say 関数が実行されます。
* ngInclude
  * $scope.template プロパティの値の外部ファイルを読み込み自身の innerHTML に代入します。

HTML バリデータをパスするようにしたい場合 `data-` 接頭辞を付けて汎用データ属性としてマークアップすることが可能です。

## 作る
module インスタンスの directive メソッドでモジュールに新しいディレクティブを定義できます。

```javascript
module.directive('myDialog', [function () {
  return function (scope, $el, attrs) {
    $el.on('click', function () {
      window.alert('Hello ' + attrs.myDialog);
    });
  };
}]);
```

第一引数がディレクティブの名前になります。
第二引数はアノテーション配列です。

アノテーション配列の最後にはファクトリ関数を含めます。
ファクトリ関数が返すべきものはディレクティブの振る舞いを定義した関数(リンク関数)です。

ファクトリ関数はディレクティブがはじめて呼び出された時に一度だけ実行されます。
2回目以降のディレクティブ呼び出し時にはファクトリ関数は実行されません。

ディレクティブの名前はキャメルケースで指定します。
HTML 内ではハイフンケースで呼び出します。
上記の例では `<p my-dialog="world">Click me!!</p>` のように呼び出します。
要素をクリックすると属性値を受け取って アラートに 「Hallo world」と表示します。

上記は最も単純化された定義法でありより高度なディレクティブを作成する場合、ファクトリ関数はディレクティブ定義オブジェクトを返すようにします。

ディレクティブ定義オブジェクトについては [AngularJS: Directives](http://docs.angularjs.org/guide/directive) や [JavaScript - AngularJSのdirectiveとは - Qiita [キータ]](http://qiita.com/grapswiz@github/items/878432cb7e04039b06fb) を参考してください。

<div preview="article.examples.example"></div>
