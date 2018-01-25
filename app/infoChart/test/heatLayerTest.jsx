import React,{Component} from 'react';
import {HeatLayer,Lbasemap} from '../src/index';

import Cesium from 'cesium/Cesium';
import axios from 'axios';
const server = "http://localhost:8000/";
// import  
class HeatLayerTest extends Component{
	constructor(props){
        super(props);
        this.state = {
			isIndShow: false,
            isInfoModalRefresh:false,        	
            center:[30,104],
            height:10000000,
            dataUrl:'',
            data:[],
            year:'2000',
            currentInd:"GDP"            
        };
    }	
    componentDidMount(){
		let {year,currentInd} = this.state;
		this.getDataFromServer(year,currentInd,(data)=>{
            this.setState({
                isInfoModalRefresh:true,
                data:data
            })
        });		
	}
 	getDataFromServer(year,indName,callback) {
        axios.get(`${server}data/heatlayer`)
            .then((res) => {
                if(!res.data) return;
                if(callback) callback.call(this,res.data);        					
        		
            }).catch((err) => {
            console.warn(err);
        })
    }
   
    render(){
    	let {center,height,year,currentInd,data} = this.state;

    	return(
    		<div>
    			<HeatLayer
                    show = {true}
    				mapBind = 'Lbasemap'
    				data = {data}
    				option = {{
    					size : 5,
    					color:'#336633'
    				}}
    			>
    			</HeatLayer>
    			<Lbasemap
                    show = {true}
    				mapType="osm" 
					zoom = {12}
					center = {[31.88,121.4]}    	
					scale={true} 
				    osmGeocoder={false} 
				    maptypebar={true}								
    			>
    			</Lbasemap>
    		</div>
    	)
    }
}


export default HeatLayerTest;