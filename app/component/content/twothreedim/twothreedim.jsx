/**
 * 二三维联动
 */
import './twothreedim.scss';
import '../../../../node_modules/animate.css/animate.css';

import React from 'react';
import axios from 'axios';
import gConfig from '../../common/gConfig.js';
import Twomap from '../twomap/twomap';
import Threemap from '../threemap/threemap';
import TimeLine from '../../widget/timeLine/timeLine';
import SelectPane from "../selectPane/selectPane";

let config = new gConfig();
let server = config.getServer();

class Twothreedim extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            ind: [],
            isIndShow: false,
            showAnimate: 'fadeIn'
        };
        this.handIndCtlClick = this.handIndCtlClick.bind(this);
    }

    componentDidMount() {
        this.getDataFromServer();
    }

    getDataFromServer() {
        axios.get(`${server}getjson/allcity/2000/GDP`)
            .then((res) => {
                if (!res.data) return;
                console.log('res:', res);
                this.setState({data: res.data});
            }).catch((err) => {
            console.warn(err);
        })
    }

    dealIndData(data) {
        let res = [];
        let obj = {};
        data.forEach((d, i) => {
            if (!obj[d.lev1]) {
                res.push({
                    name: d.lev1,
                    subname: []
                });
                obj[d.lev1] = true;
            }
            res.forEach((d2, i2) => {
                if (d.lev1 === d2.name) {
                    d2.subname.push(d.lev3);
                }
            })
        });

        return res;
    }

    handIndCtlClick() {
        axios.get(`${server}getjson/allInd`)
            .then((res) => {
                if (__DEV__) console.log('res:', res);
                if (!res.data) return;

                let data = this.dealIndData(res.data);

                this.setState({
                    ind: data,
                    isIndShow: !this.state.isIndShow,
                    showAnimate: this.state.showAnimate == "fadeIn" ? "fadeIn" : "fadeOut"
                });
            }).catch((err) => {
            console.warn(err);
        })
    }

    render() {
        let {data, ind, isIndShow, showAnimate} = this.state;
        let indPaneDisplay = isIndShow ? "block" : "none";

        return (
            <div id="twothreedim" className="left-right-container">
                <div id="ind-div">
                    <div id="ind-ctl" style={{
                            height: '13px', width: "13px", borderRadius: '13px',
                            boxShadow: "1px 1px 5px #cccccc",
                            backgroundColor: "#ffffff"
                         }}
                         onClick={this.handIndCtlClick}></div>
                    <div id="ind-pane" className={"animated " + showAnimate}
                         style={{display: indPaneDisplay}}>
                        <SelectPane data={ind}/>
                    </div>
                </div>
                <div id="twodim" className="left-container">
                    <Twomap data={data}/>
                </div>
                <div id="threedim" className="right-container">
                    <Threemap center={[30, 110]} data={data} zoom={4}/>
                </div>
                <div id="timeline-div">
                    <TimeLine/>
                </div>
            </div>
        )
    }
}

export default Twothreedim;