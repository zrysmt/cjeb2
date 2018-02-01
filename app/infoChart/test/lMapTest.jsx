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

class LMapTest extends React.Component{
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
        axios.get(`${server}getjson/allcity/${year}/${indName}`)
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
			<div>
                <Chart 
                    show = {false}
                    data={data}
                    type = 'scatter'
                    option={{
                        size:5,
                        offset:{
                            x:0.1,
                            y:0.2
                        }
                        // iconUrl:require('./assets/imgs/point.png')
                    }}
                >
                </Chart>                	
				<Chart 
                    show = {true}
					data={data}
                    type = 'scatter'
					option={{
						size:5,
                        iconUrl:require('./assets/imgs/point.png')
					}}
				>
				</Chart>
                <Lbasemap 
                    show = {true}
                    mapType={"geoq_normalm3"}
                    zoom = {5}
                    center = {[30,104]}
                    option={{size:5,color:['#44a3e5']}}
                    scale={true} 
                    osmGeocoder={false} 
                    maptypebar={true}
                    height = {'500px'}
                >
                </Lbasemap>                
				<div id="infomodal-div">
                	<InfoModal info={info}/>
            	</div>					
			</div>						
		)
	}
}

export default LMapTest;