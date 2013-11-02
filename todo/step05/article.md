フィルタを使用しリストの表示を絞り込みましょう。

## 表示を加工する
ToDo モデルの状態が変更可能になったので、指定した状態の ToDo だけを表示できるようにしましょう。

データを変更せずに表示だけを加工する必要があるので li 要素に対してコアモジュールの [filter フィルタ](http://docs.angularjs.org/api/ng.filter:filter)を使用します。

```html
<li class="todo-item"
    ng-repeat="todo in todos | filter:currentFilter"
    ng-class="{done: todo.done}">
```

filter フィルタはフィルタリング条件となる引数を受け取り、合致する要素のみの配列を返してくれます。
フィルタリング条件引数は currentFilter モデルに代入することにしました。
コントローラ内でフィルタリング条件を格納する $scope.filter モデルとフィルタリングの現在の状態を表す currentFilter モデル、フィルタリングの状態を変更する changeFilter メソッドを作成しましょう。

```javascript
// フィルタリング条件モデル
$scope.filter = {
  done: { done: true },      // 完了のみ
  remaining: { done: false } // 未了のみ
};

// 現在のフィルタの状態モデル
$scope.currentFilter = null;

// フィルタリング条件を変更するメソッド
$scope.changeFilter = function (filter) {
  $scope.currentFilter = filter;
};
```

初期状態では絞り込みはしないので currentFilter の初期値は null にします。

続いてボタンクリックでフィルタリングが実行できるように html を編集しましょう。

```html
<button ng-click="changeFilter()"
        ng-class="{active: !currentFilter}">全部 <span>{{ todos.length }}</span></button>
<button ng-click="changeFilter(filter.remaining)"
        ng-class="{active: currentFilter == filter.remaining}">未了 <span>n</span></button>
<button ng-click="changeFilter(filter.done)"
        ng-class="{active: currentFilter == filter.done}">完了 <span>n</span></button>
```

ngClick ディレクティブを使い使用したいフィルタリング条件モデルを指定して changeFilter を実行するようにします。
またボタンはクリックされた時 `.active` になる必要があります。
ngClass ディレクティブで currentFilter とフィルタリング条件モデルを比較するようにしましょう。

<div preview="article.examples.example"></div>
