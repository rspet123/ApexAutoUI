import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import '@mdi/font/css/materialdesignicons.css';

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount("#app");
