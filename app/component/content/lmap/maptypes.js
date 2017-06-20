/**
 * leftlet的配置项
 * @Date 2017-6-19
 */
import L from 'leaflet';
import '../../../common/leaflet-plugin/leaflet.ChineseTmsProviders.js'; //源码上有修改
// import '../../../common/baiduMapAPI-2.0-min.js';

import '../../../common/plugin/leaflet.baidu.js';
import "../../../common/tile.stamen.js";

let maxMinZoom = {
    maxZoom: 18,
    minZoom: 3
};

//天地图
let t_normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', maxMinZoom),
    t_normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', maxMinZoom),
    t_imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', maxMinZoom),
    t_imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', maxMinZoom);
//高德地图
let gd_normalm = L.tileLayer.chinaProvider('GaoDe.Normal.Map', maxMinZoom),
    gd_imgm = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', maxMinZoom),
    gd_imga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', maxMinZoom);
//百度地图
let baiduNormal = new L.TileLayer.BaiduLayer("Normal.Map"),
    baiduImage = new L.TileLayer.BaiduLayer("Satellite.Map"),
    baiduRoad = new L.TileLayer.BaiduLayer("Satellite.Road");

//mapbox
const token = "pk.eyJ1IjoidGVjaGZlIiwiYSI6ImNqMHVrMmt1cDA0Y2czMm10dWlsb3UzcmEifQ.B28sl4Ds0bQKD706bgdzUg";  //mapbox 
    
let mapType = {
    osm: L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }),
    googleImage: L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        attribution: 'google'
    }),
    googleNormal: L.tileLayer.chinaProvider('Google.Normal.Map', maxMinZoom),
    baiduNormal:baiduNormal,
    baiduImage:baiduImage,
    baiduRoad:baiduRoad,
    baiduStellite: L.layerGroup([baiduImage, baiduRoad]),
    tianDituLayersNormal: L.layerGroup([t_normalm, t_normala]),
    tianDituLayersAnno: t_normala,
    tianDituLayersImage: L.layerGroup([t_imgm, t_imga]),
    gaodeLayersNormal: L.layerGroup([gd_normalm]),
    gaodeLayersImage: L.layerGroup([gd_imgm, gd_imga]),
    geoq_normalm1: L.tileLayer.chinaProvider('Geoq.Normal.Map', maxMinZoom),
    geoq_normalm2: L.tileLayer.chinaProvider('Geoq.Normal.Color', maxMinZoom),
    geoq_normalm3: L.tileLayer.chinaProvider('Geoq.Normal.PurplishBlue', maxMinZoom),
    geoq_normalm4: L.tileLayer.chinaProvider('Geoq.Normal.Gray', maxMinZoom),
    geoq_normalm5: L.tileLayer.chinaProvider('Geoq.Normal.Warm', maxMinZoom),
    geoq_normalm6: L.tileLayer.chinaProvider('Geoq.Normal.Cold', maxMinZoom),
    darkV9:L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=' + token),
    trafficNight: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2/tiles/256/{z}/{x}/{y}?access_token=' + token),
    satellite: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + token),
    tonerLayer: new L.StamenTileLayer('toner', {
            detectRetina: true
    }),
    terrainLayer:new L.StamenTileLayer('terrain'),
    watercolorLayer:new L.StamenTileLayer('watercolor'),
    prccEarthquakesLayer:L.tileLayer('http://{s}.tiles.mapbox.com/v3/bclc-apec.map-rslgvy56/{z}/{x}/{y}.png', {
          attribution: 'Map &copy; Pacific Rim Coordination Center (PRCC).  Certain data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    })
    
}

export default mapType;
