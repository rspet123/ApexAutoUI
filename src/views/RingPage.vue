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
    </v-row>
    <v-row justify="center" class="mt-4">
      <v-col cols="8">
        <v-card>
          <v-card-title>Map</v-card-title>
          <v-card-text>
            <RingMap :mapObject="selectedMap" :rings="filteredRings"></RingMap>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>Filters</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedMap"
              :items="mapData"
              :return-object="true"
              item-text="name"
              item-title="name"
              label="Select Map"
              placeholder="No maps available"
              @change="onMapSelect"
              class="mb-4"
            ></v-select>
            <v-select
              v-model="filters.ringNumber"
              :items="ringNumberOptions"
              label="Select Ring Number"
              placeholder="All Rings"
              class="mb-4"
            ></v-select>
            <v-select
              v-model="filters.gameId"
              :items="gameIdOptions"
              label="Game"
              class="mb-4"
              multiple
              chips
              placeholder="All Games"
            >
            </v-select>
            <v-btn @click="resetFilters">Reset Filters</v-btn>
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
      ringNumberOptions: [0, 1, 2, 3, 4],
      gameIdOptions: [],
      filteredRings: [],
      filters: {
        ringNumber: null,
        gameId: [],
      },
    };
  },
  watch: {
    selectedMap: function () {
      this.ringData = [];
      this.getMapRings();
    },
    filters: {
      handler: function () {
        this.filterRings();
      },
      deep: true,
    },
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
          this.ringData = response.data;
          let gameIds = new Set();
          this.ringData.forEach((ring) => {
            gameIds.add(ring.game_id);
          });
          this.gameIdOptions = Array.from(gameIds);
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
      let filteredRings = this.ringData.filter((ring) => {
        let returnVal = true;
        if (this.filters.ringNumber !== null) {
          returnVal = ring.zone_number === this.filters.ringNumber;
          if (!returnVal) {
            return false;
          }
        }
        if (this.filters.gameId.length > 0) {
          returnVal = this.filters.gameId.includes(ring.game_id);
          if (!returnVal) {
            return false;
          }
        }
        return returnVal;
      });

      this.filteredRings = filteredRings;
    },
    resetFilters() {
      this.filters = {
        ringNumber: null,
        gameId: [],
      };
    },
  },
};
</script>
