import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import MapsPage from "@/views/MapsPage.vue";
import AnalysisPage from "@/views/AnalysisPage.vue";

// Define your routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/maps",
    name: "Maps",
    component: MapsPage,
  },
  {
    path: "/analysis",
    name: "Analysis",
    component: AnalysisPage,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
