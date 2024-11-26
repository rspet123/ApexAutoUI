<template>
  <div>
    <h1>Analyser</h1>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn @click="startAnalysis">Start Analysis</v-btn>
                <v-btn @click="stopAnalysis" disabled>Stop Analysis*</v-btn> 
                <v-btn @click="resetAnalysis">Reset Analysis</v-btn> 
            </v-col>
            <v-col>
                <h3>
                    Number of Screenshots to Analyze
                </h3>
                <v-slider v-model="numToAnalyze" :max="screenshotCount" thumb-label="always" step="1"></v-slider>
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
        return {
            screenshotCount: 0,
            numToAnalyze: 0,
        };
    },
    methods: {
        startAnalysis() {
            api.post('/analyze', { num_to_analyze: this.numToAnalyze })
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
        },
        getScreenshotCount() {
            api.get('/analysis_status')
        .then(response => {
          this.screenshotCount = response.data.total_unprocessed;
          print(response.data.total_unprocessed);
        })
        .catch(error => {
          console.error('Error fetching analysis status:', error);
        });
        },

    }
};
</script>
