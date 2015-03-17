独自のディレクティブを定義する方法を覚えましょう。

## 編集モードの仕様
作成済み ToDo を編集する機能を実装する前に仕様をおさらいします。

* ToDo の要件部分をダブルクリックで編集モードに移行する
* 編集中は li 要素に editing クラスが付与される
* 編集中は要件部分が input 要素に変わる
* 編集中は削除ボタンが消える
* 編集モードに移行したら input 要素はテキスト選択状態になる
* 送信するか input 要素からフォーカスが外れるかで編集モードを終了する
* 編集終了時、要件が空だったら編集前の状態に戻す

## 編集モードへの移行を実装する
まずは任意の ToDo モデルを編集モードに出来るようにしましょう。

```javascript
var originalTitle;     // 編集前の要件
$scope.editing = null; // 編集モードの ToDo モデルを表すモデル

$scope.editTodo = function (todo) {
  originalTitle = todo.title;
  $scope.editing = todo;
};
```

編集中の ToDo を表す editing モデルを用意します。
editTodo メソッドを呼び出すことで editing モデルが更新されます。
編集前の要件を格納しておく変数も合わせて用意しましょう。

次に要件をダブルクリックした時その ToDo モデルを渡して editTodo が実行されるようにします。

```html
<span class="todo-title"
      ng-dblclick="editTodo(todo)">{{ todo.title }}</span>
```

[ngDblclick ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngDblclick)でダブルクリックイベントを要素に加えます。
ngDblclick ディレクティブは ngClick イベントのダブルクリック版です。

さらに li 要素に `.editing` を加える必要があるので ngClass ディレクティブを編集しましょう。

```html
<li class="todo-item"
    ng-repeat="todo in todos | filter:currentFilter"
    ng-class="{done: todo.done, editing: todo == editing}">
```

editing モデルと自身の ToDo モデルを比較することでクラスの付け外しを行います。

## DOM を編集モード用の表示に切り替える
編集モード中は要件を表示していた span 要素の代わりに input 要素を追加する必要があります。

とりあえず input 要素を準備しましょう。

```html
<form>
  <input type="checkbox" ng-model="todo.done">
  <span class="todo-title" ng-dblclick="editTodo(todo)">{{ todo.title }}</p>
  <input type="text" required ng-model="todo.title">
  <button type="reset">削除</button>
</form>
```

input 要素の値は ToDo の要件と連動しなければならないので ngModel ディレクティブの使用を宣言しましょう。

