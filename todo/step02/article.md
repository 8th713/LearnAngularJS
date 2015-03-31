ユーザインタフェースのモックアップを作成しましょう。

## 新しい ToDo を作成するフォーム
まずは新しい ToDo を作成するためのフォームが必要です。

```html
<form>
  <input type="text" required placeholder="新しい要件を入力">
  <button type="submit">追加</button>
</form>
```

要件を入力するテキストフィールドと追加を実行するボタンです。
input 要素には required 属性を付けて要件が空の時はフォームを送信できないようにしておきましょう。


## ボタン類
アプリケーションの機能を実行するためのボタンも必要ですね。

```html
<div>
  <button>全て完了/未了</button>
  <button class="active">全部 <span>3</span></button>
  <button>未了 <span>2</span></button>
  <button>完了 <span>1</span></button>
  <button>完了アイテムを全て削除</button>
</div>
```

2 ~ 4 個目のボタンは ToDo の絞り込みボタンです。
選択中のボタンは active クラスがつくことにしましょう。
span 要素内にはそれぞれの件数を表示しましょう。

## ToDo リスト
ToDo を表示するリストも当然必要です。
未完了の ToDo、完了した ToDo、編集中の ToDo と3種類の状態のモックアップを作成しましょう。

### 未完了の ToDo
```html
<li class="todo-item">
  <form>
    <input type="checkbox">
    <span class="todo-title">未了の ToDo</span>
    <button type="reset">削除</button>
  </form>
</li>
```

状態を示すチェックボックスと削除ボタンを持っています。

削除ボタンの type 属性は reset にしておきます。
用途にあっていませんが他のタイプにしてしまうと submit イベントが発生してしまうのでやむを得ない処置です。

### 完了した ToDo
```html
<li class="todo-item done">
  <form>
    <input type="checkbox" checked>
    <span class="todo-title">完了した ToDo</span>
    <button type="reset">削除</button>
  </form>
</li>
```

完了した ToDo は `.todo-title` に打ち消し線を引きたいので li 要素に done クラスをつけることにしましょう。

### 編集中の ToDo
```html
<li class="todo-item editing">
  <form>
    <input type="checkbox">
    <input type="text" required value="編集中の ToDo">
  </form>
</li>
```

編集中の ToDo は editing クラスがつくことにします。
span 要素と button 要素が削除され input 要素が追加されます。

<div preview="article.examples.example"></div>

<div class="alert alert-info">
**Tip:**
プレビューは見栄えのために <a href="http://getbootstrap.com/" class="alert-link">Bootstrap</a> を使用しています。
その都合上マークアップが多少違います。
</div>
