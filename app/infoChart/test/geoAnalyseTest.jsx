
import React from 'react';
import {Lbasemap,GeoAnalyse} from '../src/index';
import axios from 'axios';
const server = "http://localhost:8000/";

class GeoAnalyseTest extends React.Component{
	constructor(props) {
        super(props);
        this.state = {
            data: [],
            ind: [],  //所有的指标
            isIndShow: false,
            isInfoModalRefresh:false,
            showAnimate: 'fadeIn',
            year:'2000',
            currentInd:"GDP"
        };
        this.handleInfoModal = this.handleInfoModal.bind(this);
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
        // axios.get(`${server}data/point-grid`)
        axios.get(`${server}data/cjeb-point-grid`)
            .then((res) => {
                if (!res.data) return;
                console.log('res:', res);
                if(callback) callback.call(this,res.data);
            }).catch((err) => {
            console.warn(err);
        })
    }
	handleInfoModal(data){
        console.log('handleInfoModal:',data);
        let res = [
            {name:"省",value:data.province},
            {name:"城市",value:data.cityName},
            {name:"编号",value:data.cityCode},
            {name:"lat",value:data.lat},
            {name:"lng",value:data.lng},
            {name:"年份",value:data.year},
            {name:[data.name],value:(data.value||"")+(data.unit||"")}
        ];
        this.setState({isInfoModalShow:true,clickedInfo:data,info:res},()=>{
            console.log('this.state',this.state);
        });
    }    	
	render(){
		let {data,info} = this.state;
		return(
			<div >	
				<GeoAnalyse 
					mapBind = 'Lbasemap'
					type = 'isolines'
    				data = {data}	
    				extend = {[21,97.5,35,122.5]}				
				>
				</GeoAnalyse>
				<Lbasemap
    				mapType="osm" 
					zoom = {5}
					center = {[30,104]}    	
					scale={true} 
				    osmGeocoder={false} 
				    maptypebar={true}								
    			>
    			</Lbasemap>								
			</div>						
		)
	}
}

export default GeoAnalyseTest;