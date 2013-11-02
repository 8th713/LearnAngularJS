帳票を保存し一覧を表示できるようになりました。
しかしこの保存機能には明細行に不正な入力がなされていた場合でも保存できてしまうという問題があります。

入力の検証を行い不正な帳票は保存できないようにしましょう。

## 適切な帳票の条件
検証機能を実装する前に適切な帳票の条件を決めます。

* 明細行リストは必ず1つ以上の明細行を持たくてはならない。
* 明細行の各項目はすべて必須項目である。
* 明細行の単価、個数は n >= 0 でなければならない。
* 明細行の単価、個数は 整数でなければならない。

## 削除ボタンを無効化する
条件のうち明細行の数については明細行が1つしか存在しない時は削除ボタンが機能しないようにすることで実装することにします。

```html
<td><button type="button" ng-disabled="lines.length < 2"
            ng-click="removeLine(orderLine)">削除</button></td>
```

[ngDisabled ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngDisabled) を使用し明細行リストの長さが2つ未満の時要素を無効化します。
これでクリックイベントが発行されなくなるので明細行リストが空になることを防げます。

## 入力を検証する
ユーザーの入力が適切かどうかを検証し不正な入力が存在していた時フォームの送信を禁止しましょう。

まずフォームパーツに制約条件を加えます。

AngularJS ではいくつかの制約条件については HTML5 で標準化された制約属性がそのまま使用できます。
使用可能な制約属性は required, min, max の三種類のみで step, pattern などは使用できません。
使用できない制約属性の代替として ngPattern, ngMaxlength などの独自の属性が用意されています。

```html
<td><input type="text" ng-model="orderLine.productName"
           required></td>
<td><input type="number" ng-model="orderLine.unitPrice"
           required min="0" ng-pattern="/^\d+$/"></td>
<td><input type="number" ng-model="orderLine.count"
           required min="0" ng-pattern="/^\d+$/"></td>
```

input 要素はすべて入力必須なので required 属性をセットします。
input[number] 要素は 0 未満を許容しないので min 属性をセットします。
pattern 属性は使用できなので ngPattern 属性を代わりに使用して入力を整数に限定します。

これらの制約条件は ngModel ディレクティブが検証を行うために使用されます。
検証を行うのは ngModel ディレクティブなので標準化された検証機能が未実装の古いブラウザでも検証を行うことができます。
逆に検証機能を備えたモダンブラウザでは互いの検証機能が衝突してしまうため form 要素に novalidate 属性をセットしてブラウザサイドの検証機能を無効化する必要があります。

各制約は ngModel ディレクティブによってリアルタイムで検証されます。
検証結果は form 要素に紐付いた [FormController](http://docs.angularjs.org/api/ng.directive:form.FormController) オブジェクトに格納されています。

検証結果を参照する必要がある場合フォームパーツが所属している form 要素に name 属性をつけモデル化する必要があります。

```html
<form novalidate name="sheetForm" ng-submit="save()">
```

これで現在のコンテキストに sheetForm モデルが作成されます。

検証結果を参照しフォームが不正な状態のとき送信ボタンが無効化されるようにしましょう。
フォーム全体の検証結果は FormController の $invalid プロパティの状態を参照することで取得できます。

```html
<button type="submit" ng-disabled="sheetForm.$invalid">帳票を保存</button>
```

これで検証に合格できないときは送信できないようになりました。
しかし、このままではユーザーはなぜ送信できないのかがわからないので不親切です。

入力に不備があることをユーザーに通知する必要があるのでテンプレートに通知領域を加えましょう。

```html
<div ng-show="sheetForm.$invalid">
  <span ng-show="sheetForm.$error.required">空欄が存在しています。</span>
  <span ng-show="sheetForm.$error.min">単価、個数の最小値は 0 です。</span>
  <span ng-show="sheetForm.$error.pattern">単価、個数は整数で指定してください。</span>
</div>
```

[ngShow ディレクティブ](http://docs.angularjs.org/api/ng.directive:ngShow) を使用して sheetForm.$invalid が true の時だけ表示される要素を準備します。

同様に通知すべきメッセージを3つ用意しそれぞれ必要な時だけ表示されるようにします。
表示条件は $error プロパティで管理します。

また検証に合格できなかった要素は ng-invalid というクラスが付与されるので CSS でフォームパーツの見た目を変化させることにします。

<div preview="article.examples.example" hash="/new"></div>
