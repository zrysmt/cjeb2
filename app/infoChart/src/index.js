/***全局变量***/
import gVar from './map/global.js'

/***二维平面图***/
import Map2D from './map/map2D';
/*二维地图作为底图*/
import Chart from './chart/chart';

/***cesium 三维地球***/
import Map3D from './map/map3D';
import Chart3D from './chart/chart3D';
import SpaceCube from './chart/spaceCube';


import FlowMap from './chart/flowMap';
import HeatLayer from './chart/heatLayer';
import ThematicMap from './chart/thematicMap';
import MigrateLayer from './chart/migrateLayer';
/***工具库***/

import LiquidChart from './tools/liquidchart/liquidchart';
import InfoModal from './tools/infoModal/infoModal';
import TimeLine from './tools/timeLine/timeLine';
import SelectPane from './tools/selectPane/selectPane';

/***地理分析***/
import GeoAnalyse from './geo/geoAnalyse';
import GeoAnalyse3D from './geo/geoAnalyse3D';


export {gVar,Map2D,Chart,Map3D,SpaceCube,Chart3D,FlowMap,HeatLayer,ThematicMap,
    MigrateLayer,LiquidChart,InfoModal,TimeLine,SelectPane,
	GeoAnalyse,GeoAnalyse3D};