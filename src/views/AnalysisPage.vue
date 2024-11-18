<template>
  <div>
    <h1>Analyser</h1>
    <v-container>
        <v-row>
            <v-col cols="12">
            <v-btn @click="startAnalysis">Start Analysis</v-btn>
            <v-btn @click="stopAnalysis">Stop Analysis</v-btn>
            <v-btn @click="resetAnalysis">Reset Analysis</v-btn>
            </v-col>
        </v-row>
    </v-container>
  </div>
</template>

<script>
import api from "../api";

export default {
  name: "AnalysisPage",
    data() {
        return {};
    },
    methods: {
        startAnalysis() {
            api.post('/analyze')
                .then(response => {
                    console.log('Analysis started:', response);
                })
                .catch(error => {
                    console.error('Error starting analysis:', error);
                });
        },
        stopAnalysis() {
            api.post('/stop_analysis')
                .then(response => {
                    console.log('Analysis stopped:', response);
                })
                .catch(error => {
                    console.error('Error stopping analysis:', error);
                });
        },
        resetAnalysis() {
            api.post('/reset_analysis')
                .then(response => {
                    console.log('Analysis reset:', response);
                })
                .catch(error => {
                    console.error('Error resetting analysis:', error);
                });
        }

    }
};
</script>
