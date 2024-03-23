<template>
  <LMap :zoom="5" :center="initLatLng">
    <LTileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
    <LMarkerRotate
      v-for="marker in locations"
      :key="marker.id"
      :lat-lng="marker.latlng"
      :rotationOrigin="marker.origin"
      :rotationAngle="marker.yaw"
      @mouseover="handleMarker(marker)"
    >
      <LTooltip>
        <p>ID: {{ detail?.id }}</p>
        <p>LatLng: [{{ detail?.latlng.lat }}, {{ detail?.latlng.lng }}]</p>
        <p>Angle: {{ detail?.yaw }} deg</p>
      </LTooltip>
    </LMarkerRotate>
  </LMap>
</template>

<script>
import { defineComponent } from 'vue';
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LTooltip } from '@vue-leaflet/vue-leaflet';
import LMarkerRotate from '@/components/VueLMarkerRotate.vue';

import 'leaflet/dist/leaflet.css';

function rand(n) {
  let max = n + 10;
  let min = n - 10;
  return Math.random() * (max - min) + min;
}

export default defineComponent({
  name: 'SamplePage',
  components: {
    LMap,
    LTileLayer,
    LTooltip,
    LMarkerRotate
  },
  data() {
    return {
      initLatLng: latLng(-2.5, 118),
      detail: null,
      locations: []
    };
  },
  mounted() {
    for (let index = 0; index < 10; index++) {
      this.locations.push({
        id: index,
        yaw: Math.random() * 360 - 180,
        origin: 'bottom center',
        latlng: new latLng(rand(-2.5), rand(118))
      });
    }
  },
  methods: {
    handleMarker(marker) {
      this.detail = marker;
    }
  }
});
</script>
