<div class="alert alert-warning">
**Warning:**
このページに登場するコードはあくまで仕組みを説明するための仮定のコードです。
AngularJS の実際の実装とは違いますので注意してください。
</div>

## 問題

```javascript
function invoke(callback) {
  var obj = {
    foo: function () {},
    bar: {}
  };

  callback();
}

function func1(foo) {
  foo();
}

function func2(bar) {
  bar.name = 'Alice';
}
```

invoke が持っている obj.foo に依存した func1 と obj.bar に依存した func2 を作成しました。

`invoke(func1)` を実行するとどうなるでしょう。
func1は foo を呼び出せず例外を送出するでしょう。

`invoke(func2)` を実行した場合はどうでしょう。
func2は bar.name を作成できず例外を送出するでしょう。

invoke は callback が特定のオブジェクトを必要としていることを何らかの手段で取得し適切な引数を渡す必要があります。

上記のコードは AngularJS とは直接関係ありませんが同じ問題は AngularJS を使う上でしばしば起こります。
ある関数が特定のオブジェクトに依存している場合 AngularJS は一体どのように解決するのでしょう。

## 依存関係の注釈をつける
AngularJS ではこの問題を依存関係の注釈をつけることで解決しています。
AngularJS で実際に使える依存関係の注釈法を見ていきましょう。

### 1. 仮引数の名前を注釈とする
仮引数の名前が実際に必要としているオブジェクトと同名の変数だと仮定します。

```javascript
function invoke(callback) {
  var obj = {
    foo: function () {},
    bar: {}
  };

  // getAnnotations(function(x){}) => ['x']
  // getAnnotations(function(x, y){}) => ['x', 'y']
  var annotations = getAnnotations(callback);

  // ['foo'] => [obj.foo]
  // ['foo', 'bar'] => [obj.foo, obj.bar]
  var injectables = annotations.map(function(name) {
    return obj[name];
  });

  callback.apply(null, injectables);
}
```

getAnnotations は callback.toString で関数を文字列化し仮引数部分を抽出し配列として返します。
getAnnotations の 戻り値 annotations を利用して依存オブジェクトを取り出します。
injectables は callback が必要としているオブジェクトを順番通りに格納した配列になりました。
最終的に invoke は injectables を使って callback を正しく実行することができました。

ただし、このやり方には重大な欠点が存在します。
もしコードを圧縮、難読化した場合どうなるでしょう。

```javascript
function a(b) {
  b();
}

function c(d) {
  d.name = 'Alice';
}
// 可読性のためインデントと改行はそのまま
```

おそらく難読化ツールはこんな感じにコードを変換するでしょう。
仮引数の名前が変更されたので必要としているオブジェクトの情報は失われてしまいました。
注釈として利用できるものがなくなったので依存を解決することができません。

### 2. $inject プロパティを注釈とする
依存しているオブジェクトの名前を列挙した注釈配列を作成し関数の $inject プロパティにセットします。

```javascript
function invoke(callback) {
  var obj = {
    foo: function () {},
    bar: {}
  };
  var annotations;

  if (callback.$inject) {
    annotations = callback.$inject;
  } else {
    annotations = getAnnotations(callback);
  }

  var injectables = annotations.map(function(name) {
    return obj[name];
  });


  callback.apply(null, injectables);
}

function a(b) {
  b();
}
a.$inject = ['foo'];

function c(d) {
  d.name = 'Alice';
}
b.$inject = ['bar'];
```

callback.$inject が存在していたらそれを annotations とすることにします。
これで仮引数を変更しても注釈は失われずに無事依存を解決できました。

依存関係を注釈する $inject プロパティのお陰で難読化されても問題が起きないばかりか仮引数を自分の好きな名前に変えることまでできるようになりました。

しかしちょっと待ってください。
関数を受け取るメソッドを使うなら引数部分に直接関数定義を書きたくなるのが普通です。

```javascript
invoke(function (b) {
  b();
});
```

$inject プロパティを作るとなるとこのような書き方ができなくなります。

### 3. 注釈配列に実行関数を含めてしまう
invoke は配列も受け取り可能です。

```javascript
function invoke(callback) {
  var obj = {
    foo: function () {},
    bar: {}
  };
  var annotations;

  if (isArray(callback)) {
    annotations = callback.slice(0, -1);
    callback = callback[callback.length - 1];
  } else if (callback.$inject) {
    annotations = callback.$inject;
  } else {
    annotations = getAnnotations(callback);
  }

  var injectables = annotations.map(function(name) {
    return obj[name];
  });

  callback.apply(null, injectables);
}
```

もし callback が配列だったら最後の要素を実行する関数、残りの要素を annotations とすることにします。
結果的に invoke は下記のようにも使えるようになりました。

```javascript
invoke(['foo', function a(b) {
  b();
}]);

invoke(['bar', function c(d) {
  d.name = 'Alice';
}]);
```

<div class="alert alert-info">
**Tip:**
このような注釈を列挙し最後に関数を持った配列をこのサイトではアノテーション配列と読んでいます。
</div>

<div class="alert alert-info">
**Tip:**
このサイトでは依存解決は全てこの手段で行なっています。説明上「アノテーション配列を受け取る」などと書かれている場合、上記説明のとおり関数も受け取り可能です。
</div>

## まとめ
AngularJS では様々な場面で依存解決を求められます。
AngularJS は注釈を用いることで依存を解決します。

注釈として使えるものは

1. 仮引数の名前
2. $inject プロパティ
3. アノテーション配列

の三種類です。

但し 1 は推奨されない手段です。
必ず 2 か 3 の方法を使いましょう。

### 注釈を利用したコードの一例
```javascript
angular.module('App', [])
.config(['$interpolateProvider', function ($interpolateProvider) {
  $interpolateProvider
    .startSymbol('{[')
    .endSymbol(']}');
}])
.factory('getData', ['$http', function (http) {
  return function () {
    return http.get('/data.json');
  };
}])
.controller('Ctrl', ['$scope', 'getData', function (scope, getData) {
  scope.name = 'Alice';
  getData().success(function (data) {
    scope.data = data;
  });
}])
```

全てアノテーション配列で注釈しています。
もちろんアノテーション配列を渡している部分は全て関数も受け取ることができます。
