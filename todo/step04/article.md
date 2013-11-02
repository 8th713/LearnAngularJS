双方向バインディングを理解しユーザーが入力した値を受け取りましょう。

## input 要素の値を受け取る
先ほどのステップで ToDo を作成することが出来るようになりました。
しかし肝心の要件が仮値のままです。
本来なら要件はフォームの input 要素から取得せねばなりません。

input 要素の値を表すモデルが存在すれば addTodo メソッドはユーザーが入力した値を参照できそうです。
まず input 要素の値を表すモデルを作成します。

```javascript
$scope.newTitle = '';
```

input 要素ははじめ値を持っている必要がないので初期値は空文字列です。
newTitle モデルは input 要素の値と結びついてユーザーの入力に合わせて値を更新する必要があります。
[ngModel ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngModel)を使用してモデルと要素を結びつけましょう。

```html
<form ng-submit="addTodo()">
  <input type="text" required placeholder="新しい要件を入力".
         ng-model="newTitle">
  <button type="submit">追加</button>
</form>
```

input 要素に対して ngModel ディレクティブの使用を宣言します。
ngModel ディレクティブは要素の値に紐付けたいモデルを受け取ります。
これで input 要素の値が変化した時 newTitle モデルの値も合わせて更新されるようになります。

最後に addTodo メソッド内で newTitle モデルを参照し新しく作成する ToDo の要件に代入されるようにしましょう。

```javascript
$scope.addTodo = function () {
  $scope.todos.push({
    title: $scope.newTitle,
    done: false
  });

  $scope.newTitle = '';
};
```

新しい Todo が作成されたら input 要素の値はもう必要ないので newTitle モデルは初期値に戻しておきましょう。
newTitle モデルに代入を行えば input 要素の値もそれに追従します。

ついでなのでリスト内の ToDo の状態にも ngModel ディレクティブを使用して ToDo モデルの done プロパティと結びつけておきましょう。

```html
<li class="todo-item" ng-repeat="todo in todos">
  <form>
    <input type="checkbox" ng-model="todo.done">
    <span class="todo-title">{{ todo.title }}</span>
    <button type="reset">削除</button>
  </form>
</li>
```

これでリスト内の ToDo モデルもチェックボックスの状態に合わせて更新されます。

完了状態の　ToDo には done クラスがつくという仕様なので todo.done プロパティの値に合わせてクラスが付与されるようにしましょう。

```html
<li class="todo-item" ng-repeat="todo in todos"
    ng-class="{done: todo.done}">
```

li 要素に対して [ngClass ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngClass)の使用を宣言します。
ngClass ディレクティブは様々な形式の値を受けとれますが今回はマップオブジェクトを使用します。
マップオブジェクトは `{'クラス名': クラスを付与する条件式}` の形式です。
上記の場合 todo.done プロパティが true なら done クラスが付与されるという意味になります。

<div preview="article.examples.example"></div>
