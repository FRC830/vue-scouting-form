<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide on how to configure / customize this project,<br>
      check out the
      <a href="https://github.com/FRC830/vue-scouting-form" target="_blank" rel="noopener">source code</a>.
    </p>

    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://ratpackrobotics.org" target="_blank" rel="noopener">Ratpack Website</a></li>
      <li><a href="https://github.com/FRC830" target="_blank" rel="noopener">FRC830 Github</a></li>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Vue Documentation</a></li>
      <li><a href="https://getbootstrap.com/docs/4.0/components/alerts/" target="_blank" rel="noopener">Bootstrap Documentation</a></li>
    </ul>
  <footer>
  <p> Code base created by <a href="https://github.com/reteps" target="_blank">Peter Stenger</a>. </p>

  </footer>
  </div>
</template>

<script>
export default {
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
p {
    text-align: center;
  }
}
h1, h3, p {
  color: rgb(34,31,126);
}
h1 {
  font-weight: 600;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: rgb(255, 200, 0);
}
</style>
