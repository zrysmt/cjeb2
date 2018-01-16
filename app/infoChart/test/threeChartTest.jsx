import React,{Component} from 'react';
import {ThreeChart} from '../src/index';
import Cesium from 'cesium/Cesium';
import axios from 'axios';
const server = "http://localhost:8000/";

class ThreeChartTest extends Component{
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
        // axios.get(`${server}dataurl`)
            .then((res) => {
                if(!res.data) return;
                console.log('res:', res);
                if(callback) callback.call(this,res.data);
            }).catch((err) => {
            console.warn(err);
        })
    }
   
    render(){
    	let {center,height,year,currentInd,data} = this.state;
    	// let dataUrl = `${server}dataurl`;
    	let dataUrl = `${server}getjson/allcity/${year}/${currentInd}`;

    	return(
    		<div>
    			<ThreeChart
    				dataUrl = {dataUrl}
    				dataName = {year}
    				height = {height}
    				center = {center} 
    				viewerOption = {{
    					sceneMode : Cesium.SceneMode.SCENE3D,  //MORPHING  SCENE2D COLUMBUS_VIEW  SCENE3D 
    					// imageryProvider:'OpenStreetMap',
    				}}
    				type = 'cylinder'   //line bar cylinder
    				option = {{
    					size: 5,
    					color:'#67ADDF',
    					fill:false,
    					outline:true,
    					outlineColor:'#0000',

    				}}
    			>	
    			</ThreeChart>
    		</div>
    	)
    }
}


export default ThreeChartTest;