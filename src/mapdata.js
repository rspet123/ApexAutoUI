const map_coord_data = {
  storm_point: {
    x: 104e3,
    y: 104e3,
    ox: -52000,
    oy: 52000,
  },
  worlds_edge: { // I think this is wrong, but I'm not sure 
    x: 45e3, // should be 90e3?
    y: 45e3, // should be 90e3?
    ox: 0, // should be -45000?
    oy: 0, // should be 45000?
  },
  "e-district": {
    x: 45e3, // should be 90e3?
    y: 45e3, // should be 90e3? 
    ox: 0, // should be -45000? 
    oy: 0, // should be 45000?
  },
  olympus: {
    x: 45e3,  
    y: 44e3,  
    ox: 8e3, 
    oy: -2e3,
  },
  kings_canyon: {
    x: 40750,
    y: 40750,
    ox: -3250,
    oy: -3250,
  },
  broken_moon: {
    x: 40000,
    y: 40000,
    ox: 0,
    oy: 0,
  },
};

const map_data = {
  storm_point: {
    name: "Storm Point",
    image: "mp_rr_tropic_island_mu2.webp",
    mapKey: "storm_point",
  },
  worlds_edge: {
    name: "World's Edge",
    image: "mp_rr_desertlands_hu.webp",
    mapKey: "worlds_edge",
  },
  "e-district": {
    name: "E-District",
    image: "mp_rr_district.webp",
    mapKey: "e-district",
  },
  olympus: {
    name: "Olympus",
    image: "mp_rr_olympus_mu2.webp",
    mapKey: "olympus",
  },
  kings_canyon: {
    name: "Kings Canyon",
    image: "mp_rr_canyonlands_hu.webp",
    mapKey: "kings_canyon",
  },
  broken_moon: {
    name: "Broken Moon",
    image: "mp_rr_divided_moon_mu1.webp",
    mapKey: "broken_moon",
  }
};

// map_data_list is an array of the map_data object values
const map_data_list = [
  { name: "Storm Point", image: "mp_rr_tropic_island_mu2", mapKey: "storm_point" },
  { name: "World's Edge", image: "mp_rr_desertlands_hu", mapKey: "worlds_edge" },
  { name: "E-District", image: "mp_rr_district", mapKey: "e-district" },
  { name: "Olympus", image: "mp_rr_olympus_mu2", mapKey: "olympus" },
  { name: "Kings Canyon", image: "mp_rr_canyonlands_hu", mapKey: "kings_canyon" },
  { name: "Broken Moon", image: "mp_rr_divided_moon_mu1", mapKey: "broken_moon" }
]

const map_id = {
  mp_rr_divided_moon_mu1: "broken_moon",
  mp_rr_tropic_island_mu2: "storm_point",
  mp_rr_district: "e-district",
  mp_rr_olympus_mu2: "olympus",
  mp_rr_desertlands_hu: "worlds_edge",
  mp_rr_canyonlands_hu: "kings_canyon",
};
  

function mapCordX(t, mapKey) {
    let e = (t + map_coord_data[mapKey].ox) / map_coord_data[mapKey].x;
    return 1024 * e + 1024;
  }
  
  function mapCordY(t, mapKey) {
    let e = (-t - map_coord_data[mapKey].oy) / map_coord_data[mapKey].y;
    return 1024 * e + 1024;
  }
  
  function mapCordR(t, mapKey) {
    let e = t / map_coord_data[mapKey].x;
    return 1024 * e;
  }

//  currentRingLocation() {
//    if (!this.currentRingClosing)
//        return this.nextRing ? {
//            x: this.nextRing.startCenter.x,
//            y: this.nextRing.startCenter.y,
//            r: this.nextRing.startSize
//        } : {
//            x: 0,
//            y: 0,
//            r: 1e5
//        };
//    let t = this.currentRingClosing.startCenter
//      , e = this.currentRingClosing.endCenter
//      , s = e.x - t.x
//      , a = e.y - t.y
//      , i = this.currentRingClosing.startSize - this.currentRingClosing.endSize;
//    return s *= this.ringProgression,
//    a *= this.ringProgression,
//    i *= this.ringProgression,
//    {
//        x: t.x + s,
//        y: t.y + a,
//        r: this.currentRingClosing.startSize - i
//    }
//}






export { map_data, map_id, mapCordX, mapCordY, mapCordR, map_data_list };