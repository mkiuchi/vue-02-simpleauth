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
