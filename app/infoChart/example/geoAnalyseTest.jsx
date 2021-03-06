
import React from 'react';
import {Map2D,GeoAnalyse} from '../src/index';
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
		let {type} = this.props.params;
		let layerCtl = {buffer:false,isolines:false,tin:false,voronoi:false,opreate:false}
		switch (type){
			case 'buffer':
                layerCtl.buffer = true
				break;
            case 'isolines':
                layerCtl.isolines = true
                break;
            case 'tin':
                layerCtl.tin = true
                break;
            case 'voronoi':
                layerCtl.voronoi = true
                break;
            case 'opreate':
                layerCtl.opreate = true
                break;
			default :
                layerCtl.buffer = true

        }

		return(
			<div>	
				<GeoAnalyse 
					mapBind = 'Map2D'
					type = 'opreate'
    				data = {data}	
    				//data1 = {}      // 可以是第二份数据
    				show = {layerCtl.opreate}
    				option = {{
    					show:{
    						point:true
    					},
    					opreate:{
    						intersect:[
    							{opreate:'voronoi',data:data},
    							{opreate:'buffer',data:data,option:{gap:[80]}},
    						]
    					},
    					fillColor:'#045A8D', 
    					color:'#99d594', 
    					weight:2 
    					
    				}}			
				>     
				</GeoAnalyse>			
				<GeoAnalyse 
					mapBind = 'Map2D'
					type = 'voronoi'
    				data = {data}	
    				show = {layerCtl.voronoi}
    				option = {{
    					show:{
    						point:true
    					},
    					voronoi:{
    						// bbox:[]    //optional
    					},
    					fillColor:'#045A8D', 
    					color:'#99d594', 
    					weight:2 
    					
    				}}			
				>     
				</GeoAnalyse>			
				<GeoAnalyse 
					mapBind = 'Map2D'
					type = 'tin'
    				data = {data}	
    				show = {layerCtl.tin}
    				option = {{
    					show:{
    						point:true
    					},
    					tin:{
    						field: 'value',
    						gap:500,
    						// color:['#045A8D','#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'], //optional
    					},
    					color:'#045A8D', 
    					weight:2 
    					
    				}}			
				>
				</GeoAnalyse>				
				<GeoAnalyse 
					mapBind = 'Map2D'
					type = 'buffer'
    				data = {data}	
    				show = {layerCtl.buffer}
    				option = {{
    					show:{
    						point:true,
    						legend:true
    					},
    					buffer:{
    						units: 'kilometers',
    						gap:[20,50,80],
    						label:[20,50,80]
    					},
    					color:['#045A8D','#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'], 
    					weight:2 
    					
    				}}			
				>
				</GeoAnalyse>				
				<GeoAnalyse 
					mapBind = 'Map2D'
					type = 'isolines'
    				data = {data}	
    				show = {layerCtl.isolines}
    				option = {{
    					show:{
    						point:true,
    						legend:true
    					},
    					interpolate:{
							gridType: 'points', 
							property: 'value', 
							units: 'kilometers',
							cellSize:10
    						
    					},
    					breaks:{
    						field:'value',  //defalut value
    						gap:50,         // defalut 50
    						numbers:100     // defalut 50
    					},
    					color:['#045A8D','#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'],  //defalut same
    					colorGap:10,
    					weight:3            // defalut 3
    				}}			
				>
				</GeoAnalyse>
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

export default GeoAnalyseTest;