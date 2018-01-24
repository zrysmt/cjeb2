/**
 *  mapType 地图类型
 *  scale  是否显示比例尺
 *  osmGeocoder 是否显示osmGeocoder
 *  maptypebar 是否显示地图切换按钮
 * <Lbasemap mapType="geoq_normalm3" scale={true} osmGeocoder={false} maptypebar={true}>
 *	</Lbasemap>
 * 
 */
import React from 'react';
import {Lbasemap,Chart,InfoModal} from '../src/index';
import axios from 'axios';
const server = "http://localhost:8000/";

class SvgScatterChartTest2 extends React.Component{
	constructor(props) {
        super(props);
        this.state = {
            data: [],
            ind: [],  //所有的指标
            isIndShow: false,
            isInfoModalRefresh:false,
            showAnimate: 'fadeIn',
            year:'2000',
            currentInd:"143,144,145"
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
        axios.get(`${server}byindids/citys/allcity/${year}/${indName}`)
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
		let {data,info,mapType,zoom,center,option,scale,osmGeocoder,maptypebar} = this.state;

		return(
			<div >	
				<Chart 
					show = {true}  
					data={data}
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
				</Chart>
                <Lbasemap 
                    mapType={mapType||"geoq_normalm3"}
                    zoom = {zoom||5}
                    center = {center||[30,104]}
                    option={option||{size:5,color:['#44a3e5']}}
                    scale={scale||true} 
                    osmGeocoder={osmGeocoder||false} 
                    maptypebar={maptypebar||true}
                >
                </Lbasemap>                  
				<div id="infomodal-div">
                	<InfoModal info={info}/>
            	</div>					
			</div>						
		)
	}
}

export default SvgScatterChartTest2;