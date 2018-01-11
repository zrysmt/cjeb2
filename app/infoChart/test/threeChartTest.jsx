import React,{Component} from 'react';
import {ThreeChart} from '../src/index';

import axios from 'axios';
const server = "http://localhost:8000/";

class ThreeChartTest extends Component{
	constructor(props){
        super(props);
        this.state = {
			isIndShow: false,
            isInfoModalRefresh:false,        	
            center:[30,104],
            zoom:4,
            dataUrl:'',
            data:'',
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
        // axios.get(`${server}getjson/allcity/${year}/${indName}`)
        axios.get(`${server}getjson/allcity/${year}/${indName}`)
            .then((res) => {
                if (!res.data) return;
                console.log('res:', res);
                if(callback) callback.call(this,res.data);
            }).catch((err) => {
            console.warn(err);
        })
    }
   
    render(){
    	let {center,zoom,year,currentInd,data} = this.state;
    	let dataUrl = `${server}dataurl`;

    	return(
    		<div>
    			<ThreeChart
    				// dataUrl = {`${server}getjson/allcity/${year}/${indName}`}
    				dataUrl = {data}
    			>	
    			</ThreeChart>
    		</div>
    	)
    }
}


export default ThreeChartTest;