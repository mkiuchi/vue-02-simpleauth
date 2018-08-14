# 04-vuejs-spa-example2

さて、前回に引き続き、vue.jsを使っていく。今回は簡便な認証を実装してみる。

## 概要

---

以下のようなページ構成を取るサイトを作る

- /: トップページ。特に何もしない
- /Login: 認証を行うページ
- /PageA: 実際のコンテンツページA
- /PageB: 実際のコンテンツページB

ただし、 `/PageA` と `/PageB` には認証を行っていなければアクセスさせたくない。従って実装する処理は以下のような感じになる。

- /: トップページ
    - /Login に無条件でリダイレクトする
- /Login: 認証を行うページ
    - 実際の認証を行う
- /PageA: 実際のコンテンツページA
    - 認証されているかどうかをチェックする
        - 認証されていればページを表示
        - 認証されていない場合は `/Login` にジャンプ
- /PageB: 実際のコンテンツページB
    - 認証されているかどうかをチェックする
        - 認証されていればページを表示
        - 認証されていない場合は `/Login` にジャンプ

ここには2つ問題があって、

- `/PageA` ないしは `/PageB` は読み込み時に認証されているかどうかをチェックする必要がある
- `/PageA` ないしは `/PageB` から認証されていないために `/Login` に飛ばされた場合、認証後の戻り先がわかっていないといけない。

これを解決するためにここでは URL の query string を使う。具体的には

- `/PageA` および `/PageB` では `/PageA?auth=authenticated` とついていれば認証されているとする
- `/Login` では `/Login?next=PageA` としていれば、認証後にジャンプするページを `PageA` とする

※ ここには課題があるのだが、ここでは触れず後日別のところで解説、解決する

認証機能も正解のユーザ名とパスワードを入れたらOKとする。これもちゃんとした実装が必要なのだがここでは触れず、後日別のところで解説、解決する。

## 実装

---

ファイル一覧。変更、追加したファイルは(*)をつけている

``` bash
04-vuejs-spa-example2
├──src
(略)  ├── App.vue
      ├── assets
      │   └── logo.png
      ├── components
      │   ├── HelloWorld.vue
      │   ├── (*)Login.vue
      │   ├── (*)NotFound.vue
      │   ├── (*)PageA.vue
      │   └── (*)PageB.vue
      ├── main.js
      └── router
           └── (*)index.js
```

### src/router/index.js
---
ここでは各ファイルへのルーティングを定義する

```javascript
import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import NotFound from '@/components/NotFound'
import PageA from '@/components/PageA'
import PageB from '@/components/PageB'

Vue.use(Router)

export default new Router({
  mode: 'history', // https://router.vuejs.org/guide/essentials/history-mode.html
  routes: [
    { path: '/', component: Login },
    { path: '/Login', name: 'Login', query: { next: '' }, component: Login },
    { path: '/PageA', name: 'PageA', query: { auth: '' }, component: PageA },
    { path: '/PageB', name: 'PageB', query: { auth: '' }, component: PageB },
    { path: '*', component: NotFound }
  ]})
```

まず `mode: 'history'` とつけている部分。vue.js のデフォルトは「ハッシュモード」というモードを使用していて、完全なURLをハッシュに変換して、それを元にルーティングを行っている。ただ、このハッシュモードでは query string をうまく取り扱うことができなかったため、「ヒストリーモード」に変換するためにこの定義を入れている。

また `mode: 'history'` とした影響で、存在しないページの URL を入れた際に空白ページが表示される(ちなみにデフォルトのハッシュモードでは '`/`' ページが表示される)ため、NotFound ページを表示する行を追加している。

`/Login`, `/PageA`, `/PageB` では query string を扱うためにパラメータの初期値を入れている。これは省略することもできる。

### src/components/Login.vue

---

ここで認証処理を実装する。最初にファイル全体を掲示する。

``` html
<template>
    <div class="login">
        <h1>
            Login
        </h1>
        <h2>Username(Correct Login Name: myLoginName)</h2>
            <div>
                <p>{{ loginaccountname }}</p>
                <input id="loginaccount" v-model="loginaccountname"/>
            </div>
        <h2>Password(Correct Password: mySecretPassword1234)</h2>
            <div>
                <p>{{ loginpassword }}</p>
                <input type="password" id="loginpassword" v-model="loginpassword"/>
            </div>
        <div id="loginsubmit">
            <button v-on:click="checklogin">ログイン</button>
        </div>
        <div id="loginResult"></div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data: function () {
    return {
      loginaccountname: '',
      loginpassword: ''
    }
  },
  methods: {
    checklogin: function (event) {
      var nextPage = this.$route.query.next
      if (nextPage === undefined) {
        nextPage = 'PageA'
      }
      console.log(nextPage)

      // checkloginイベント(htmlファイル内で定義している)の内容を記述
      var correctLoginName = 'myLoginName'
      var correctPassword = 'mySecretPassword1234'

      var myLoginName = document.getElementById('loginaccount').value
      var myLoginPass = document.getElementById('loginpassword').value

      if ((myLoginName === correctLoginName) &&
        (myLoginPass === correctPassword)) {
        // document.getElementById('loginResult').innerHTML = 'Login Success !'
        this.$router.push({name: nextPage, query: { auth: 'authenticated' }})
      } else {
        document.getElementById('loginResult').innerHTML = 'Login Failed !'
      }
    }
  }
}
</script>
```

