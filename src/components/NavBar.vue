<template>
  <v-app-bar app>
    <v-toolbar-title>Wasabïï</v-toolbar-title>
    <v-btn text :to="{ path: '/' }" router>Home</v-btn>
    <v-btn text :to="{ path: '/maps' }" router>Maps</v-btn>
    <v-btn text :to="{ path: '/analysis' }" router>Analysis</v-btn>
    <v-btn text @click="settings = true">
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-progress-linear
      v-if="isAnalyzing"
      :model-value="progress * 100"
      :buffer-value="(progress * 100) + .1"
      color="warning"
      height="10"
      class="fixed-bottom"
    ></v-progress-linear>
    <div v-if="isAnalyzing">Processed: {{ this.processed}} / {{this.processed + this.unprocessed}} </div>
    <div v-if="isAnalyzing && progress === 1"> -Cleaning Up...</div>
  </v-app-bar>

  <v-dialog v-model="settings" max-width="500px">
    <v-card>
      <v-card-title>Settings</v-card-title>
      <v-card-text>
        <!-- Automation Settings -->
        <!-- Evo Timeout & Map Timeout, In Minutes, 1-10 -->
        <h3> Timeouts </h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="evoTimeout"
              label="Evo Timeout"
              type="number"
              min="1"
              max="10"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="mapTimeout"
              label="Map Timeout"
              type="number"
              min="1"
              max="10"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- Spacer -->
        <v-divider></v-divider>
        <v-divider></v-divider>
        <h3>Thresholds</h3>
        <v-row>
          <v-col cols="6" md="6">
            <v-slider
              v-model="OOBThreshold"
              label="OOB"
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              thumb-label="always"
            ></v-slider>
          </v-col>
          <v-col cols="6" md="6">
            <v-slider
              v-model="evoThreshold"
              label="EVO"
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              thumb-label="always"
            ></v-slider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-slider
              v-model="jumpThreshold"
              label="Jump"
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              thumb-label="always"
            ></v-slider>
          </v-col>
          <v-col cols="6" md="6">
            <v-slider
              v-model="leaveThreshold"
              label="Leave"
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              thumb-label="always"
            ></v-slider>
          </v-col>
        </v-row>
        <h3>Analysis</h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-slider
              v-model="confirmationThreshold"
              title="Confirmation Threshold"
              label="Confirmation"
              type="number"
              min="0.01"
              max="1"
              step="0.01"
              thumb-label="always"
            ></v-slider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-slider
              v-model="whitelistDistance"
              title="Whitelist Distance"
              label="Whitelist"
              type="number"
              min="1"
              max="100"
              step="1"
              thumb-label="always"
            ></v-slider>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveSettings">Save</v-btn>
        <v-btn color="primary" @click="settings = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import api from "../api";

export default {
  name: "NavBar",
  data() {
    return {
      settings: false,
      evoTimeout: 5,
      mapTimeout: 5,
      OOBThreshold: 0.65,
      evoThreshold: 0.65,
      jumpThreshold: 0.65,
      leaveThreshold: 0.65,
      confirmationThreshold: 0.65,
      whitelistDistance:25,
      isAnalyzing: false,
      progress: 0,
      processed: 0,
      unprocessed: 0,
    };
  },
  mounted() {
    this.checkAnalysisStatus();
    this.getSettings();
    this.interval = setInterval(this.checkAnalysisStatus, 1000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    checkAnalysisStatus() {
      api.get('/analysis_status')
        .then(response => {
          this.isAnalyzing = response.data.is_analyzing === "1";
          this.progress = response.data.total_processed / (response.data.total_unprocessed + response.data.total_processed);
          this.processed = response.data.total_processed;
          this.unprocessed = response.data.total_unprocessed;
        })
        .catch(error => {
          console.error('Error fetching analysis status:', error);
        });
    },
    getSettings() {
      api.get('/settings')
        .then(response => {
          this.evoTimeout = response.data.evo_timeout;
          this.mapTimeout = response.data.map_timeout;
          this.OOBThreshold = response.data.eliminated_threshold;
          this.evoThreshold = response.data.evo_threshold;
          this.jumpThreshold = response.data.jumpmaster_threshold;
          this.leaveThreshold = response.data.leave_match_threshold;
          this.confirmationThreshold = response.data.console_confirmation_threshold;
          this.whitelistDistance = response.data.console_whitelist_distance;
        })
        .catch(error => {
          console.error('Error fetching settings:', error);
        });
    },
    saveSettings() {
      this.settings = false;
      api.post('/settings', {
        evo_timeout: this.evoTimeout,
        map_timeout: this.mapTimeout,
        eliminated_threshold: this.OOBThreshold,
        evo_threshold: this.evoThreshold,
        jumpmaster_threshold: this.jumpThreshold,
        leave_match_threshold: this.leaveThreshold,
        console_confirmation_threshold: this.confirmationThreshold,
        console_whitelist_distance: this.whitelistDistance
      })
        .then(response => {
          console.log('Settings saved:', response);
        })
        .catch(error => {
          console.error('Error saving settings:', error);
        });
    }
  }
};
</script>

<style scoped>
.v-btn {
  margin: 0 10px;
}
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
