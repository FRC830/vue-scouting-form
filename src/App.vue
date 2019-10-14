<template>
  <div id="app">
    <nav class="navbar navbar-expand">
      <a class="navbar-brand" href="#">Ratpack Scouting Form</a>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/form">Scout</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/view">View</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tools">Tools</router-link>
          </li>
        </ul>
    </nav>
    <div class="container container-fluid">
      <router-view />
      <!-- this will display each page -->
    </div>
  </div>
</template>

<style lang="scss">
@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
a.router-link-exact-active {
  text-decoration: underline;
}

</style>
