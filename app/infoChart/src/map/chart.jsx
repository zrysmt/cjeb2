/**
 * 二维地图作为底图模块,信息图可以是二维，三维的或者信息图表
 */
import React,{Component} from 'react';
import L from 'leaflet';
import * as d3 from 'd3';
import axios from 'axios';
import './common/leaflet-plugin/L.D3SvgOverlay';
import  './common/Leaflet.WebGL/src/L.WebGL.js';
import echartsIcon from './common/leaflet-plugin/echartsIcon.js'; //echartsLegend
import echartsLegend from './common/leaflet-plugin/echartsLegend.js'; //echartsLegend

import Eventful from './common/eventful.js';
import gVar from './global';

class Chart extends Component{
	constructor(props){
        super(props);
        this.state = {
            data:[]
        };

        this.scatterLayerGroup = L.layerGroup();
        this.multiScatterLayerGroup = L.layerGroup();
        this.pieLayerGroup = L.layerGroup();
        this.barLayerGroup = L.layerGroup();
    }	
	componentWillReceiveProps(props){
	    if(props.data&&props.data.length!=0) {
            this.setState({
            	data:props.data
            },()=>{
                let {show} = props;
                if(show) this.chartDisplayByType();
            })
        }
    }	
    chartDisplayByType(){
    	switch(this.props.type){
    		case 'scatter':
    			this.initScatterChart();
    			break;
			case 'pie':
				this.initPieChart();
    			break;    
			case 'bar':
                this.initBarChart();
    			break;    
			case 'multiScatter':
                this.initMultiScatterChart();
    			break;       		   					
    	}
    }
    initBarChart(zoom){
        this.map = gVar.map;
        let {data} = this.state;  
        if(!zoom) zoom = this.map.getZoom() || 5;     
        let baseIconSize = zoom,
            radius = '20%',
            index = 0;
        if(zoom <= 6 ){
            radius = zoom * 4 +'%';
        }else{
            radius = zoom * 8 +'%';
        }        
        //先清空
        let layerGroup = this.scatterLayerGroup;
        if(layerGroup.getLayers().length > 0){
            this.map.removeLayer(layerGroup);
            layerGroup.clearLayers();
            index++;
        }          
        let latlngs = [],legend = [],optionDatas = [];
        if(!data||data.length === 0) console.warn('数据为空');
        let total = 0;
        for (let key in data) {
            if(data[key]){
                let item = data[key];
                latlngs.push([item[0].lat,item[0].lng]);
                if(total === 0){
                    item.forEach((it,ind)=>{
                        legend.push(it.name);
                    })  
                }
                total++;
                let oneData = [];
                item.forEach((it,ind)=>{
                    oneData.push(+it.value)
                })
                optionDatas.push(oneData);
            }
        }
        
        let option = {          
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            grid:{
                show:false,
                borderColor:'#fff'
            },
            xAxis:[{
                type:'category',
                data:legend,
                boundaryGap:false,
                axisLine:{
                    lineStyle:{
                        color:'#fff'
                    }
                },                
                axisTick: {
                    show: true,
                    length:2
                },
                axisLabel:{
                    show:false,
                    rotate:90,
                    textStyle:{
                        fontSize:30 
                    }
                },
                
            }],
            yAxis:[{
                type: 'value',
                axisLine:{
                    show:false,
                    lineStyle:{
                        color:'#fff'
                    }
                },
                splitLine:{
                    show:false
                },
                axisTick: {
                    show: false
                },
                axisLabel:{
                    show:false,                
                }

            }],            
            series: [{
                name: '',
                type: 'bar',
                barWidth: '80%',
                barGap:'1',
                barCategoryGap:'1',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };        
        option = Object.assign({},this.props.option,option);
        option.datas = optionDatas;
        option.radius = radius;

        layerGroup = echartsIcon(this.map, latlngs, option, layerGroup);
        if(index== 0){
            //图例
            let legendOption = {
                type:'text',
                orient: 'vertical',
                left: 'left',
                width: "160px",
                height: "140px",
                color:'#ccc',      
                data: legend
            };
            legendOption = Object.assign({},legendOption,this.props.option.legend)
            echartsLegend(this.map, legendOption);               
        }
    }
    initPieChart(zoom){
    	this.map = gVar.map;
    	let {data} = this.state;
        if(!zoom) zoom = this.map.getZoom() || 5;     
        let baseIconSize = zoom,
            radius = '30%',
            index = 0;
        if(zoom <=6){
            radius = zoom * 4 +'%';
        }else{
            radius = zoom * 8 +'%';
        }
        //先清空
        let layerGroup = this.scatterLayerGroup;
        if(layerGroup.getLayers().length > 0){
            this.map.removeLayer(layerGroup);
            layerGroup.clearLayers();
            index ++;
        }    

		let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [{
                name: '',
                type: 'pie',
                radius: radius,
                center: ['50%', '50%'],
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        option = Object.assign({},this.props.option,option);
       
        //经纬度不能相同
        let latlngs = [],legend = [],optionDatas = [];
        if(!data||data.length === 0) console.warn('数据为空');
        let total = 0;
        for (let key in data) {
        	if(data[key]){
        		let item = data[key];
        		latlngs.push([item[0].lat,item[0].lng]);
        		if(total === 0){
        			item.forEach((it,ind)=>{
        				legend.push(it.name);
        			})	
        		}
        		total++;
        		optionDatas.push(item);
        	}
        }
        option.datas = optionDatas;

        layerGroup = echartsIcon(this.map, latlngs, option,layerGroup);
        if(index== 0) {
            //图例
            let legendOption = {
                orient: 'vertical',
                left: 'left',
                width: "160px",
                height: "140px",
                color:'#ccc',      
                data: legend
            };
            legendOption = Object.assign({},this.props.option.legend,legendOption)
            echartsLegend(this.map, legendOption);                  
        }
    }
    initMultiScatterChart(zoom){
        this.map = gVar.map;
        let {data} = this.state;    
        if(!data||data.length === 0) console.warn('数据为空');
        if(!zoom) zoom = this.map.getZoom() || 5;  
        let baseIconSize = zoom - 1;
        let layerGroup = this.multiScatterLayerGroup;
        if(layerGroup.getLayers().length > 0){
            this.map.removeLayer(layerGroup);
            layerGroup.clearLayers();
        }        

        let legend = [],optionDatas = [];
        let size = this.props.option.size?this.props.option.size : 5;
        let classifyField = this.props.option.classify&&this.props.option.classify.field
                            ?this.props.option.classify.field  : 'name';
        let total = 0;
        for (let key in data) {
            if(data[key]){
                let item = data[key];
                if(total === 0){
                    item.forEach((it,ind)=>{
                        legend.push(it[classifyField]);
                    })  
                }
                total++;
                optionDatas.push(item);
            }
        }            

        let iconArr = [];
        let legendLen = legend.length;
        //按照大小来区分不同类型
        if(this.props.option.classify&&this.props.option.classify.type=== 'size'){
            let iconUrl = this.props.option.iconUrl[0] || require('./common/imgs/point.svg');                 

            for (let i = 1; i <= legendLen; i++) {
                let iconSize = (size + i - legendLen) * zoom;
                let anchor = (i - 1) * 2  * zoom;
                let icon = L.icon({
                    iconUrl: iconUrl,
                    shadowUrl: '',
                    iconSize:     [iconSize, iconSize], // size of the icon
                    shadowSize:   [iconSize, iconSize], // size of the shadow
                    iconAnchor:   [anchor, anchor], // point of the ifcon which will correspond to marker's location
                    shadowAnchor: [anchor, anchor],  
                    popupAnchor:  [-3, -76] 
                });    

                iconArr.push(icon);
            }                 
        }else{  //按照形状，提供的图片来区分类型
            for (let i = 1; i <= legendLen; i++) {         
                let iconUrl = this.props.option.iconUrl[i-1] || this.getDefaultIconUrl(i);
                let iconSize = size * 4;
                let anchor = (i - 1) * 2  * zoom;
                let icon = L.icon({
                    iconUrl: iconUrl,
                    shadowUrl: '',
                    iconSize:     [iconSize, iconSize], // size of the icon
                    shadowSize:   [iconSize, iconSize], // size of the shadow
                    iconAnchor:   [anchor, anchor], // point of the ifcon which will correspond to marker's location
                    shadowAnchor: [anchor, anchor],  
                    popupAnchor:  [-3, -76] 
                });    

                iconArr.push(icon);
            }                             
        }                   

        for (let i = 0; i < optionDatas.length; i++) {   
            for (let j = 0; j < optionDatas[i].length; j++) {
                let dataj = optionDatas[i][j];

                let lat = dataj.lat,
                    lng = dataj.lng;
                if(j >= legendLen) break;
                if(!this.props.geocode){
                    if(lat && lng){
                        layerGroup.addLayer(L.marker([lat,lng], { icon: iconArr[j] }));     
                    }
                }else{
                    let qName = dataj[this.props.geocode];
                    this.geocode(qName,(results)=>{
                        if(results.data.length <= 0) return;
                        let lat1 = +results.data[0].lat,
                            lng1 = +results.data[0].lon;
                        if(lat1 && lng1){
                            layerGroup.addLayer(L.marker([lat1,lng1], { icon: iconArr[j] })); 
                        }                                          
                    })
                }                       
                
                             
            }
            
        }     
        if(__DEV__) console.log('layerGroup',layerGroup);      
        layerGroup.addTo(this.map);  
    }
    
    initScatterChart(zoom){
        this.map = gVar.map;
        let {data} = this.state;
        let {option} = this.props;
        if(!zoom) zoom = this.map.getZoom() || 5;     
        let baseIconSize = zoom - 1;
        //先清空
        let layerGroup = this.scatterLayerGroup;
        if(layerGroup.getLayers().length > 0){
            this.map.removeLayer(layerGroup);
            layerGroup.clearLayers();
        }   

        let latlngs = [],optionDatas = [];
        if(!data||data.length === 0) console.warn('数据为空');
        let iconUrl = option.iconUrl || require('./common/imgs/point.png');
        let size = option.size?option.size : 5;
        let classifyNums = option.classify&&option.classify.numbers
                            ?option.classify.numbers  : 1;
        let classifyField = option.classify&&option.classify.field
                            ?option.classify.field  : 'value';
        let f = Math.floor(classifyNums/2),
            len = data.length,
            classifyDataLen = Math.floor(len / classifyNums);
        
        let iconArr = [];
        
        for (let i = 1; i <= classifyNums; i++) {
            let iconSize = (size + i - f - 1 ) * baseIconSize;

            let icon = L.icon({
                iconUrl: iconUrl,
                shadowUrl: '',
                iconSize:     [iconSize, iconSize], // size of the icon
                shadowSize:   [iconSize, iconSize], // size of the shadow
                iconAnchor:   [0, 0], // point of the ifcon which will correspond to marker's location
                shadowAnchor: [0, 0],  
                popupAnchor:  [-3, -76] 
            });    

            iconArr.push(icon);
        }
        
        data.sort( (a,b)=> {
            return (+a[classifyField]) - (+b[classifyField]);
        })       

        for (let i = 0; i < len; i++) {   
            let lat = data[i].lat,
                lng = data[i].lng;
            if(lat&&lng){
                layerGroup.addLayer(L.marker([lat,lng], { icon: iconArr[Math.floor(i/classifyDataLen)] }))
            }
        }        
        layerGroup.addTo(this.map);   
    }
    /**
     * 基于d3
     * @param handleInfoModal 回调函数
     * @param data Array 要渲染的数据
     * @param size Number 大小尺寸,值越大，尺寸越大 默认为3
     */
    initScatterChart2(zoom){
        let self = this;
        this.map = gVar.map;
		let {data} = this.state;
        let {option} = this.props;
        if(!show) return;        
		if(!zoom) zoom = 4;
        let size = option.size * (zoom-1) || 4;
   
        let handleInfoModal = this.props.handleInfoModal;

        if(this.d3Overlay)
            this.d3Overlay.onRemove(this.map);  //清空

        let d3Overlay = L.d3SvgOverlay((sel, proj)=> {
            data.sort( (a,b)=> {
                return (+a.value) - (+b.value);
            })
            let d3Chart = sel.selectAll('circle').data(data);
            this.d3Chart = d3Chart;
            d3Chart.enter()
                .append('circle')
                .attr('r', (d)=> {
                    return +d.value==0?0:Math.log2((+d.value))/(9/size);
                })
                .attr('cx', (d)=> {
                    return proj.latLngToLayerPoint([+d.lat,+d.lng]).x;
                })
                .attr('cy', (d)=> {
                    return proj.latLngToLayerPoint([+d.lat,+d.lng]).y;
                })
                .attr('stroke', '#ff0000')
                .attr('stroke-width', 0)
                .attr('fill',(d)=>{
                    return self.props.option.color[0]||'#44a3e5';
                })
                .on('click',(d,i)=>{
                    if(__DEV__) console.log(d);
                    if(handleInfoModal) handleInfoModal(d);
                });

            if(this.map.getZoom() > 6){  //文本
                d3Chart.enter().append("text")
                    .attr('class',"text-value")
                    .attr('x', (d)=> {
                        return proj.latLngToLayerPoint([+d.lat,+d.lng]).x;
                    })
                    .attr('y', (d)=> {
                        return proj.latLngToLayerPoint([+d.lat,+d.lng]).y;
                    })
                    .attr('fill','#ffffff')
                    .style("text-anchor", (d)=> { return d.children ? "end" : "start"; })
                    .text((d)=> { return d.value; })
            }
        });
        this.d3Overlay = d3Overlay;
        d3Overlay.addTo(this.map);
			     
    }   
    componentDidMount(){
		Eventful.subscribe('twoZoom',(center)=>{
            let zoom = gVar.map.getZoom();
            console.log('zoom',zoom);
            switch(this.props.type) {
                case 'scatter':
                    this.initScatterChart(zoom); 
                    break;
                case 'multiScatter':
                    this.initMultiScatterChart(zoom);
                    break;
                case 'pie':
                    this.initPieChart(zoom);
                    break;
                case 'bar':
                    this.initBarChart(zoom);
                    break;
            }
            
        });	    	

    }
    /**
     * 基于WebGL，暂时不使用
     * @param data
     */
    initWebGLChart(data){
        let res = [];
        data.forEach((d,i)=>{
            d.x = d.lat;
            d.y = d.lng;
            res.push(d);
        });

        let webGLLayer = new L.TileLayer.WebGL({
            data:res
        });
        this.map.addLayer(webGLLayer);
    }	
    getDefaultIconUrl(i){
        let defalutIconUrl;
        switch(i-1) {
            case 0:
                defalutIconUrl = require('./common/imgs/point.svg');
                break;
            case 1:
                defalutIconUrl = require('./common/imgs/point1.svg');
                break;
            case 2:
                defalutIconUrl = require('./common/imgs/point2.svg');
                break;                    
            case 3:
                defalutIconUrl = require('./common/imgs/point3.svg');
                break;    
            case 4:
                defalutIconUrl = require('./common/imgs/point4.svg');
                break;                      
            case 5:
                defalutIconUrl = require('./common/imgs/point5.svg');
                break;  
            default:
                defalutIconUrl = require('./common/imgs/point.svg');
                break;                                                            
        }        
        return defalutIconUrl;
    } 
    geocode(qName,callback){
        if(!qName) return;
        let url =  "http://nominatim.openstreetmap.org/search.php?q="+qName
            +"&format=json";
        axios.get(url).then((json)=>{
            if(callback) callback(json);
        })       
    }   
	render(){
		return(
			<div id="default-info-chart">			
			</div>
		)
	}    
}


export default Chart;