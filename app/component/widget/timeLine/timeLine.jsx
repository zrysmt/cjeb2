import './timeLine.scss';

import React,{Component} from 'react';

class TimeLine extends React.Component{
    constructor(props){
        super(props);
    }
    static get defaultProps() {
        return {
            year:{
                min:1985,
                max:2015
            }
        };
    }
    render(){
        let {year} = this.props;
        console.log(year);
        let yearArr = [];
        for (let i = year.min||1985;i <= year.max||2015;i++){
            yearArr.push(i);
        }

        return(
            <ul>
                yearArr.map((year,ind)=>{
                    <li data-year="year" key="year">year</li>
                })
            </ul>
        );
    }
}
export default TimeLine;

