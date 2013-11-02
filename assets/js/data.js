angular.module('Data', [])
.value('guides', [
  {
    id: 'terminology',
    title: '用語'
  },
  {
    id: 'module',
    title: 'モジュール'
  },
  {
    id: 'scope',
    title: '$scope',
    examples: {
      demo1: {
        title: 'Event DEMO',
        files: ['demo1.html', 'demo1.js']
      },
      demo2: {
        title: 'Watch DEMO',
        files: ['demo2.html', 'demo2.js']
      }
    }
  },
  {
    id: 'template',
    title: 'ビュー・テンプレート',
    examples: {
      demo1: {
        title: 'DEMO 1',
        files: ['demo1.html', 'demo1.js']
      },
      demo2: {
        title: 'DEMO 2',
        files: ['demo2.html', 'demo2.js']
      }
    }
  },
  {
    id: 'dependence',
    title: '依存関係の注釈付け'
  },
  {
    id: 'controller',
    title: 'コントローラ',
    examples: {
      example: {
        title: 'DEMO',
        files: ['index.html', 'script.js']
      }
    }
  },
  {
    id: 'directive',
    title: 'ディレクティブ',
    examples: {
      example: {
        title: 'DEMO',
        files: ['index.html', 'script.js']
      }
    }
  },
  {
    id: 'filter',
    title: 'フィルタ',
    examples: {
      example: {
        title: 'DEMO',
        files: ['index.html', 'script.js']
      }
    }
  },
  {
    id: 'service',
    title: 'サービス',
    examples: {
      example: {
        title: 'DEMO',
        files: ['index.html', 'script.js']
      }
    }
  }
])
.value('todos', [
  {
    id: 'step00',
    title: '始める前に'
  },
  {
    id: 'step01',
    title: '準備'
  },
  {
    id: 'step02',
    title: 'モックアップを作成する',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'style.css']
      }
    }
  },
  {
    id: 'step03',
    title: '新しい ToDo を作成し表示できるようにする',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step04',
    title: 'ユーザー入力値を受け取る',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step05',
    title: 'リストをフィルタリングする',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step06',
    title: '未了・完了の件数を表示する',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step07',
    title: '作成済み ToDo を編集可能にする',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step08',
    title: '残りのビジネスロジックを実装する',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step09',
    title: 'コントローラを分割する',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  }
])
.value('accounts', [
  {
    id: 'step00',
    title: '始める前に'
  },
  {
    id: 'step01',
    title: '準備',
  },
  {
    id: 'step02',
    title: 'テンプレートを作成する'
  },
  {
    id: 'step03',
    title: 'ルートを設定する',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step04',
    title: 'ビューとコントローラを結びつける'
  },
  {
    id: 'step05',
    title: '帳票作成ページを動くようにする',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step06',
    title: '帳票を保存する',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step07',
    title: '不正な帳票を作成できないようにする',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'style.css']
      }
    }
  },
  {
    id: 'step08',
    title: '帳票詳細ページを動くようにする',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  },
  {
    id: 'step09',
    title: '効率的なコードに修正する',
    examples: {
      example: {
        title: 'プレビュー',
        files: ['index.html', 'app.js']
      }
    }
  }
])
.factory('models', ['guides', 'todos', 'accounts',
function (guides, todos, accounts) {
  return [
    {
      id: 'guide',
      title: 'ガイド',
      articles: guides
    },
    {
      id: 'todo',
      title: 'ToDo アプリをつくろう',
      articles: todos,
      pager: true
    },
    {
      id: 'account',
      title: '帳票アプリをつくろう',
      articles: accounts,
      pager: true
    }
  ];
}]);
