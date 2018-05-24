/**
 * 水滴图文图表
 * 属性参数: 
 * text 文字
 * data 值(必选参数),多个值的话用逗号分割
 * width 尺寸
 *
 * usage:
 * <LiquidChart keyValue='lc1' data='0.21' text={text1} style={style}/>
 */
import React from 'react';
import echarts from 'echarts';
import  liquidFill from 'echarts-liquidfill';

import './liquidchart.scss';

class LiquidFill extends React.Component{
	componentDidMount(){
		let data,optionData=[],option,myChart;
		data = this.props.data;
		if(data.indexOf(',')!== -1){
			data.split(',').forEach((item)=>{
				optionData.push(parseFloat(item));
			})
		}else{
			optionData.push(parseFloat(data));
		} 
			
		option = {
		    series: [{
		        type: 'liquidFill',
		        data: optionData,
		        radius: '90%',
		        zlevel:100,
		        label:{normal:{
		        	show:true,
		        	textStyle:{
		        		fontSize:30
		        	}
		        }}
		    }]
		};
		myChart = echarts.init(document.getElementById(this.props.keyValue));
		myChart.setOption(option);
	}
	
	render(){
		return(
			<div id={this.props.keyValue} className="liquid-fill" style={this.props.style}></div>
		)
	}
}

class LiquidChart extends React.Component{
	constructor(props){
		super(props);
	}
	/*propTypes:{
		data:React.PropTypes.string.isRequired
	}*/
	static get defaultProps(){
		return{
			data:0,
			text:"默认的文本",
			style:{
				width:"130px",
				height:"130px"
			}
		}
	}
	render(){
		let style,data,width,height;
		data = this.props.data+'';
		style = this.props.style;
		width = parseFloat(style.width)+40+"px";
		height = parseFloat(style.height)+40+"px";

		return(
			<div className="liquid-chart" style={{width:width,height:height}}>
				<LiquidFill keyValue={this.props.keyValue} data = {t} style={style}/>
				<div className="liquid-text">{this.props.text}</div>
			</div>
		)
	}
}

LiquidChart.propTypes ={
	data:React.PropTypes.string.isRequired
}

export default LiquidChart;