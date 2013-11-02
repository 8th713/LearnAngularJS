コントローラーを作成しモデルを定義しましょう。
また、定義したモデルをビューから参照してみましょう。

## コントローラを作成する
AngularJS でモデルを定義するには新しい $scope オブジェクトが必要になります。
新しい $scope オブジェクトを作成するにはコントローラが必要です。

module オブジェクトの contoroller メソッドを使用してコントローラを作成しましょう。

```javascript
angular.module('App', [])
.controller('MainController', ['$scope', function ($scope) {}]);
```

コントローラのコンストラクタが $scope オブジェクトを受け取れるように依存の注釈をつけるのを忘れないでください。

## ビューが $scope を参照できるようにする
AngularJS でのモデルは $scope オブジェクトのプロパティに代入されたオブジェクト(とプリミティブ)ですのでビューが $scope オブジェクトのプロパティを参照できるようにする必要があります。

DOM に参照可能な $scope オブジェクトを知らせるために [ngController ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngController)を使用します。

```html
<div ng-controller="MainController">
  <!-- ここに先ほど作ったモックアップ -->
</div>
```

先ほど作ったモックアップを包む要素を作成し ngController ディレクティブの使用を宣言します。
属性値に参照したい $scope オブジェクトを持ったコントローラの名前を設定します。

<div class="alert alert-info">
**Tip:**
デザイン上ワッパーが必要ないなら body 要素に対して ngController ディレクティブを使用しても構いません。
</div>

## モデルを定義する
実装を始める前にアプリケーションが必要としているデータをおさらいします。

* **ToDo** - 任意の要件と、完了もしくは未完了の状態を持つデータ
  * `todo = {title: '要件', done: '状態'}` とします。
* **ToDo リスト** - 複数のToDoを持つデータ

さらに今回は新しい ToDo を作成しリストに加えるビジネスロジックも必要です。

まずは ToDo のリストを用意しましょう。

```javascript
$scope.todos = [];
```

ビューから参照できるのは $scope オブジェクトのプロパティだけなので todos プロパティに空の配列を設定します。

次は新しい ToDo を作成しリストに加えるビジネスロジックを実装しましょう。

```javascript
$scope.addTodo = function () {
  $scope.todos.push({
    title: Math.random(),
    done: false
  });
};
```

新しい ToDo なので状態は未完了でいいでしょう。
要件は仮値としてランダムな数値が入るようにでもしておきましょう。

## ビューからモデルを参照する
フォームが送信された時 addTodo が実行されるようにしましょう。

```html
<form ng-submit="addTodo()">
  <input type="text" required placeholder="新しい要件を入力">
  <button type="submit">追加</button>
</form>
```

form 要素に対して [ngSubmit ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngSubmit)の使用を宣言します。
ngSubmit ディレクティブはサブミットイベント発生時に属性値の式を直近の $scope オブジェクトで評価してくれます。

これでフォームが送信された時 addTodo が実行され新しい ToDo がリストに追加されます。

続いて ToDo リストを表示してみましょう。
とりあえず未完了状態の ToDo のモックアップを編集して表示に使いましょう。

```html
<li class="todo-item" ng-repeat="todo in todos">
  <form>
    <input type="checkbox">
    <span class="todo-title">{{ todo.title }}</span>
    <button type="reset">削除</button>
  </form>
</li>
```

li 要素に対して [ngRepeat ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngRepeat)の使用を宣言します。
ngRepeat ディレクティブは JavaScript の for...in のような、コレクションを列挙する特別な構文を受け取り DOM を複製するディレクティブです。 また、このディレクティブは複製された DOM に新たな $scope オブジェクトを結びつけます。

$scope オブジェクトはキーワードとなった名前のプロパティ(上記例では todo)を持ちそこには配列の各要素が代入されます。
つまり li 要素の以下の要素は個々の ToDo モデルにアクセス可能ということです。

本当に ToDo モデルにアクセス可能か確認するためテンプレート構文 `{{ }}` を使って ToDo モデルの要件を出力してみましょう。

ついでなので ToDo の総数も表示できるよう該当箇所を編集しましょう。

```html
<button class="active">全部 <span>{{ todos.length }}</span></button>
```

プレビューで実際に動く様子を確認してみましょう。

<div preview="article.examples.example"></div>
