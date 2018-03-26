import React,{Component} from 'react';
import {ThematicMap,Map2D} from '../src/index';

import Cesium from 'cesium/Cesium';
import axios from 'axios';
const server = "http://localhost:8000/";
// import  
class ThematicMapTest extends Component{
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
        axios.get(`${server}getjson/allcity/${year}/${indName}`)
            .then((res) => {
                if(!res.data) return;
                console.log('res',res);
                if(callback) callback.call(this,res.data);        					
        		
            }).catch((err) => {
            console.warn(err);
        })
    }
   
    render(){
    	let {center,height,year,currentInd,data} = this.state;

    	return(
    		<div>
    			<ThematicMap
                    show = {true}
    				mapBind = 'Map2D'
    				data = {data}        //
                    geojson = {''}
                    fieldId = {'province'}  //
                    classify = {{        //可选
                        numbers:5, 
                        field:'value',
                        gap:500,
                        color:['#9999CC','#9966FF','#9900FF','#6600CC','#330066']    
                    }}
    				option = {{
    					fillColor:'rgba(64,98,210,0.5)'
    				}}
    			>
    			</ThematicMap>
    			<Map2D
                    show = {true}
    				mapType="osm" 
					zoom = {5}
					center = {[30,104]}    	
					scale={true} 
				    osmGeocoder={false} 
				    maptypebar={true}								
    			>
    			</Map2D>
    		</div>
    	)
    }
}


export default ThematicMapTest;