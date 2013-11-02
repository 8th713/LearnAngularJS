パスパラメータから任意の帳票を選択し帳票の詳細を表示しましょう。

## パス内の変数を取得する
帳票詳細ページのパスは取得したい帳票の id を持っています。
パスのパラメータは [$routeParams サービス](http://docs.angularjs.org/api/ngRoute.$routeParams) が保持しています。

ルートの設定で `/sheet/:id` と設定したので条件に一致したパスに訪問した時 $routeParams サービスは `{id: 'パスの :id 部分の文字列'}` を保持しています。

これを利用して sheets サービスの get メソッドを実行し任意の帳票を取得しましょう。

```javascript
.controller('SheetController', ['$scope', '$routeParams', 'sheets',
function SheetController($scope, $params, sheets) {
  var sheet = sheets.get($params.id); // 帳票を取得

  angular.extend($scope, sheet); // $scope オブジェクトを sheet で拡張

  $scope.getSubtotal = function (orderLine) {/* 省略 */};

  $scope.getTotalAmount = function (lines) {/* 省略 */};
}]);
```

詳細ページにも小計と合計金額を表示する必要があるので各ビジネスロジックも準備します。

モデルの準備が完了したらテンプレートを編集します。

```html
<div ng-show="id">
  <h1>帳票詳細 #{{ id }}</h1>
  <p>作成日時: {{ createdAt | date:'yyyy/MM/dd HH:mm' }}</p>
  <table>
    <thead>
      <tr>
        <th>商品名</th>
        <th>単価</th>
        <th>個数</th>
        <th>小計</th>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="orderLine in lines">
        <td>{{ orderLine.productName }}</td>
        <td>{{ orderLine.unitPrice | number }}</td>
        <td>{{ orderLine.count | number }}</td>
        <td>{{ getSubtotal(orderLine) | number }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">合計:</td>
        <td>{{ getTotalAmount(lines) | number }}</td>
      </tr>
    </tfoot>
  </table>
</div>
<div ng-hide="id">
  存在しない帳票を参照しています。 <a href="#/new">新しい帳票を作る</a>
</div>
```

ngShow/ngHide ディレクティブを使用して帳票が正常に取得できなかった時用の表示も用意しましょう。

<div preview="article.examples.example" hash="sheet/1"></div>
