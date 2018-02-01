import React,{Component} from 'react';
import {CesiumMap,SpaceCube} from '../src/index';

import axios from 'axios';
const server = "http://localhost:8000/";

class Chart3DTest extends Component{
	constructor(props){
        super(props);
        this.state = {
			isIndShow: false,
            isInfoModalRefresh:false,        	
            center:[30,114],
            height:1000000,
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
                let data = [];
                data.push(res.data[50],res.data[55],res.data[89],res.data[61],res.data[27],res.data[64]);
                if(callback) callback.call(this,data);
            }).catch((err) => {
            console.warn(err);
        })
    }
   
    render(){
    	let {center,height,viewerOption,year,currentInd,data} = this.state;

    	return(
    		<div>
    			<SpaceCube
                    show = {true}
    				data = {data}
    				option = {{
    					size: 5,
                        heightScale:50,
    					color:'#67ADDF',
    					fill:false,
    					outline:true,
    					outlineColor:'#0000',

    				}}
    			>	
    			</SpaceCube>
                <CesiumMap
                    height = {height}
                    center = {center}    
                    viewerOption = {viewerOption||''}               
                ></CesiumMap>                   
    		</div>
    	)
    }
}


export default Chart3DTest;