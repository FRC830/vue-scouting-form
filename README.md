# vue-scouting-form

## Setup

`npm install`
- this installs the needed packages and dependencies for the project

`npm run serve`
- this runs the `serve` script defined in `package.json`, essentially running `vue-cli-service serve`
### Production
`npm run build && npm run prod`
+ This builds the compiled version then runs the production server

## What am I looking at?

```
src
├── main.js # Calls App.vue with options
├── App.vue # The main vue application
├── router.js # This defines all of the web routes, e.g. /tools -> Tools.vue
├── api.js # The backend /api/ calls
|
├── components # These are small pieces of code with a specific task
│   ├── ConfigForm.vue # The settings form
│   ├── ScoutingForm.vue # The scouting form
│   └── ScoutingTable.vue # The data table
│   └── ...
|
├── views # Each web page that is accessible
│   ├── Form.vue
│   ├── Home.vue
│   ├── Tools.vue
│   └── View.vue
|
└── assets
    └── ...

dist # Production Code
└── ...
data # Saved data files
└── ...
production-server.js # The server that runs the minified code
vue.config.js # Vue configuration, allows us to integrate api into vue application
```

### I'm still confused.

This application uses [vue](https://vuejs.org/) to create each view. The scouting form is written using html and bootstrap. To modify the form, edit the `template` of `components/ScoutingForm.vue`
```html
<template>
  <form id="scouting" @submit.prevent="formSubmit" ref="form">
    <!-- Add form code here -->
  </form>
</template>
```
## Bugs? Errors? Feature Requests?

- Open an issue or a pull request!
