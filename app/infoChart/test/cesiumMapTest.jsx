import React,{Component} from 'react';
import {CesiumMap} from '../src/index';

import axios from 'axios';
const server = "http://localhost:8000/";

class CesiumMapTest extends Component{
	constructor(props){
        super(props);
        this.state = {
            center:[30,104],
            zoom:4,
            data:[]
        };
    }	
    componentDidMount(){
    	
    }
    render(){
    	return(
    		<div>
    			<CesiumMap>
    				
    			</CesiumMap>
    		</div>
    	)
    }
}


export default CesiumMapTest;