import React,{Component} from 'react';
import {Map3D} from '../src/index';

import axios from 'axios';
const server = "http://localhost:8000/";

class Map3DTest extends Component{
	constructor(props){
        super(props);
        this.state = {
            center:[30,104],
            zoom:4
        };
    }	
    componentDidMount(){
    	
    }
    render(){
    	let {center,zoom} = this.state;

    	return(
    		<div>
    			<Map3D
                    show = {true}
                    zoom = {zoom}
    				center = {center}
    			>	
    			</Map3D>
    		</div>
    	)
    }
}


export default Map3DTest;