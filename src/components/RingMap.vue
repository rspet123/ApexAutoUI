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
import { Canvas, Circle, Text } from "fabric";
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
      let imgurl = this.mapObject
        ? "https://overstat.gg/maps/" + this.mapObject.image + ".webp"
        : "";
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


    },
    resizeCanvas() {
      console.log("Resizing canvas");
    },
    addRing(x, y, z, rad, color = "red", title = "X") {
      const titleText = String(title);

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

      const hText = new Text(titleText, {
        left: circle.left,
        top: circle.top - 30,
        fontSize: 40,
        fill: "white",
        visible: false,
        fontFamily: "Arial",
      });

      this.canvas.add(circle);
      this.canvas.add(hText);

      // Add mouseover event to show text
      circle.on("mouseover", () => {
        hText.set({
          visible: true,
        });
        this.canvas.renderAll();
      });

      // Add mouseout event to hide text
      circle.on("mouseout", () => {
        hText.set({
          visible: false,
        });
        this.canvas.renderAll();
      });
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
          this.addRing(NewX, NewY, 0, newR, color, ring.game_id + " - #" + ring.zone_number);
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
