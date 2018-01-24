import React,{Component} from 'react';
import {Chart3D} from '../src/index';

import axios from 'axios';
const server = "http://localhost:8000/";

class Chart3DTest2 extends Component{
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
            currentInd:"143,144,145"            
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
        axios.get(`${server}byindids/citys/allcity/${year}/${indName}`)
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
    	let dataUrl = `${server}byindids/citys/allcity/${year}/${currentInd}`;

    	return(
    		<div>
    			<Chart3D
    				dataUrl = {dataUrl}
    				dataName = {year}
    				height = {height}
    				center = {center} 
    				type = 'cylinder'   //line bar cylinder
    				option = {{
    					size: 3,
                        heightScale:10,
                        classifyTypes:['#336600','#336666','#3366FF'],
    					color:'#67ADDF',
    					fill:false,
    					outline:false,
    					outlineColor:'#0000',

    				}}
    			>	
    			</Chart3D>
    		</div>
    	)
    }
}


export default Chart3DTest2;