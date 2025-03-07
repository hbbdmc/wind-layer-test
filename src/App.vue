<template>
  <div class="playground-content" ref="mapRef"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { transform,get as getProjection } from 'ol/proj';


  
// const styles = [new Style({image: shaft}), new Style({image: head})];

  defineOptions({
    name: 'OlParticles4326',
  });

  const mapRef = ref<HTMLDivElement>();

  let map;
  function interpolateColor(color1:any, color2:any, factor:any) {
    const r = Math.round(color1.r + (color2.r - color1.r) * factor);
    const g = Math.round(color1.g + (color2.g - color1.g) * factor);
    const b = Math.round(color1.b + (color2.b - color1.b) * factor);
    return `rgb(${r},${g},${b})`;
}

function parseColor(hex:any) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function stretchColor(startColorHex:any, endColorHex:any, steps:any) {
    const startColor = parseColor(startColorHex);
    const endColor = parseColor(endColorHex);
    const colors = [];
    for (let i = 0; i <= steps; i++) {
        const factor = i / steps;
        colors.push(interpolateColor(startColor, endColor, factor));
    }
    return colors;
}

const startColor = '#ff0000'; // 红色
const endColor = '#0000ff';   // 蓝色
const steps = 10;             // 生成10个颜色
const stretchedColors = stretchColor(startColor, endColor, steps);
async function initMap() {
  const Map = await import('ol/Map').then((res) => res.default);

  const View = await import('ol/View').then((res) => res.default);
  const TileLayer = await import('ol/layer/Tile').then((res) => res.default);
  const { WindLayer } = await import('ol-wind');
  const XYZ = await import('ol/source/XYZ').then((res) => res.default);
  const layer = new TileLayer({
    source: new XYZ({
      maxZoom: 18,
      url: `http://t{0-6}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${"0eec40b43abc87445dc3217ddeeb17f8"}`,
      projection: "EPSG:3857",//TODO:坐标系的含义？原始数据是4326也可以切片为3857吗?
      crossOrigin: "anonymous"
    }),
    // maxZoom:9,
    // minZoom:0
  });
  


  map = new Map({
    layers: [layer],
    target: mapRef.value,
    view: new View({
      // projection: 'EPSG:4326',
      projection: 'EPSG:3857',
      // center: [113.53450137499999, 34.44104525],
      center: transform([113.53450137499999, 34.44104525], "EPSG:4326", "EPSG:3857"),
      // center: [0,0],
      showFullExtent: true,
      zoom: 2,
    }),
    // pixelRatio: 2,
  });

  const res = await fetch('./windTest.json').then((res) => res.json());
  const data = res.data

  const windLayer = new WindLayer(data, {
    windOptions: {
      // colorScale: scale,
      velocityScale: 1 / 20,
      // paths: 5000,//宏观视角粒子数量
      paths: 5000,//宏观视角粒子数量
      // eslint-disable-next-line no-unused-vars
      colorScale: stretchedColors,
      lineWidth: 2,
      // colorScale: scale,
      generateParticleOption: false,
    },
    fieldOptions: {
      // xmin: xmin, // 经度最小值
      // ymin:  ymin, // 纬度最小值
      // xmax: xmax, // 经度最大值
      // ymax: ymax, // 纬度最大值

      wrapX: true,// 是否实现跨世界渲染
      // wrappedX: true,
      // translateX:true,
      // flipY: true, // 因为grib2json的问题，我们需要翻转 Y 轴数据
    },
  });

  map.addLayer(windLayer);
}
  onMounted(() => {
    initMap();
  });



 
</script>

<style>
  @import 'https://esm.sh/ol/ol.css';

  .playground-content {
    width: 100%;
    height: 800px;
  }
</style>
