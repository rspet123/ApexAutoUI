<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4">
          <!-- take match id input-->
          <h3 class="text-center">Enter Match ID</h3>
          <v-text-field
            v-model="matchId"
            label="Match ID"
            class="mb-4"
          ></v-text-field>
          <v-btn tonal @click="getMatchData" color="primary" block
            >Get Match Data</v-btn
          >
          <v-card v-if="loading" class="mt-4">
            <v-progress-linear indeterminate color="red"></v-progress-linear>
            <p>Loading...</p>
          </v-card>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Match Data</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <strong>Organizer:</strong> {{ matchData.organizer_name }}
              </v-col>
              <v-col> <strong>Event:</strong> {{ matchData.event_id }} </v-col>
            </v-row>
            <v-alert
              v-if="matchData.has_livedata"
              type="success"
              class="mt-4"
              dense
            >
              <v-icon left>mdi-check</v-icon>
              Live data is available
            </v-alert>
            <v-alert v-else type="error" class="mt-4" dense>
              <v-icon left>mdi-close</v-icon>
              Live data is not available
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card-title>Games</v-card-title>
        <v-data-table
          :items="matchGamesData"
          :headers="gamesTableHeaders"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Map</v-card-title>
          <!-- Dropdown to select map-->
           <v-row>
           <v-select
             v-model="selectedMap"
             :items="mapData"
             :return-object="true"
             item-text="name"
             item-title="name"
             label="Select Map"
             placeholder="No maps available"
             @change="onMapSelect()"
           ></v-select>
           <v-select
              v-model="filters.ringNumber"
              :items="ringNumberOptions"
              label="Select Ring Number"
              placeholder="No rings available"
            ></v-select>
            <v-btn @click="resetFilters">Reset Filters</v-btn>
           </v-row>
          <v-card-text>
            <RingMap
              mapImage="https://overstat.gg/maps/mp_rr_tropic_island_mu2.webp"
              :mapObject="selectedMap"
              :rings="filteredRings"
            ></RingMap>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from "../api";
import RingMap from "@/components/RingMap.vue";
import { map_data_list } from "../mapdata.js";

export default {
  name: "RingPage",
  components: {
    RingMap,
  },
  data() {
    return {
      matchId: null,
      loading: false,
      matchData: {},
      matchGamesData: [],
      selectedMap: null,
      mapData: map_data_list,
      gamesTableHeaders: [
        { text: "Game Number", value: "game" },
        { text: "Map", value: "map_name" },
        { text: "Match ID", value: "matchId" },
        {
          text: "Game Time",
          value: "match_start",
          formatter: (value) => new Date(value * 1000).toLocaleString(),
        },
        { text: "Source", value: "source" },
        { text: "Status", value: "status" },
      ],
      ringData: [],
      ringNumberOptions: [0,1,2,3,4],
      filteredRings: [],
      filters: {
        ringNumber: -1,
  
      }
    };
  },
  watch : {
    selectedMap: function() {
      this.ringData = [];
      this.getMapRings();
    },
    filters: {
      handler: function() {
        this.filterRings();
      },
      deep: true
    }
  },
  methods: {
    getMatchData() {
      this.loading = true;
      if (!this.matchId) {
        this.loading = false;
        return;
      }
      api
        .get("/match_data/" + this.matchId)
        .then((response) => {
          console.log(response.data);
          this.matchData = response.data.match_info.match;
          this.matchGamesData = response.data.match_info.games;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    getMapRings() {
      let mapId = this.selectedMap ? this.selectedMap.image : "";
      console.log("Getting rings for map", mapId);
      api
        .get("/rings/" + mapId)
        .then((response) => {
          console.log(response.data);
          this.ringData = response.data;
          this.filterRings();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    onMapSelect() {
      console.log("Selected map", this.selectedMap);
      console.log(this.mapData);
      this.ringData = [];
      this.getMapRings();
    },
    filterRings() {
      // Filter rings based on ring number
      let filteredRings = this.ringData.filter(ring => {
        console.log(ring.zone_number, this.filters.ringNumber);
        return this.filters.ringNumber == -1 || ring.zone_number == this.filters.ringNumber;
      });

      // Do More Filtering Here

      this.filteredRings = filteredRings;
    },
    resetFilters() {
      this.filters = {
        ringNumber: -1,
      };
    }
  },
};
</script>
