
import React from 'react';
import {Map3D,GeoAnalyse3D} from '../src/index';
import axios from 'axios';
const server = "http://localhost:8000/";

class GeoAnalyse3DTest extends React.Component{
	constructor(props) {
        super(props);
        this.state = {
            data: [],
            ind: [],  //所有的指标
            isIndShow: false,
            isInfoModalRefresh:false,
            showAnimate: 'fadeIn',
            year:'2000',
            currentInd:"GDP",
          
            center:[30,104],
            height:10000000,          
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
		let {center,height,data,info} = this.state;
		return(	
            <div>
                <GeoAnalyse3D 
                    mapBind = 'Map3D'
                    type = 'voronoi3D'
                    data = {data}   
                    show = {false}
                    option = {{
                        show:{
                            point:true
                        },
                        voronoi:{
                            field: 'value',
                            opacity:1,   //defalut 0.5
                            color:'#045A8D',//'#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'], //optional
                            outline:true,
                            heightSize:500, 
                        }
                    }}  
                >
                </GeoAnalyse3D>                
                <GeoAnalyse3D 
                    mapBind = 'Map3D'
                    type = 'voronoi'
                    data = {data}   
                    show = {false}
                    option = {{
                        show:{
                            point:true
                        },
                        voronoi:{
                            opacity:0.5,   //defalut 0.5
                            color:'#045A8D'//'#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'], //optional
                        }
                    }}  
                >
                </GeoAnalyse3D>                 
                <GeoAnalyse3D 
                    mapBind = 'Map3D'
                    type = 'tin3D'
                    data = {data}   
                    show = {false}
                    option = {{
                        show:{
                            point:true
                        },
                        tin:{
                            field: 'value',     
                            heightSize:500,  //defalut 500
                            randomColor:false,
                            opacity:1,   //defalut 0.5
                            color:'#045A8D'//'#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'], //optional
                        }
                    }}  
                >
                </GeoAnalyse3D>                			
				<GeoAnalyse3D 
					mapBind = 'Map3D'
					type = 'tin'
                    data = {data}   
                    show = {true}
                    option = {{
                        show:{
                            point:true
                        },
                        tin:{
                            field: 'value',     //defalut 'value'
                            // markerColor:'',  //optional
                            color:'#045A8D'//'#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'], //optional
                        }
                    }}	
				>
				</GeoAnalyse3D>
				<Map3D
					center = {center}
					height = {height}  
                    viewerOption = {{
                        imageryProvider : 'OpenStreetMap'
                    }}  							
    			>
    			</Map3D>
			</div>						
		)
	}
}

export default GeoAnalyse3DTest;