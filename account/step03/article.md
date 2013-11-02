特定のパスを訪問した時、先ほど作成したテンプレートが表示されるようにしましょう。

## AngularJS でのルーティングの基礎
AngularJS のデフォルトのルーティングはハッシュフラグメントでビューを指し示します。
$location サービスの設定を変更することで History API を使用するモードに変更することも可能です。

今回はサーバーサイドの実装がありませんのでデフォルトのハッシュフラグメント方式を採用します。
アプリのページ(`./index.html`)のフラグメント部分(`#` 以降の部分)が App モジュールが管理すべきパスになります。

## ルートにテンプレートを割り当てる
App モジュールはルーティングに関する設定をまだ持っていません。
config メソッドを使ってアプリケーションの設定を行いましょう。

```javascript
angular.module('App', ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {}]);
```

アプリケーションにルーティングの設定を加えるには ngRoute モジュールが提供する [$routeProvider](http://docs.angularjs.org/api/ngRoute.$routeProvider) が必要になります。
コールバックが $routeProvider を受けとれるように依存の注釈を行います。

ルートを設定するには $routeProvider.when メソッドを使用します。

```javascript
$routeProvider
  .when('/', {
    templateUrl: 'index-tmpl'
  })
  .when('/new', {
    templateUrl: 'new-tmpl'
  })
  .when('/sheet/:id', {
    templateUrl: 'sheet-tmpl'
  });
```

when メソッドは第一引数にルートを割り当てたいパスを、第二引数にルートの設定オブジェクトを受け取ります。

### 帳票一覧ビュー
手始めに `/` に index-tmpl テンプレートを割り当てます。

オブジェクトの templateUrl プロパティに index-tmpl を設定します。
templateUrl は本来外部ファイルの URL を受け取りますが前回のステップでも説明したとおりテンプレート化した script 要素の id 属性は URL として扱われるので属性値を与えてやれば OK です。

これで `index.html#/` にアクセスすれば index-tmpl テンプレートが使用されるようになりました。

<div class="alert alert-info">
**Tip:**
フラグメント無しでページにアクセスした時、`/` にルート設定が存在していたら自動的に `#/` が付与されルート設定が適用されます。
</div>

### 帳票作成ビュー
同様の手順で `/new` に new-tmpl テンプレートを割り当てます。
`index.html#/new` のとき new-tmpl テンプレートが使用されます。

<div class="alert alert-info">
**Tip:**
`/new/` に別の割り当てが無い限り `index/html#/new/` にアクセスしても new-tmpl テンプレートが使用されます(`index/html#/new` にリダイレクトされます)。
</div>

### 帳票詳細ビュー
帳票詳細ビューは `/sheet/帳票の ID` で表示するようにしましょう。
帳票の ID 部分は不定の値になります。

パスに不定の値を含む場合は `:` キーワードを使用します。
`:` キーワードの後に続く語句は $routeParams サービスオブジェクトのプロパティの名前として使用されます。

受け取りたい値は帳票の ID なのでそのまま `/sheet/:id` とし sheet-tmpl テンプレートを設定しましょう。

## ルートが設定されていないパスにアクセスした時の振る舞いを設定する
3つのルート設定が完了しました。
しかし、このままではルートが設定されていないパスにアクセスがあった時どのテンプレートも表示されず白紙のページになってしまいます。

ルートが設定されていないパスにアクセスした時、帳票一覧にリダイレクトされるようにしましょう。

```javascript
$routeProvider
  .otherwise({
    redirectTo: '/'
  });
```

個別ルート外のパスにルート設定を行うには otherwise メソッドを使用します。
otherwise メソッドは when メソッドと同じ形式の設定オブジェクトを受け取ります。

今回はリダイレクト先を指し示す redirectTo プロパティを設定して `index.html#/` にリダイレクトされるようにします。

## テンプレートが注入される要素を用意する
ルート設定が完了したのでモジュールはどのパスの時どのテンプレートを使用すればいいのかがわかるようになりました。
しかし、モジュールは DOM のどの部分にテンプレートを流し込めばいいのかを知りません。

ngView ディレクティブを使ってテンプレートが注入されるべき要素を指定しましょう。

```html
<div ng-view></div>
```

入れ物となる要素を作成し `ng-view` 属性を追加します。
ルート設定されたパスにユーザーがアクセスするとこの要素の中身が自動的に指定されたテンプレートに置き換えられます。

## グローバルナビゲーションを用意する
実際にパスが変更された時テンプレートが注入されるかを簡単に確認するためグローバルナビゲーションもマークアップしておきましょう。

```javascript
<ul>
  <li><a href="#/">帳票一覧</a></li>
  <li><a href="#/new">帳票作成</a></li>
</ul>
```

帳票一覧と帳票作成へのリンクを持っていれば場所やマークアップの仕方はお好みで構いません。
帳票詳細へのリンクは帳票一覧にすでに含まれているので必要ありません。

<div preview="article.examples.example"></div>

<div class="alert alert-info">
**Tip:**
プレビューは見栄えのために <a href="http://getbootstrap.com/" class="alert-link">Bootstrap</a> を使用しています。
その都合上マークアップが多少違います。
</div>

<div class="alert alert-info">
**Tip:**
プレビューで使用している LocationBar モジュールは iframe 内でもルーティングの状態が見えるようにアドレスバーを表示するためのモジュールです。
本チュートリアルとは直接関係しないものです。
</div>
