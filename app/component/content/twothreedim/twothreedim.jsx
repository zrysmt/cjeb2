/**
 * 二三维联动
 */
import './twothreedim.scss';

import React from 'react';
import axios from 'axios';

import Twomap from '../twomap/twomap';
import Threemap from '../threemap/threemap';
import TimeLine from '../../widget/timeLine/timeLine';

class Twothreedim extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }
    componentDidMount(){
        axios.get('http://localhost:8000/getjson/allcity/2000/GDP')
            .then((res)=>{
                console.log('res:',res);
                this.setState({data:res.data});
            })
    }
	render(){
    	let {data} = this.state;
		return(
			<div id="twothreedim" className="left-right-container">
				<div id="twodim" className="left-container">
					<Twomap data={data}/>
				</div>
				<div id="threedim" className="right-container">
					<Threemap center={[30,110]} data={data} zoom={4}/>
				</div>
				<div id="timeline-div">
					<TimeLine/>
				</div>
			</div>
		)
	}
}

export default Twothreedim;