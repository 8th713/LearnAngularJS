## 役割
フィルタは以下の役割を果たすために使用されるものです。

* ビューにバインドされたデータを加工し表示する。

## 使う
ビューのテンプレート構文内で `| filterName` のようにして呼び出します。

```html
<p>{{ name | uppercase }}</p>
```

変数 name は大文字に変換され出力されます。
出力が変換されるだけであり変数が書き換わるわけではありません。

フィルタの中には引数を受け取るれるものも存在します。
`:` に続く部分が引数です。

```html
<p>{{ 0 | date:'yyyy-MM-dd' }}</p>
```

複数のフィルタを通すこともできます。

```html
<p>{{ [1, 2, 3, 4, 5, 6, 7, 8, 9] | filter:odd | limitTo:2 }}</p>
```


## 作る
module オブジェクトの filter メソッドでモジュールに新しいフィルタを定義できます。

```javascript
module.filter('omit', [function () {
  var defaultLength = 100;
  var defaultChar = '…';

  return function (arg, len, char) {
    len = len || defaultLength;

    if (angular.isString(arg) && arg.length > len) {
      return arg.slice(0, len) + (char || defaultChar);
    }
    return arg;
  };
}]);
```

第一引数がフィルタの名前になります。
第二引数はアノテーション配列です。

アノテーション配列の最後にはファクトリ関数を含めます。
ファクトリ関数が返すべきものは第一引数にフィルタリングしたい値、第二引数以降に実行時に渡された引数を受け取り新しい値を返す関数です。

ファクトリ関数はフィルタがはじめて呼び出された時に一度だけ実行されます。
2回目以降のフィルタ呼び出し時にはファクトリ関数は実行されません。

<div preview="article.examples.example" size="200"></div>