1つの vue ファイルは HTML部、javascript部、CSS部の3つから成り立っている。従って最小限の vue ファイルは以下のようになる。

``` html
<template></template>
<script>
export default {
  name: 'nameofpage'
}
</script>
```

まずHTML部から見てみる。

``` html
<template>
    <div class="login">
        <h1>
            Login
        </h1>
        <h2>Username(Correct Login Name: myLoginName)</h2>
            <div>
                <p>{{ loginaccountname }}</p>
                <input id="loginaccount" v-model="loginaccountname"/>
            </div>
        <h2>Password(Correct Password: mySecretPassword1234)</h2>
            <div>
                <p>{{ loginpassword }}</p>
                <input type="password" id="loginpassword" v-model="loginpassword"/>
            </div>
        <div id="loginsubmit">
            <button v-on:click="checklogin">ログイン</button>
        </div>
        <div id="loginResult"></div>
    </div>
</template>
```

HTML部は全体を `<template>` タグで囲む。慣例的に？直下に `<div>` タグで囲んでいるようだ。ここで vue.js の機能を2つ使っている。

1つめは submit ボタンを押した際のイベント呼び出し機能。 `v-on:click="checklogin"` がそれ。こう定義することで、ボタンクリック時に javascript 部の method で定義した `checklogin` イベントとして定義した関数を実行することができる。

もう1つは実用的な機能ではないが、 `<input>` タグが変更されるたびに、その直上の「ムスタッシェ(mustache, `{{}}` で囲まれた部分)」の内容を `<input>` の内容で書き換えている。

続けて javascript 部

``` javascript
export default {
  name: 'login',
  data: function () {
    return {
      loginaccountname: '',
      loginpassword: ''
    }
  },
  methods: {
    checklogin: function (event) {
      var nextPage = this.$route.query.next
      if (nextPage === undefined) {
        nextPage = 'PageA'
      }
      console.log(nextPage)

      // checkloginイベント(htmlファイル内で定義している)の内容を記述
      var correctLoginName = 'myLoginName'
      var correctPassword = 'mySecretPassword1234'

      var myLoginName = document.getElementById('loginaccount').value
      var myLoginPass = document.getElementById('loginpassword').value

      if ((myLoginName === correctLoginName) &&
        (myLoginPass === correctPassword)) {
        // document.getElementById('loginResult').innerHTML = 'Login Success !'
        this.$router.push({name: nextPage, query: { auth: 'authenticated' }})
      } else {
        document.getElementById('loginResult').innerHTML = 'Login Failed !'
      }
    }
  }
}
```

`<script>` タグの中は原則1つの `export default {}` しかない。この中にこのテンプレートで必要な処理を全て書くことになる。また `export default {}` の直下に書くことができる要素は制限されている。主な要素は `name`, `data`, `methods`。他にもあるがアドバンスな内容なので気になる場合は https://jp.vuejs.org/v2/api/#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3-%E3%83%87%E3%83%BC%E3%82%BF を見ること。

`name` は `Vue.component()` にグローバルIDとして登録され、コンポーネントの再帰呼び出しを許可する・・・らしいが具体的に何がうれしいのかイマイチよくわからず。とりあえずつけておく程度にとらえている。

`data` は HTML 部で定義した mustache コンテナの初期値を定義する。（たぶん厳密な定義は違うが、とりあえずはこのように理解していても問題なさそう）

`methods` がガリガリ使う部分。ここにイベントに対応する関数を書いていく。上記の例では以下の機能を実装している。
- URLの一部として与えられた query string を読み込み、ジャンプ先を定義する
- 2つのinputタグの内容を読み取り、正解と合致するかどうか検証する
- 正解と合致していたら、ジャンプ先にジャンプする

ここで特記するのは vue-router の機能として query string を読み取る部分と、指定先にジャンプする機能。

query string を読み取るときは `this.$route.query.<key名>` と指定すると読み取ることができる。値が存在しない場合は undefined がかえる。ここでは undefined かどうかを判断し、undefined の場合はデフォルト値(`PageA`)を指定している。

ジャンプするときは `this.$router.push({name: <ジャンプ先の名前>})` と呼び出す。ジャンプ先の名前は、`router/index.js` で指定した `name` の名称を指定する。 `query: {}` を追加すればジャンプ先に query string を渡すことができる。

### src/components/Page(A|B).vue

---

ここが実際のページの内容となる。

```html
<template>
  <div class="pagea">
    This is page A.
  </div>
</template>

<script>
export default {
  name: 'pagea',
  beforeMount: function () {
    if (this.$route.query.auth !== 'authenticated') {
      this.$router.push({ name: 'Login', query: { next: 'PageA' } })
    }
  }
}
</script>
```

ここもデモとして最小限の機能しか実装していないが、特記するのは「ページ表示前の処理」に関する部分。

答えを言うと、`beforeMount` として関数を定義すれば、ページ表示前に実行される。ここでは query string を評価し、 `auth=authenticated` が指定されていない場合は自分自身を認証後の戻り先に指定して、 `/Login` にジャンプしている。

### src/components/NotFound.vue

---

ここはNotFoundページの内容となる。特に特記すべき事項はない。

```html
<template>
  <div class="notfound">
    Page not found...
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>
```

## さいごに

ここでは最小限の認証機能を備えたSPAアプリケーションを構築した。

次回はこの仕組みをさらに拡張し、スケーラブルな認証、セッション管理機能を持ったアプリケーションに仕立て上げる。

## 以下オリジナルの(自動生成された)README.md

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
