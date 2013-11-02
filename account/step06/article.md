前回のステップで後回しにした保存機能を実装しましょう。

## アプリケーション共通のデータを作成する
帳票の保存先である帳票リストは帳票一覧ページで必要なモデルです。
しかし帳票を作成するには注文明細行のリストが必要であり明細行リストは帳票作成ページのモデルです。
つまり、帳票リストは異なる2つのコントローラから参照できなければなりません。

コントローラをまたぐデータをサービスで実装しましょう。

```javascript
.service('sheets', [function () {
  this.list = []; // 帳票リスト

  // 明細行リストを受け取り新しい帳票を作成して帳票リストに加える
  this.add = function (lines) {
    this.list.push({
      id: String(this.list.length + 1),
      createdAt: Date.now(),
      lines: lines
    });
  };

  // 任意の id を持った帳票を返す
  this.get = function (id) {
    var list = this.list;
    var index = list.length;
    var sheet;

    while (index--) {
      sheet = list[index];
      if (sheet.id === id) {
        return sheet;
      }
    }
    return null;
  };
}])
```

帳票リストを保持する sheets サービスを実装しました。
SheetListController は sheets サービスの list プロパティを参照しモデルを作成できます。
CreationController は add メソッドを使用して明細行リストから帳票を作成し保存することができます。
SheetController は get メソッドを使用して任意の帳票を取得できます。

## サービスを使用する
帳票の保存先が決まったので CreationController を編集し save メソッドを完成させましょう。

save メソッドは現在の明細行リストから帳票を作成して保存しさらに、帳票一覧ページへ移動するように実装します。

```javascript
.controller('CreationController', ['$scope', '$location', 'sheets',
function CreationController($scope, $location, sheets) {
  // 省略

  $scope.save = function () {
    sheets.add($scope.lines);
    $location.path('/');
  };

  // 省略
}])
```

パスの変更は [$location サービス](http://docs.angularjs.org/api/ng.$location)を使用しますので $location サービスと sheets サービスが受け取れるように注釈をつけます。
sheet.add メソッドを利用し帳票を作成、$location.path メソッドで帳票一覧ページのパスに移動します。

さらに移動先の帳票一覧ページに作成した帳票が表示されるよう SheetListController と index-tmpl テンプレートを編集します。

```javascript
.controller('SheetListController', ['$scope', 'sheets',
function SheetListController($scope, sheets) {
  $scope.list = sheets.list; // 帳票リストモデル
}])
```

sheets.list を参照して帳票リストをモデル化します。

```html
<ul ng-show="list">
  <li ng-repeat="sheet in list">
    #{{ sheet.id }}
    {{ sheet.createdAt | date:'yyyy/MM/dd HH:mm' }}
    <a ng-href="#/sheet/{{ sheet.id }}">詳細を確認する</a>
  </li>
</ul>
<div ng-hide="list">
  帳票が存在しません。 <a href="#/new">新しい帳票を作る</a>
</div>
```

[ngRereat ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngRepeat)でリスト項目を反復します。
作成日時は読みやすいように [date フィルタ](http://docs.angularjs.org/api/ng.filter:date)で表示を加工しましょう。
リンクの URL は直接 href 属性にセットせず [ngHref ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngHref)を使用しましょう。
href 属性にテンプレート構文を使用した文字列をセットしてしまうと構文がパースされるまで意図しないアンカーが作成されてしまうなどの問題が生じます。

さらに帳票リストが空の時は帳票の作成を促すメッセージを表示するようにしましょう。
[ngHide ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngHide) を使用し帳票リストが存在していたら非表示になる要素を用意し、その中にメッセージと作成ページヘのリンクを表示しましょう。

ついでなので [ngShow ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngShow) ディレクティブも使用して リストが空の時 ul 要素が非表示になるようにしておきましょう。

<div preview="article.examples.example"></div>
