先ほどのステップですべての機能がそろいアプリは完成しました。
改めて完成したコードを眺めてみると MainController が扱うモデルが随分と増えてしまった気がします。

この規模ならまだいいですが、より大規模なアプリケーションでこのような実装をしているとメンテナンスがしづらくなるのは明白です。

この問題を解決するためコントローラをもう少し小さな単位で分割し、ひとつあたりが受け持つモデルの数を減らしましょう。

## 共有データ
$scope オブジェクトはプロトタイプ継承を利用した親子関係を持ちます。
が、$scope オブジェクトの親子関係はビューに依存しているためコントローラが親子関係に依存するようなコード(親 $scope のモデルを参照するなど)は破綻する恐れがあります。
そのためコントローラ間で共有する必要のあるデータはサービスとして実装します。

ToDo アプリのコントローラは ToDo リストに対する操作がほとんどなので ToDo リストの管理を受け持つサービスを準備しましょう。

```javascript
angular.module('App', [])
.service('todos', ['$rootScope', '$filter', function ($scope, $filter) {
  var list = []; // ToDo リスト

  // ToDo リストの変更を監視し 全 $scope に対して change:list イベントを発行する
  $scope.$watch(function () {
    return list;
  }, function (value) {
    $scope.$broadcast('change:list', value);
  }, true);

  var where = $filter('filter');

  var done = { done: true };
  var remaining = { done: false };

  // リストが扱えるフィルタリング条件
  this.filter = {
    done: done,
    remaining: remaining
  };

  // 完了状態の ToDo のみを抽出して返す
  this.getDone = function () {
    return where(list, done);
  };

  // 要件を受け取り新しい ToDo をリストに加える
  this.add = function (title) {
    list.push({
      title: title,
      done: false
    });
  };

  // 引数の ToDo をリストから取り除く
  this.remove = function (currentTodo) {
    list = where(list, function (todo) {
      return currentTodo !== todo;
    });
  };

  // 完了状態の ToDo をリストから取り除く
  this.removeDone = function () {
    list = where(list, remaining);
  };

  // リスト内の ToDo すべての状態を引数に合わせる
  this.changeState = function (state) {
    angular.forEach(list, function (todo) {
      todo.done = state;
    });
  };
}])
```

ToDo リストに対する操作はすべて todos サービスに移譲しました。
コントローラがリストを参照、操作したい場合、必ず todos サービスを経由することになります。

また、ToDo リストの変更を監視しイベントを介して子孫 $scope へその変更を伝える役割も担います。
コントローラは change:list イベントを購読することで最新のリストを取得可能になります。

## コントローラの分割
一つのコントローラが受け持つモデルを減らすためコントローラを分割しましょう。

今回は DOM に沿ってコントローラを以下の4つにわけます。

* 新規 ToDo 作成、登録を受け持つ **RegisterController**
* 件数モデルとフィルタ切替や状態切替などのボタン類を受け持つ **ToolbarController**
* ToDo リストと ToDo モデルの編集を受け持つ **TodoListController**
* フィルタリング状態モデルを受け持つ **MainController**

### RegisterController
```javascript
.controller('RegisterController', ['$scope', 'todos', function ($scope, todos) {
  $scope.newTitle = '';

  $scope.addTodo = function () {
    todos.add($scope.newTitle);
    $scope.newTitle = '';
  };
}])
```

RegisterController は ToDo 新規作成に必要なモデルだけを定義した単純なコントローラになりました。
リストへの追加は todos.add に移譲されている点に注意してください。

RegisterController は新規作成フォームの form 要素と結びつけます。

```html
<form ng-controller="RegisterController"
      ng-submit="addTodo()">
  <!-- 省略-->
</form>
```

### ToolbarController
```javascript
.controller('ToolbarController', ['$scope', 'todos', function ($scope, todos) {
  $scope.filter = todos.filter;

  $scope.$on('change:list', function (evt, list) {
    var length = list.length;
    var doneCount = todos.getDone().length;

    $scope.allCount = length;
    $scope.doneCount = doneCount;
    $scope.remainingCount = length - doneCount;
  });

  $scope.checkAll = function () {
    todos.changeState(!!$scope.remainingCount);
  };

  $scope.changeFilter = function (filter) {
    $scope.$emit('change:filter', filter);
  };

  $scope.removeDoneTodo = function () {
    todos.removeDone();
  };
}])
```

ToolbarController は件数モデルと各ボタンがクリックされた時の振る舞いに集中します。

change:list イベントにリスナーを登録しリスト更新時に最新のリストを得て件数モデルを作成します。

changeFilter メソッドは change:filter イベントを発行し親 $scope に選択されたフィルタを伝えるように変更しました。

ToolbarController はボタン類の親要素に結びつけます。

```html
<div ng-controller="ToolbarController">
  <button ng-click="checkAll()">全て完了/未了</button>
  <!-- 省略-->
</div>
```

### TodoListController
```javascript
.controller('TodoListController', ['$scope', 'todos', function ($scope, todos) {
  $scope.$on('change:list', function (evt, list) {
    $scope.todoList = list;
  });

  var originalTitle;

  $scope.editing = null;

  $scope.editTodo = function (todo) {
    originalTitle = todo.title;
    $scope.editing = todo;
  };

  $scope.doneEdit = function (todoForm) {
    if (todoForm.$invalid) {
      $scope.editing.title = originalTitle;
    }
    $scope.editing = originalTitle = null;
  };

  $scope.removeTodo = function (todo) {
    todos.remove(todo);
  };
}])
```

change:list イベントにリスナーを登録しリスト更新時に最新のリストを得て ToDo リストモデルを作成します。
todos というモデル名はサービスと混同を招くので todoList にモデル名を変更しました。
ビューの todos を参照していた部分も todoList に変更します。

TodoListController はリストアイテムの親要素に結びつけます。

```html
<ul ng-controller="TodoListController">
  <li class="todo-item"
      ng-repeat="todo in todoList | filter:currentFilter"
      ng-class="{done: todo.done, editing: todo == editing}">
    <!-- 省略-->
  </li>
</ul>
```

### MainController
```javascript
.controller('MainController', ['$scope', function ($scope) {
  $scope.currentFilter = null;

  $scope.$on('change:filter', function (evt, filter) {
    $scope.currentFilter = filter;
  });
}])
```

MainController はフィルタリング状態モデルを扱います。
フィルタリング状態モデルはリスト要素(TodoListController の受け持ち)とフィルタ切り替えボタン(ToolbarController の受け持ち)の両方から参照できる位置に存在せねばなりません。

それぞれのコントローラに全く同じ値を持つモデルを定義するのは無駄なので両方の要素を包含している MainController で定義します。

フィルタ切り替えボタンは ToolbarController が受け持つため、値の最新状態は change:filter イベント経由で受け取るようにします。

<div preview="article.examples.example"></div>

## 完成
以上でチュートリアルは終了です。
