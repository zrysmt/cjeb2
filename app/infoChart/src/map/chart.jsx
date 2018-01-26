/**
 * 二维地图作为底图模块,信息图可以是二维，三维的或者信息图表
 */
import React,{Component} from 'react';
import L from 'leaflet';
import * as d3 from 'd3';
import lodash from 'lodash';
import echarts from 'echarts';
import axios from 'axios';
import './common/leaflet-plugin/L.D3SvgOverlay';
import  './common/Leaflet.WebGL/src/L.WebGL.js';
import echartsIcon from './common/leaflet-plugin/echartsIcon.js'; //echartsLegend
import echartsLegend from './common/leaflet-plugin/echartsLegend.js'; //echartsLegend

import Eventful from './common/eventful.js';
import util from './common/util.jsx';
import gVar from './global';

class Chart extends Component{
	constructor(props){
        super(props);
        this.state = {
            data:[],
            selectedMarkers:[]
        };

        this.scatterLayerGroup = L.layerGroup();
        this.multiScatterLayerGroup = L.layerGroup();
        this.pieLayerGroup = L.layerGroup();
        this.barLayerGroup = L.layerGroup();
        this.scatterData = [];
        this.pieData = {};
        this.barData = [];
        this.multiData = [];
        this.parallelData = [];

        this.parallelEchart = null;
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
            case 'parallel':
                this.initParallelChart();
                break;                    		   					
    	}      

    }
    initParallelChart(){
        let {data,selectedMarkers} = this.state;  
        let {type,option} = this.props;
        if(!data) throw new Error('data is required');
        let parallelData = [];
        if(type === 'parallel') 
            parallelData = this.parallelData = data;
        console.log('parallelData',parallelData);
        let findPropertiesByLatlng = (latlng,dataSource)=>{    
            for (let key in dataSource) {
                let lat = dataSource[key][0].lat,
                    lng = dataSource[key][0].lng;
                if(lat&&lng&&latlng&&lat == latlng.lat && lng == latlng.lng){
                    return dataSource[key];
                }                     
            }       
        }        
        let genParallelAxis = (arr)=>{
            let parallelAxis = [];
            arr.forEach((item,index)=>{
                parallelAxis.push({
                    dim:index,
                    name:item[option.field.name]
                })

            }) 
            return parallelAxis;           
        }
        option = _.defaultsDeep({},{
            field:{
                name:'name',  
                value:'value' 
            },
            height:'300px',
            width:'85%', 
            // echarts option
            backgroundColor: '#333',
            parallelAxis:[],
            parallel: {
                top:50,
                left: '8%',
                right: '8%',
                bottom: 50,
                axisExpandable: true,
                axisExpandCenter: 15,
                axisExpandCount: 10,
                axisExpandWidth: 60,
                axisExpandTriggerOn: 'mousemove',
                parallelAxisDefault: {
                    type: 'value',
                    name: '',
                    nameLocation: 'end',
                    nameGap: 20,
                    // nameRotate: 25,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#aaa'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: '#777'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                }
            },
            series: [{
                type: 'parallel',
                lineStyle: {
                    width: 4
                },
                smooth: true,
                data: []
            }]                       
        },option);  
        console.log('selectedMarkers',selectedMarkers);
        let index = 0,seriesData = [];
        for (let key in parallelData) {
            if(index === 0 )      
                option.parallelAxis = genParallelAxis(parallelData[key]);
            index++;
            let oneData =  [];
            if(selectedMarkers&&selectedMarkers.length > 0){
                selectedMarkers.forEach((marker,ind1)=>{
                    marker = findPropertiesByLatlng(marker.getLatLng(),parallelData);
                    if(marker && marker[0][option.field.marker] === key){
                        parallelData[key].forEach((item,ind2)=>{
                            oneData.push(item[option.field.value]);
                        })                        
                    }
                })
            }else{
                parallelData[key].forEach((item,ind2)=>{
                    oneData.push(item[option.field.value]);
                })                
            }
            if(oneData.length !== 0) seriesData.push(oneData);
        }      
        option.series[0].data = seriesData;
        if(__DEV__) console.log('option',option);
        let pDom = document.getElementById('default-info-chart');
        let dom = document.getElementById('default-echart-div');
        dom.innerHTML = '';// clear the dom
        dom.style.width = option.width;
        dom.style.height = option.height;
        pDom.style.width = '100%';
        pDom.style.height = '100%';
        dom.style.margin = '0 auto';
        if(option.backgroundColor) pDom.style.backgroundColor = option.backgroundColor;
        
        if(this.parallelEchart) this.parallelEchart.dispose();
    
        let myChart = echarts.init(dom);  
        this.parallelEchart = myChart; 
        myChart.setOption(option);             

    }
    initBarChart(zoom){
        this.map = gVar.map;
        let {data} = this.state;  
        let {type,option} = this.props;
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
        if(!data||data.length === 0) console.warn('data is required');
        let barData = [];
        if(type === 'bar') 
            barData = this.barData = data;        
        let total = 0;
        for (let key in barData) {
            if(barData[key]){
                let item = barData[key];
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
        
        let defaultOption = {          
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
        option = _.defaultsDeep({},defaultOption,option);
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
            legendOption = _.defaultsDeep({},legendOption,this.props.option.legend)
            echartsLegend(this.map, legendOption);               
        }
    }
    initPieChart(zoom){
    	this.map = gVar.map;
    	let {data} = this.state;
        let {type,option} = this.props;
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

		let defaultOption = {
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

        option = _.defaultsDeep({},defaultOption,option);
        if(__DEV__) console.log('option',option);
        //经纬度不能相同
        let latlngs = [],legend = [],optionDatas = [];
        if(!data||data.length === 0) console.warn('data is required');
        let pieData = {};
        if(type === 'pie') 
            pieData = this.pieData = data;       
        let total = 0;
        for (let key in pieData) {
        	if(pieData[key]){
        		let item = pieData[key];
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
            legendOption = _.defaultsDeep({},this.props.option.legend,legendOption)
            echartsLegend(this.map, legendOption);                  
        }
    }
    initMultiScatterChart(zoom){
        this.map = gVar.map;
        let {data} = this.state;    
        let {type,option} = this.props;
        if(!data||data.length === 0) console.warn('data is required');
        let multiData = {};
        if(type === 'multiScatter') 
            multiData = this.multiData = data;         
        if(!zoom) zoom = this.map.getZoom() || 5;  
        let baseIconSize = zoom - 1;
        let layerGroup = this.multiScatterLayerGroup;
        if(layerGroup.getLayers().length > 0){
            this.map.removeLayer(layerGroup);
            layerGroup.clearLayers();
        }        

        let legend = [],optionDatas = [];
        let size = option.size?option.size : 5;
        let classifyField = option.classify&&option.classify.field
                            ?option.classify.field  : 'name';
        let total = 0;
        for (let key in multiData) {
            if(multiData[key]){
                let item = multiData[key];
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
        if(option.classify&&option.classify.type=== 'size'){
            let iconUrl = option.iconUrl[0] || require('./common/imgs/point.svg');                 

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
                let iconUrl = option.iconUrl[i-1] || this.getDefaultIconUrl(i);
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
        let {type,option} = this.props;
        if(!zoom) zoom = this.map.getZoom() || 5;     
        let baseIconSize = zoom - 1;
        //先清空
        let layerGroup = this.scatterLayerGroup;
        if(layerGroup.getLayers().length > 0){
            this.map.removeLayer(layerGroup);
            layerGroup.clearLayers();
        }   

        let latlngs = [],optionDatas = [];
        if(!data||data.length === 0) throw new Error('data is required!');
        let scatterData = [];
        if(type === 'scatter') 
            scatterData =  this.scatterData = data;
        console.info('this.scatterData2',this.scatterData);

        let iconUrl = option.iconUrl || require('./common/imgs/point.png');
        option = _.defaultsDeep({},{
            size:5,
            classify:{
                numbers:1,
                field:'value'
            }
        },option);
        let size = option.size,
            classifyNums = option.classify.numbers,
            classifyField = option.classify.field;

        let f = Math.floor(classifyNums/2),
            len = scatterData.length,
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
        
        scatterData.sort( (a,b)=> {
            return (+a[classifyField]) - (+b[classifyField]);
        })       

        for (let i = 0; i < len; i++) {   
            let lat = scatterData[i].lat,
                lng = scatterData[i].lng;
            if(lat&&lng){
                let marker = L.marker([lat,lng], { icon: iconArr[Math.floor(i/classifyDataLen)] });
                this.markerEvent(marker,scatterData);                 
                layerGroup.addLayer(marker);
            }
        }        
        /*layerGroup.on('click',(e)=>{
            console.log('e',e);
        }) */         
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
    /**
     * [markerEvent marker事件]
     * TODO: 完成scatterChart之外的事件
     * @param  {[L.marker]} marker [L.marker]
     * @param  {[type]} data   [数据信息]
     */
    markerEvent(marker,data){
        if(!Array.isArray(data)) throw new Error('data should be Array');
        
        marker.on('click',(e)=>{
            console.log('e',e.target);
            if(__DEV__) console.log('twoMarkerClicked',[e.target]);
            if(e.target && e.target instanceof L.Marker) {
               Eventful.dispatch('twoMarkerClicked',[e.target]);  
            }
        })        
    }
    componentDidMount(){
        let {type,show} = this.props;
        Eventful.subscribe('twoZoom',(center)=>{
            let zoom = gVar.map.getZoom();
            console.log('zoom',zoom);
            switch(type) {
                case 'scatter':
                    if(show) this.initScatterChart(zoom); 
                    break;
                case 'multiScatter':
                    if(show) this.initMultiScatterChart(zoom);
                    break;
                case 'pie':
                    if(show) this.initPieChart(zoom);
                    break;
                case 'bar':
                    if(show) this.initBarChart(zoom);
                    break;
            }
            
        });

        this.handleEvents();
    }
    componentWillUnmount(){
        Eventful.unSubscribe('twoMarkerClicked');
        Eventful.unSubscribe('twoSelectFeature');
        Eventful.unSubscribe('twoSelectFeatureClear');
        if(this.parallelEchart){
            this.parallelEchart.dispose();
            this.parallelEchart = null;
        }        
    }
    handleEvents(){
        Eventful.subscribe('twoMarkerClicked',(item)=>{
            this.setState({
                selectedMarkers:item
            },()=>{
                this.initParallelChart();
            })
        });
        Eventful.subscribe('twoSelectFeature',(features)=>{
            this.setState({
                selectedMarkers:features
            },()=>{
                this.initParallelChart();
            })
        });
        Eventful.subscribe('twoSelectFeatureClear',()=>{
            this.setState({
                selectedMarkers:[]
            },()=>{
                this.initParallelChart();
            })
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
                <div id = "default-echart-div"></div>			
			</div>
		)
	}    
}


export default Chart;