<template>
  <div
    ref="canvasContainer"
    style="position: relative; width: 100%; height: 100%"
  >
    <img ref="mapImage" class="map-image" :src="mapImage" />
    <canvas ref="fabricCanvas"></canvas>
  </div>
</template>

<script>
import { Canvas, Circle } from "fabric";
import { map_data, mapCordX, mapCordY, mapCordR } from "../mapdata.js";

export default {
  name: "MapDrawer",
  props: {
    rings: Array, // Array of ring objects
    mapObject: Object, // Object containing map data
  },
  data() {
    return {
      canvas: null,
    };
  },
  computed: {
    mapImage() {
      let imgurl = this.mapObject ? "https://overstat.gg/maps/" + this.mapObject.image + ".webp" : "";
      return imgurl;
    },
  },
  mounted() {
    this.initializeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
    console.log(map_data);
    console.log(mapCordX(0, "e-district"));
    console.log(mapCordY(0, "e-district"));
  },
  methods: {
    initializeCanvas() {
      const canvasElement = this.$refs.fabricCanvas;

      // Set the initial canvas size to 1024x1024
      // canvasElement.width = 1024;
      // canvasElement.height = 1024;

      // Initialize the Fabric.js canvas
      this.canvas = new Canvas(canvasElement, {
        width: 1024,
        height: 1024,
        backgroundColor: "transparent",
        selection: false,
      });

      // this.addRing(10, 212, 0, 603.3);
      // this.addRing(292, 212, 0, 295.1);
      // this.addRing(382, 212, 0, 182.1);
      // this.addRing(482, 212, 0, 91.2);
      // this.addRing(552, 232, 0, 45.5);
    },
    resizeCanvas() {
      console.log("Resizing canvas");
    },
    addRing(x, y, z, rad, color = "red") {
      // console.log("Adding ring at", x, y, z, rad);
      const circle = new Circle({
        radius: rad,
        fill: "transparent",
        top: y,
        left: x,
        originX: "center", // Position relative to center
        originY: "center",
        selectable: false,
        stroke: color,
        strokeWidth: 2,
      });
      this.canvas.add(circle);
    },
  },
  watch: {
    rings: {
      handler(newRings) {
        this.canvas.clear();
        newRings.forEach((ring) => {
          
          
          let NewX = mapCordX(ring.x, "storm_point");
          let NewY = mapCordY(ring.y, "storm_point");
          let newR = mapCordR(ring.size, "storm_point");
          let color = "#" + ((ring.game_id * 9301 + 49297) % 16777215).toString(16);
          // console.log("old x,y,r", ring.x, ring.y, ring.size);
          // console.log("ring x,y,r", NewX, NewY, newR);
          //if(ring.game_id == 56583){
          //  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
          //  console.log("Ring", ring);
          //  color = "red";
          //  
          //}
          // Hash gameId to color
          this.addRing(NewX, NewY, 0, newR, color);
          
          
        });
      },
      deep: true,
    },
  },
};
</script>

<style>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.map-image {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}
.fabric-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
