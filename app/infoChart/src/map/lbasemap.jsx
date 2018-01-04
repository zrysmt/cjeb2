/**
 * 可视化模块 leaflet底图
 * @Date 2017-6-19
 *  [option] 配置
 *      option={{size:5}}
 *  [mapType] 地图类型
 *  [osmGeocoder] 是否显示osmGeocoder
 *  [scale]  是否显示比例尺
 *  [maptypebar] 是否显示地图切换按钮
 *  [center] 中心点坐标 
 *  [zoom]   zoomLevel
 * <Lbasemap mapType="geoq_normalm3" scale={true} osmGeocoder={true} maptypebar={true}>
 *  </Lbasemap>
 */
import './common/css/leaflet.css';
import './lbasemap.scss';
import gVar from './global';

import React,{Component} from 'react';
import L from 'leaflet';
import "./common/css/Control.OSMGeocoder.css";
import "./common/leaflet-plugin/Control.OSMGeocoder.js";

import util from './common/util.jsx';
import Eventful from './common/eventful.js';

import mapTypes from './maptypes.js';

class Lbasemap extends Component{
	constructor(props){
        super(props);
        this.state = {
            center:[30,104],
            zoom:4,
            data:[]
        };
    }
    
    componentDidMount(){
		util.adaptHeight('lmap',105,300);//高度自适应

		let map = L.map('lmap',{
			crs:L.CRS.EPSG3857 //默认墨卡托投影 ESPG：3857
		});
		let center = this.props.center;
		let zoom =  this.props.zoom;
		map.setView(center,zoom); 
		this.map = map;
        gVar.map = map;
        //地图底图类型
		let mapTypeProps = this.props.mapType;
		if(!mapTypeProps){
			let osm = mapTypes.osm;
			osm.addTo(map);
		}else{
			let type = mapTypes[mapTypeProps];
			type.addTo(map);
		}
			   
		if(this.props.scale) L.control.scale().addTo(map); //比例尺
		if(this.props.osmGeocoder) this.osmGeocoderGen();
		if(this.props.maptypebar) this.handleMaptypebar();
        this.handleEventListener();
    }
    
    handleEventListener(){
        let map = this.map;
        let isDispatchMove = true;
        map.on('zoomend',(event)=>{
            let zoom = map.getZoom();
            Eventful.dispatch('twoZoom',zoom);
        })
        map.on('moveend',(event)=>{
            if(__DEV__) console.log('moveend move',map.getCenter());
            Eventful.dispatch('twoMove',map.getCenter());
        });
        Eventful.subscribe('threeCenter',(center)=>{
            this.map.setView(center);
        });
        Eventful.subscribe('threeZoom',(zoom)=>{
            map.setZoom(map.getZoom()+zoom);
        })
    }
    componentWillUnmount(){
    	if(this.d3Overlay)
            this.d3Overlay.onRemove(this.map);
        if(this.map) this.map.remove();
    }
    handleMaptypebar(){
    	let map = this.map;
		let editableLayers = new L.FeatureGroup();
		let drawnItems = editableLayers.addTo(map);   

		let baseLayers = {
            'OpenStreetMap': mapTypes.osm,
            "Google地图": mapTypes.googleNormal,
            "Google卫星": mapTypes.googleImage,
            "天地图": mapTypes.tianDituLayersNormal,
            "天地图影像": mapTypes.tianDituLayersImage,
            "高德地图": mapTypes.gaodeLayersNormal,
            "高德地图影像": mapTypes.gaodeLayersImage,
            "百度地图": mapTypes.baiduNormal,
            "百度卫星地图": mapTypes.baiduStellite,
            "Geoq地图": mapTypes.geoq_normalm1,
            "Geoq多彩": mapTypes.geoq_normalm2,
            "Geoq午夜蓝": mapTypes.geoq_normalm3,
            "Geoq灰色": mapTypes.geoq_normalm4,
            "Geoq暖色": mapTypes.geoq_normalm5,
            "Geoq冷色": mapTypes.geoq_normalm6,
            "Mapbox darkV9":mapTypes.darkV9,
            "Mapbox trafficNight":mapTypes.trafficNight,
            "Mapbox satellite":mapTypes.satellite,
            '黑白图': mapTypes.tonerLayer,
            '地形图': mapTypes.terrainLayer,
            '水域图': mapTypes.watercolorLayer,
            '地震图': mapTypes.prccEarthquakesLayer
        };

        this.baseLayers = baseLayers;
        L.control.layers(baseLayers, { '天地图标注':mapTypes.tianDituLayersAnno ,'绘制图层': drawnItems }, { position: 'topleft', collapsed: true }).addTo(map);    	
    }
    osmGeocoderGen(){
    	let osmGeocoder = new L.Control.OSMGeocoder({
    		collapsed: false,
    		position: 'topright',
    		text: 'Search',
		});
		osmGeocoder.addTo(this.map);
    }
	render(){
		return(
			<div id="lmap">
			</div>
		)
	}
}

export default Lbasemap;