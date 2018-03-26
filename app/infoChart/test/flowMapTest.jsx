import React,{Component} from 'react';
import {FlowMap,Map2D} from '../src/index';

import Cesium from 'cesium/Cesium';
import axios from 'axios';
const server = "http://localhost:8000/";
// import  
class FlowMapTest extends Component{
	constructor(props){
        super(props);
        this.state = {
			isIndShow: false,
            isInfoModalRefresh:false,        	
            center:[30,104],
            height:10000000,
            dataUrl:'',
            data:[],
            links:[],
            year:'2000',
            currentInd:"GDP"            
        };
    }	
    componentDidMount(){
		let {year,currentInd} = this.state;
		this.getDataFromServer(year,currentInd,(data,links)=>{
            this.setState({
                isInfoModalRefresh:true,
                data:data,
                links:links
            })
        });		
	}
 	getDataFromServer(year,indName,callback) {
        axios.get(`${server}getjson/allcity/${year}/${indName}`)
            .then((res) => {
                if(!res.data) return;
        		axios.get(`${server}flowmaplinks`)
        			.then((res1)=>{
						console.log('res,res1:', res ,res1);
                		if(callback) callback.call(this,res.data,res1.data);        					
        			})
            }).catch((err) => {
            console.warn(err);
        })
    }
   
    render(){
    	let {center,height,year,currentInd,data,links} = this.state;

    	return(
    		<div>
    			<FlowMap
                    show = {true}
    				mapBind = 'Map2D'
    				data = {data}
    				links = {links}
    				dataCenter = {'SH'}
    				option = {{
    					size : 5,
    					color:'#336633'
    				}}
    			>
    			</FlowMap>
    			<Map2D
                    show = {true}
    				mapType="geoq_normalm3" 
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


export default FlowMapTest;