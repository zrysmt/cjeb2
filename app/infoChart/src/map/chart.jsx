/**
 * 二维地图作为底图模块,信息图可以是二维，三维的或者信息图表
 */
import React,{Component} from 'react';
import L from 'leaflet';
import * as d3 from 'd3';

import Lbasemap from './lbasemap';
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
    }	
	componentWillReceiveProps(props){
	    if(props.data&&props.data.length!=0) {
            this.setState({
            	data:props.data
            },()=>{
                this.chartDisplayByType();
            })
        }
    }	
    chartDisplayByType(props){
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
			case '':
    			break;       		   					
    	}
    }
    initBarChart(){
        this.map = gVar.map;
        let {data} = this.state;  

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
                let oneData = [];
                item.forEach((it,ind)=>{
                    oneData.push(+it.value)
                })
                optionDatas.push(oneData);
            }
        }
        console.log(latlngs,optionDatas,legend);
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
                barWidth: '30%',
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
        console.log(option);

        echartsIcon(this.map, latlngs, option);
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
    initPieChart(){
    	this.map = gVar.map;
    	let {data} = this.state;

		let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [{
                name: '',
                type: 'pie',
                radius: '55%',
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

        echartsIcon(this.map, latlngs, option);
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
    /**
     * 基于d3
     * @param handleInfoModal 回调函数
     * @param data Array 要渲染的数据
     * @param size Number 大小尺寸,值越大，尺寸越大 默认为3
     */
    initScatterChart(zoom){
        this.map = gVar.map;
		let {data} = this.state;
		if(!zoom) zoom = 4;
        let size = this.props.option.size * (zoom-1) || 4;
        console.log(size);
        let handleInfoModal = this.props.handleInfoModal;

        if(this.d3Overlay)
            this.d3Overlay.onRemove(this.map);  //清空

        let d3Overlay = L.d3SvgOverlay(function(sel, proj) {
            data.sort(function (a,b) {
                return (+a.value) - (+b.value);
            })
            let d3Chart = sel.selectAll('circle').data(data);
            this.d3Chart = d3Chart;
            d3Chart.enter()
                .append('circle')
                .attr('r', function(d) {
                    return +d.value==0?0:Math.log2((+d.value))/(9/size);
                })
                .attr('cx', function(d) {
                    return proj.latLngToLayerPoint([+d.lat,+d.lng]).x;
                })
                .attr('cy', function(d) {
                    return proj.latLngToLayerPoint([+d.lat,+d.lng]).y;
                })
                .attr('stroke', '#ff0000')
                .attr('stroke-width', 0)
                .attr('fill',function(d){
                    return '#44a3e5';
                })
                .on('click',(d,i)=>{
                    if(__DEV__) console.log(d);
                    if(handleInfoModal) handleInfoModal(d);
                });

            if(this.map.getZoom() > 6){
                d3Chart.enter().append("text")
                    .attr('class',"text-value")
                    .attr('x', function(d) {
                        return proj.latLngToLayerPoint([+d.lat,+d.lng]).x;
                    })
                    .attr('y', function(d) {
                        return proj.latLngToLayerPoint([+d.lat,+d.lng]).y;
                    })
                    .attr('fill','#ffffff')
                    .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
                    .text(function(d) { return d.value; })
            }
        });
        this.d3Overlay = d3Overlay;
        d3Overlay.addTo(this.map);
			     
    }
	d3AfterZoomend(zoom){
        if(__DEV__) console.log('d3AfterZoomend',zoom);
       
        this.initScatterChart(zoom);
        
    }    
    componentDidMount(){
		Eventful.subscribe('twoZoom',(center)=>{
            if(this.props.type === 'scatter'){
                let zoom = this.map.getZoom();
                this.d3AfterZoomend(zoom);                
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

	render(){
		let {mapType,data,zoom,center,option,scale,osmGeocoder,maptypebar}
			= this.props;
		return(
			<div id="info-chart">
				<Lbasemap 
					mapType={mapType||"geoq_normalm3"}
					data={data}
					zoom = {zoom||5}
					center = {center||[30,104]}
					option={option||{size:5,color:['#44a3e5']}}
				    scale={scale||true} 
				    osmGeocoder={osmGeocoder||false} 
				    maptypebar={maptypebar||true}
				>
				</Lbasemap>				
			</div>
		)
	}    
}


export default Chart;