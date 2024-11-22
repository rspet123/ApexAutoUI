<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Maps</h1>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row dense v-if="!loading">
      <v-col v-for="(map, mapName) in maps" :key="mapName" cols="12" md="4">
        <v-card @click="openMapDetails(map)">
          <v-img
            :src="map.metadata.map_image"
            :alt="map.metadata.map_name"
            height="200px"
            class="align-end"
            cover
          >
          <v-card-title class="map-title" v-text="map.metadata.map_name"></v-card-title>
        </v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>{{ selectedMap?.metadata.map_name }} - Info</v-card-title>
        <v-card-text>
          <v-img
            :src="selectedMap?.metadata.map_image"
            :alt="selectedMap?.metadata.map_name"
            height="300px"
          ></v-img>
          <v-tabs v-model="activeTab">
            <v-tab :value="1">Zone Percentages</v-tab>
            <v-tab :value="2">Info</v-tab>
            <v-tab :value="3">Map Settings</v-tab>
          </v-tabs>
          <v-tabs-window v-model="activeTab" v-if="!loading">
            <v-tabs-window-item :value="1">
              <div v-if="selectedMapData && selectedMapData.zone_percentages">
                <h3>Zone Percentages</h3>
                <v-row>
                  <v-col
                    v-for="(
                      percentages, zone
                    ) in selectedMapData?.zone_percentages"
                    :key="zone"
                    cols="12"
                    md="6"
                  >
                    <v-card class="mb-4">
                      <v-card-title>{{ zone }} </v-card-title>
                      <v-card-text>
                        X {{ selectedMap?.zones[zone][0] }}, Y
                        {{ selectedMap?.zones[zone][1] }}
                      </v-card-text>
                      <v-progress-linear
                        :model-value="percentages.consoles * 100"
                        color="warning"
                      ></v-progress-linear>
                      <v-card-text>
                        Console Spawn Rate:
                        {{ (percentages.consoles * 100).toFixed(0) }}%
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-tabs-window-item>
            <v-tabs-window-item :value="2">
              <v-card>
                <v-card-title>Info</v-card-title>
                <v-card-text>
                  <pre>{{ selectedMap?.metadata }}</pre>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
            <v-tabs-window-item :value="3">
              <v-card>
                <v-card-title>Map Thresholds</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-slider
                        v-model="mapThresholds[selectedMap?.metadata.map_name].harvester_threshold"
                        label="Harvester Threshold"
                        min="0"
                        max="1"
                        step="0.01"
                        thumb-label="always"
                      ></v-slider>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-slider
                        v-model="mapThresholds[selectedMap?.metadata.map_name].console_threshold"
                        label="Console Threshold"
                        min="0"
                        max="1"
                        step="0.01"
                        thumb-label="always"
                      ></v-slider>
                    </v-col>
                    <v-col cols="12">
                      <v-btn color="primary" @click="saveMapThresholds(selectedMap?.metadata.map_name,mapThresholds[selectedMap?.metadata.map_name].harvester_threshold,mapThresholds[selectedMap?.metadata.map_name].console_threshold)">Save</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
          <v-progress-linear v-else indeterminate color="red"></v-progress-linear>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "../api";
export default {
  name: "MapsPage",
  data() {
    return {
      maps: {},
      loading: false,
      dialog: false,
      selectedMap: null,
      selectedMapData: null,
      activeTab: 0,
      mapThresholds: {}
    };
  },
  created() {
    this.fetchMaps();
  },
  methods: {
    fetchMaps() {
      this.loading = true;
      Promise.all([
        api.get("/map_data"),
        api.get("/thresholds")
      ]).then(([mapsResponse, thresholdsResponse]) => {
        this.maps = mapsResponse.data;
        this.mapThresholds = thresholdsResponse.data;
        this.loading = false;
      }).catch((error) => {
        console.error("Error fetching maps data:", error);
        this.loading = false;
      });
    },
    fetchMapData(mapName) {
      this.loading = true;
      api
        .get("/map_all/" + mapName)
        .then((response) => {
          this.selectedMapData = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching map data:", error);
          this.loading = false;
        });
    },
    openMapDetails(map) {
      this.selectedMap = map;
      this.dialog = true;
      // clean the mapname/strip the spaces
      let map_name = map.metadata.map_name.replace(/\s/g, "_");
      this.fetchMapData(map_name);
    },
    watch: {
      activeTab(newVal) {
        console.log("TAB CHANGED", newVal);
      }
    },
    saveMapThresholds(map, harvester_threshold, console_threshold) {
      let map_name = map.replace(/\s/g, "_");
      api.post("/thresholds/" + map_name, {
          harvester_threshold: harvester_threshold,
          console_threshold: console_threshold,
        })
        .then((response) => {
          this.mapThresholds[map_name] = {
            "harvester_threshold": harvester_threshold, 
            "console_threshold": console_threshold
          }
          console.log("Thresholds saved", response);
        })
        .catch((error) => {
          console.error("Error saving thresholds:", error);
        });
    },  
  },
};
</script>

<style>
.map-item {
  margin-bottom: 20px;
}

.map-icon {
  width: 200px;
  height: auto;
}

.map-title {
  font-size: 32px !important;
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  font-weight: bold;
}
</style>
