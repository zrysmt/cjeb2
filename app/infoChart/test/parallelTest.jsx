/**
 *  mapType 地图类型
 *  scale  是否显示比例尺
 *  osmGeocoder 是否显示osmGeocoder
 *  maptypebar 是否显示地图切换按钮
 * <Map2D mapType="geoq_normalm3" scale={true} osmGeocoder={false} maptypebar={true}>
 *	</Map2D>
 * 
 */
import React from 'react';
import {Map2D,Chart,InfoModal} from '../src/index';
import axios from 'axios';
const server = "http://localhost:8000/";

class ParallelTest extends React.Component{
	constructor(props) {
        super(props);
        this.state = {
            data: [],
            data1:[],
            ind: [],  //所有的指标
            isIndShow: false,
            isInfoModalRefresh:false,
            showAnimate: 'fadeIn',
            year:'2000',
            currentInd:"143,144,145",
            'ind':'GDP'
        };
        this.handleInfoModal = this.handleInfoModal.bind(this);
    }	
	componentDidMount(){
		let {year,currentInd,ind} = this.state;
		this.getDataFromServer(year,currentInd,ind,(data,data1)=>{
            this.setState({
                isInfoModalRefresh:true,
                data:data,
                data1:data1
            })
        });		
	}
 	getDataFromServer(year,indName,ind,callback) {
        axios.get(`${server}byindids/citys/allcity/${year}/${indName}`)
            .then((res) => {
                axios.get(`${server}getjson/allcity/${year}/${ind}`)
                    .then((res1) => {
                        console.log('res,res1:',res, res1);
                        if(callback) callback.call(this,res.data,res1.data);
                    })
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
		let {data,data1,info,mapType,zoom,center,option,scale,
            osmGeocoder,maptypebar} = this.state;

		return(
			<div>                               	
                <Map2D
                    show = {true}
                    mapType={mapType||"geoq_normalm3"}
                    zoom = {zoom||5}
                    center = {center||[30,104]}
                    option={option||{size:5,color:['#44a3e5']}}
                    scale={scale||true} 
                    osmGeocoder={osmGeocoder||false} 
                    maptypebar={maptypebar||true}
                    selectbar = {true}

                    height = '300px'
                    width = '100%'
                    adapt = {false}
                    adaptOtherHeight = {105}
                    adaptTime = {300}
                >
                </Map2D>
                <Chart 
                    type = 'scatter'
                    data = {data1}
                    show = {true}
                    option={{
                        size:5,
                        /*classify:{   //不进行分类
                            numbers:5,
                            field:'value'
                        },*/
                        iconUrl:require('./assets/imgs/point.png')
                    }}
                >
                </Chart>                    
                <Chart 
                    show = {true}  
                    data={false}
                    type = 'multiScatter'
                    // geocode = 'cityName'
                    option={{
                        size:5,
                        classify:{
                            type:'icon',
                            field:'name'
                        },
                        iconUrl:[require('./assets/imgs/point.svg'),
                            require('./assets/imgs/point1.svg'),require('./assets/imgs/point3.svg')]
                    }}
                >
                </Chart> }                                
				<Chart  
                    show = {true}
					data={data}
                    type = 'parallel'
					option={{
						field:{
                            name:'name',  //defalut
                            value:'value', //defalut
                            marker:'cityName'      //点唯一id字段
                        },
                        height:'300px',
                        width:'85%',
					}}
				>
				</Chart>
                              
				<div id="infomodal-div">
                	<InfoModal info={info}/>
            	</div>					
			</div>						
		)
	}
}

export default ParallelTest;