現状では span 要素と input 要素が同時に表示されています。
編集モードに合わせてそれぞれが表示、非表示になるようにしなければならないので [ngShow](http://docs.angularjs.org/api/ng.directive:ngShow)/[ngHide](http://docs.angularjs.org/api/ng.directive:ngHide) ディレクティブを使って表示をコントロールしましょう。

```html
<span class="todo-title" ng-dblclick="editTodo(todo)"
      ng-hide="todo == editing">{{ todo.title }}</p>
<input type="text" required ng-model="todo.title"
       ng-show="todo == editing">
```

ngShow/ngHide ディレクティブは式を受け取り、式の結果に合わせて要素を表示・非表示にします。
editing モデルと自身の ToDo モデルを比較し要素の表示・非表示を切り替えます。

さらに削除ボタンも非表示にする必要があります。
今度は [ngIf ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngIf)を使ってみましょう。

```html
<button type="reset" ng-if="todo != editing">削除</button>
```

ngIf ディレクティブは ngShow/ngHide とは違い式の結果に合わせて要素を DOM ツリーに追加・削除します。
式の結果が false ならその要素は DOM ツリーから取り除かれます。


<div class="alert alert-info">
**Tip:**
今回はディレクティブを紹介するために ngShow/ngHide/ngIf を使用しました。
本来は li 要素のクラスが変異するのを利用して CSS で表示状態をコントロールできるのでディレクティブを使う必要はありません。
</div>

<div class="alert alert-warning">
**Warning:**
ngIf ディレクティブ は v1.0.8 ではサポートされていません。
</div>

## input 要素を選択状態にする
ようやく表示はモックアップと同じになりました。
次は編集モードに移行したら input 要素を選択状態になるようにしなければなりません。

input 要素を選択状態にするには HTMLInputElement.prototype.select メソッドを使用すれば簡単です。
しかし、コントローラは DOM に関わらないのでどの要素を選択状態にすべきかを知り得ません。
仮に知り得たとしてもコントローラ内で DOM 操作を行うのは良い実装とはいえないでしょう。

DOM API を使用する必要がある場合は独自のディレクティブを作成しそちらに処理を委譲すべきです。

式を受け取り結果に応じて要素を選択状態にする mySelect ディレクティブを作成しましょう。

```javascript
angular.module('App', ['LocationBar'])
.controller('MainController', [/* 省略 */])
.directive('mySelect', [function () {
  return function (scope, $el, attrs) {
    // scope - 現在の $scope オブジェクト
    // $el   - jqLite オブジェクト(jQuery ライクオブジェクト)
    //         jQuery 使用時なら jQuery オブジェクト
    // attrs - DOM 属性のハッシュ(属性名は正規化されている)

    scope.$watch(attrs.mySelect, function (val) {
      if (val) {
        $el[0].select();
      }
    });
  };
}]);
```

$watch メソッドを使い mySelect 属性の値(ディレクティブが受け取る式)の評価結果を監視し select メソッドを実行するかどうかを判断します
。

作成したディレクティブを使用してみましょう。
html 上ではディレクティブ名がハイフンケースになることに注意してください。

```html
<input type="text" required ng-model="todo.title" ng-show="todo == editing"
       my-select="todo == editing">
```

input 要素を選択状態にする条件は ngShow ディレクティブと同一です。

## 編集を確定し編集モードを終了させる
編集中の ToDo はフォームが送信されるか input 要素からフォーカスが外れた時編集モードを抜けなくてはなりません。
ngSubmit/[ngBlur ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngBlur)を使い編集モードから抜ける処理を実行させましょう。

```javascript
$scope.doneEdit = function () {
  $scope.editing = null;
};
```

```html
<form ng-submit="doneEdit()">
  <!-- 省略 -->
  <input type="text" required ng-model="todo.title"
         ng-show="todo == editing" my-select="todo == editing"
         ng-blur="doneEdit()">
```

<div class="alert alert-warning">
**Warning:**
ngBlur ディレクティブ は v1.0.8 ではサポートされていません。
</div>

編集モードを抜けるには editing モデルを初期値に戻してやればいいだけです。
しかし、このままだと要件が空のまま input 要素からフォーカスが外れた時も編集モードから抜けてしまいます(input 要素には required 属性が付いているので送信については問題ありません)。
もし編集モードから抜けるとき要件が空なら編集前の値に戻さなければなりません。

今回の場合は非常に単純な例なので doneEdit メソッドで editing モデルの title プロパティが空かを調べればたやすく実装できます。
しかし、コントローラはフォームパーツがどんな制約条件を持っているかを知らないのでフォームパーツに新たな制約条件を加えた時いちいち doneEdit を修正せねばならなくなります。

AngularJS には [FormController オブジェクト](http://docs.angularjs.org/api/ng.directive:form.FormController)というバリデーションを簡単に行える機能が提供されているのでそちらに任せることにしましょう。

FormController オブジェクトを取得するには form 要素に name 属性を与えるだけです。

```html
<form name="todoForm"
      ng-submit="doneEdit(todoForm)">
  <!-- 省略 -->
  <input type="text" required ng-model="todo.title"
         ng-show="todo == editing" my-select="todo == editing"
         ng-blur="doneEdit(todoForm)">
```

form 要素に name 属性を加えると $scope オブジェクトに属性値と同じ名前のプロパティが作成され、そこに form 要素に結びついた FormController オブジェクトが代入されます。

doneEdit が FormController を受け取るように修正しました。
doneEdit を編集してフォームのバリデーション結果を受け取りましょう。

```javascript
$scope.doneEdit = function (todoForm) {
  if (todoForm.$invalid) {
    $scope.editing.title = originalTitle;
  }
  $scope.editing = originalTitle = null;
};
```

FormController は結び付けられた form 要素のフォームパーツの検証結果を保持しています。
もしひとつでも不正な入力値が存在していたら $invalid プロパティが true になります。
それを利用して要件を編集前の状態に戻します。

<div class="alert alert-info">
**Tip:**
FormController は $scope オブジェクトのプロパティに代入されるため $scope.todoForm から参照できます。
しかし、FormController への名前付けはビューが担っているので直接参照してしまうとビューを編集した時コントローラは FormController を見失うことになります。
そのためビューから引数で受け渡すようにしたほうが良いでしょう。
</div>

<div preview="article.examples.example"></div>
