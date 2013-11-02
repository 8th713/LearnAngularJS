前回のステップまででルート訪問時に使用されるテンプレートとコントローラの準備が整いました。

次は CreationController を編集して帳票作成ページで必要なモデルを定義していきましょう。

## 帳票作成ページで必要なものをおさらいする
実装を始める前に必要なものを再確認しましょう。

* データ
  * 注文明細行のリスト
  * 個別の注文明細行 - リストの要素
* ビジネスロジック
  * 任意の明細行から小計を計算する機能
  * リストモデル内の明細行の合計金額を計算する機能
  * リストモデルに新しい明細行を追加する機能
  * 任意の明細行をリストモデルから取り除く機能
  * リストモデルを初期化する機能
  * リストモデルから帳票モデルを作成して保存する機能

## データを準備する
まずデータの準備から始めましょう。

```javascript
.controller('CreationController', ['$scope', function CreationController($scope) {
  // 新しい明細行を作成する
  function createOrderLine() {
    return {
      productName: '',
      unitPrice: 0,
      count: 0
    };
  }

  $scope.lines = [createOrderLine()]; // 明細行リスト
}])
```

モデルは $scope オブジェクトのプロパティとして定義する必要があるので依存の注釈付けを行いコンストラクタが $scope オブジェクトを受け取れるようにします。

明細行は行を追加する処理などで作成される必要があるので createOrderLine 関数を準備しておきます。
新しい明細行が必要なときはこの関数を実行して取得することにします。

明細行リストは初期状態で明細行を一つ持っているようにしたいので createOrderLine 関数を使って配列にひとつ要素を加えておきます。

## データを表示する
テンプレートを編集して lines モデルが表示されるようにしましょう。

```html
<tr ng-repeat="orderLine in lines">
  <td><input type="text"   ng-model="orderLine.productName"></td>
  <td><input type="number" ng-model="orderLine.unitPrice"></td>
  <td><input type="number" ng-model="orderLine.count"></td>
  <td>n,nnn</td>
  <td><button type="button">削除</button></td>
</tr>
```

[ngRepeat ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngRepeat)を使い tr 要素を lines モデルの長さ分だけ反復させます。
各 input 要素と明細行のプロパティが双方向に結びつくよう [ngModel ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngModel)を使用します。

## 振る舞いを加える
リストに行を追加する機能や任意の行を削除する機能などの振る舞いを実装しビューから呼び出してみましょう。

```javascript
// リストモデルに新しい明細行を追加する
$scope.addLine = function () {
  $scope.lines.push(createOrderLine());
};

// リストモデルを初期化する
$scope.initialize = function () {
  $scope.lines = [createOrderLine()];
};

// リストモデルから帳票モデルを作成して保存
$scope.save = function () {};

// 任意の明細行をリストモデルから取り除く
$scope.removeLine = function (target) {
  var lines = $scope.lines;
  var index = lines.indexOf(target);

  if (index !==  -1) {
    lines.splice(index, 1);
  }
};
```

save メソッドについてはまだ帳票の保存先を用意していないため、後回しにしておきます。

テンプレートも合わせて編集しましょう。

```html
<button type="button" ng-click="addLine()">明細行を追加</button>
<button type="button" ng-click="initialize()">帳票を初期化</button>
```
```html
<td><button type="button" ng-click="removeLine(orderLine)">削除</button></td>
```

button 要素に対して [ngClick ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngClick)を使い振る舞いを実行するようにします。

```html
<form ng-submit="save()">
```

form 要素には [ngSubmit ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngSubmit)を使用します。

## 小計、合計を表示する
小計と合計を算出し出力されるようにしましょう。

```javascript
// 引数から小計を計算して返す
$scope.getSubtotal = function (orderLine) {
  return orderLine.unitPrice * orderLine.count;
};

// リストから合計金額を計算して返す
$scope.getTotalAmount = function (lines) {
  var totalAmount = 0;

  angular.forEach(lines, function (orderLine) {
    totalAmount += $scope.getSubtotal(orderLine);
  });

  return totalAmount;
};
```

テンプレートは以下のとおりです。

```html
<td>{{ getSubtotal(orderLine) | number }}</td>
```

```html
<td colspan="2">{{ getTotalAmount(lines) | number }}</td>
```

[number フィルタ](http://docs.angularjs.org/api/ng.filter:number)を使用して桁区切りで表示されるようにします。

<div preview="article.examples.example" hash="/new"></div>
