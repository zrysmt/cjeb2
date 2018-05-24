import React,{Component} from 'react';
import {MigrateLayer,Map2D} from '../src/index';

import axios from 'axios';
const server = "http://localhost:8000/";
// import  
class MigrateTest extends Component{
	constructor(props){
        super(props);
        this.state = {
			isIndShow: false,
            isInfoModalRefresh:false,        	
            center:[30,104],
			zoom:5,
            data:[],
        };
    }	
    componentDidMount(){
		this.getDataFromServer();
	}

    getDataFromServer(){
        let data = [{
            "from": [121.487899,31.249162],
            "to": [118.778074, 32.057236],
            "labels": ["上海市", "南京市"],
            "color": "#ff3a31"
        }, {
            "from": [121.487899,31.249162],
            "to": [120.219375, 30.259244],
            "labels": [null, "杭州市"],
            "color": "#ff7e2b"
        }, {
            "from": [121.487899,31.249162],
            "to": [117.282699, 31.866942],
            "labels": [null, "合肥市"],
            "color": "#ffc726"
        }, {
            "from": [121.487899,31.249162],
            "to": [114.3162, 30.581084],
            "labels": [null, "武汉市"],
            "color": "#e9ff20"
        }, {
            "from": [121.487899,31.249162],
            "to": [104.067923, 30.679943],
            "labels": [null, "成都市"],
            "color": "#99ff1b"
        }, {
            "from": [121.487899,31.249162],
            "to": [112.979353, 28.213478],
            "labels": [null, "长沙市"],
            "color": "#45ff15"
        }, {
            "from": [121.487899,31.249162],
            "to": [102.714601, 25.049153],
            "labels": [null, "昆明市"],
            "color": "#10ff33"
        }, {
            "from": [121.487899,31.249162],
            "to": [106.530635, 29.544606],
            "labels": [null, "重庆市"],
            "color": "#0aff84"
        }, {
            "from": [121.487899,31.249162],
            "to": [106.709177, 26.629907],
            "labels": [null, "贵阳市"],
            "color": "#05ffd9"
        }, {
            "from": [121.487899,31.249162],
            "to": [120.690635, 28.002838],
            "labels": [null, "温州市"],
            "color": "#00ccff"
        }];

        this.setState({data:data});
    }
    render(){
    	let {center,zoom,data} = this.state;

    	return(
    		<div>
    			<MigrateLayer
                    show = {true}
    				mapBind = 'Map2D'
    				data = {data}
    				option = {{
    					size : 5,
    					color:'#336633'
    				}}
    			>
    			</MigrateLayer>
    			<Map2D
                    show = {true}
    				mapType="darkV9"
					zoom = {zoom}
					height={'600px'}
					center = {center}
					scale={true} 
				    osmGeocoder={false} 
				    maptypebar={true}								
    			>
    			</Map2D>
    		</div>
    	)
    }
}


export default MigrateTest;