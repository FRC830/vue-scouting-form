<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Homepage msg="Welcome to Scouting 2019."/>
  </div>
</template>

<script>
// @ is an alias to /src
import Homepage from '@/components/Homepage.vue'

export default {
  components: {
    Homepage
  }
}
</script>
