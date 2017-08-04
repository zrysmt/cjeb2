/**
 * 可视化模块 leaflet底图
 * @Date 2017-6-19
 *  [mapType] 地图类型
 *  [osmGeocoder] 是否显示osmGeocoder
 *  [scale]  是否显示比例尺
 *  [maptypebar] 是否显示地图切换按钮
 *  [center] 中心点坐标 
 *  [zoom]   zoomLevel
 * <Lbasemap mapType="geoq_normalm3" scale={true} osmGeocoder={true} maptypebar={true}>
 *  </Lbasemap>
 */
import './lbasemap.scss';

import React from 'react';
import L from 'leaflet';

import "../../../common/css/Control.OSMGeocoder.css";
import "../../../common/leaflet-plugin/Control.OSMGeocoder.js";
import  '../../../common/Leaflet.WebGL/src/L.WebGL.js';

import util from '../../../common/util.jsx';
import Eventful from '../../../common/eventful.js';

import mapTypes from './maptypes.js';

class Lbasemap extends React.Component{
	constructor(props){
        super(props);
        this.state = {
            center:[30,104],
            zoom:5,
            data:[]
        };
    }
    componentWillReceiveProps(props){
	    if(props.data&&props.data.length!=0) {
            this.setState({data:props.data},()=>{
                let res = [];
                this.state.data.forEach((d,i)=>{
                    d.x = d.lat;
                    d.y = d.lng;
                    res.push(d);
                });

                console.log('webGLLayer res',res);
                let webGLLayer = new L.TileLayer.WebGL({
                    data:res
                });
                this.map.addLayer(webGLLayer);
            })
        }
    }
    componentDidMount(){
		util.adaptHeight('lmap',105,300);//高度自适应

		let map = L.map('lmap',{
			crs:L.CRS.EPSG3857 //默认墨卡托投影 ESPG：3857
		});
		let center = this.props.center||[30,104];
		let zoom =  this.props.zoom||5;
		map.setView(center,zoom); 
		this.map = map;
        //地图底图类型
		let mapTypeProps = this.props.mapType;
		if(!mapTypeProps){
			let osm = mapTypes.osm;
			osm.addTo(map);
		}else{
			let type = mapTypes[mapTypeProps];
			type.addTo(map);
		}
			   
		if(this.props.scale&&this.props.scale) L.control.scale().addTo(map); //比例尺
		if(this.props.osmGeocoder&&this.props.osmGeocoder) this.osmGeocoderGen();
		if(this.props.maptypebar&&this.props.maptypebar) this.handleMaptypebar();
	
    }
    componentWillUnmount(){
    	this.map.remove();
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
		osmGeocoder.addTo(map);
    }
	render(){
		return(
			<div id="lmap">
			</div>
		)
	}
}

export default Lbasemap;