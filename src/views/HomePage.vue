<template>
  <div>
    <v-card>
      <v-card-title>Wasabii</v-card-title>
      <v-card-text>
        <p>Apex Legends Analysis Tool</p>
        <p>How To Use:</p>
        <p>Just Click the buttons man</p>
        <p>Use the desktop app for screenshot automation</p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text v-if="loading">
        <v-progress-linear indeterminate color="red"></v-progress-linear>
        <p>Checking Connection...</p>
      </v-card-text>
      <v-card-text v-if="!isConnected && !loading" >
        <v-progress-linear indeterminate color="red"></v-progress-linear>
        <p>I can't connect to the API...</p>
        <p>That's fucked up</p>
      </v-card-text>
      <v-card-text v-if="isConnected && !loading">
        <p>Connected...</p>
      </v-card-text>
      <v-card-text>
        <v-card-title>To Do</v-card-title>
        <v-card-text>
          <v-checkbox disabled label="Track Analysis Thread (Stop Analysis Button Doesn't work, I Know, Don't @ me)"></v-checkbox>
          <v-checkbox disabled label="Tweak Screenshot Analyzer"></v-checkbox>
          <v-checkbox disabled label="Add Map/Console/Harv Viewer W/ Heatmaps"></v-checkbox>
          <v-checkbox disabled label="Add In Depth Viewing of Console/Harv Locations on the map"></v-checkbox>
          <v-checkbox disabled label="Use High Def Screenshots for heatmap generation (The Ones I was given are the wrong size!)"></v-checkbox>
          <v-checkbox disabled label="Add a way to view the screenshots in the app"></v-checkbox>
        </v-card-text>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from "../api";

export default {
  name: "HomePage",
  data() {
    return {
      loading: false,
      isConnected: false,
    };
  },
  methods: {
      checkConnection() {
        this.loading = true;
        api.get("/healthcheck")
          .then((response) => {
            this.loading = false;
            console.log("Healthcheck response:", response);
            this.isConnected = true;
          })
          .catch((error) => {
            console.error("Error fetching healthcheck:", error);
            this.isConnected = false;
          });
      },
    },
    mounted() {
      this.checkConnection();
    },
};
</script>
