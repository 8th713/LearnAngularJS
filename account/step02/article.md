今回作成するのは3つのビューを持ったアプリケーションです。
それぞれのビューで使用するテンプレートを準備しましょう。

## テンプレートの基礎
テンプレートは専用の html ファイルを用意するか script 要素内に記述します。

script 要素をテンプレートとして使用する場合 type 属性に `text/ng-template` を指定します。
適切な属性を付与することでその要素内の記述を、外部ファイルのように扱ってくれます。

1つの script 要素が外部ファイルの1つ分に相当するため script 要素には外部ファイルの url に相当する情報も持たせる必要があります。
URL に相当する情報は要素の `id` 要素に指定します。

<div class="alert alert-warning">
**Warning:**
テンプレートとして使用される `script` 要素の `id` は URL に見立てられるものなので `/templates/index.html` のような URL 風の値にしても構いません(公式リファレンスはそういう使い方をしています)。
ただし HTML 4.01 で `id` 要素の値として使用できる記号は `-` `_` `:` `.` だけですので注意が必要です。
HTML 5 では空白文字を禁止する制限以外に言及がないので `/` も使えるはずです。
互換性などを考慮する場合 `-` `_` 以外の記号を使うのはやめたほうがいいかもしれません。
</div>

## 帳票一覧のテンプレート
id 要素の値は `index-tmpl` にしました。

アプリケーションはまだデータを持っていないのでデータ部分は仮の値を入れておくことにします。

リスト項目は詳細画面へのリンクを持っています。
詳細画面に割り当てる予定の URL に設定しておきましょう。

```html
<script type="text/ng-template" id="index-tmpl">
  <h1>帳票一覧</h1>
  <ul>
    <li>#x yyyy/mm/dd <a href="#/sheet/x">詳細を確認する</a></li>
    <li>#y yyyy/mm/dd <a href="#/sheet/y">詳細を確認する</a></li>
    <li>#z yyyy/mm/dd <a href="#/sheet/z">詳細を確認する</a></li>
  </ul>
</script>
```

## 帳票作成のテンプレート
id 要素の値は `new-tmpl` にしました。

仮値として注文明細行を2つ持っていることにしておきます。

注文明細行は商品名、単価、個数を入力できるようにします。
さらに小計の項目と明細行を削除するボタンも持っていることにしましょう。

合計金額を表示する場所も確保しておきましょう。

そのほかにも「明細行を追加」などいくつかのボタンとリンクがあります。

```html
<script type="text/ng-template" id="new-tmpl">
  <h1>帳票作成</h1>
  <form>
    <table>
      <thead>
        <tr>
          <th>商品名</th>
          <th>単価</th>
          <th>個数</th>
          <th>小計</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text"></td>
          <td><input type="number"></td>
          <td><input type="number"></td>
          <td>4,500</td>
          <td><button type="button">削除</button></td>
        </tr>
        <tr>
          <td><input type="text"></td>
          <td><input type="number"></td>
          <td><input type="number"></td>
          <td>6,000</td>
          <td><button type="button">削除</button></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">合計:</td>
          <td colspan="2">10,500</td>
        </tr>
      </tfoot>
    </table>
    <div>
      <button type="button">明細行を追加</button>
      <button type="button">帳票を初期化</button>
      <button type="submit">帳票を保存</button>
    </div>
  <form>
</script>
```

## 帳票詳細のテンプレート
id 要素の値は `sheet-tmpl` にしました。

ここでも仮値として注文明細行を2つ持っていることにしておきます。
表示する項目は作成画面とほぼ同じです。

このページは作成済みの帳票を閲覧するだけなのでインタラクティブな要素は帳票一覧へ戻るリンクのみです。

```html
<script type="text/ng-template" id="sheet-tmpl">
  <h1>帳票詳細 #x</h1>
  <p>作成日時: yyyy/mm/dd</p>
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
      <tr>
        <td>商品名1</td>
        <td>1,600</td>
        <td>10</td>
        <td>16,000</td>
      </tr>
      <tr>
        <td>商品名2</td>
        <td>2,000</td>
        <td>12</td>
        <td>24,000</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">合計:</td>
        <td>40,000</td>
      </tr>
    </tfoot>
  </table>
</script>
```
