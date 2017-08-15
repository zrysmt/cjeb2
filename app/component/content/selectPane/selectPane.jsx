import './selectPane.scss';

import React,{Component} from 'react';

class SelectPane extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[]
        };
    }
    componentWillReceiveProps(props){
        if(props.data && props.data.length > 0)
            this.setState({data:props.data},()=>{
                console.log('state:',this.state);
            })
    }
    render(){
        let {data} = this.state;
        return(
            <div className="select-pane">
                <ul>
                    {
                        data.map((d,i)=>{
                            return (
                                <li key={"li"+i}>
                                    <div className="subname">【{d.name}】</div>
                                    <div className="subdata">
                                    {
                                        d.subname.map((subData,subIndex)=>{
                                            return (<span key={subIndex}>{subData}</span>);
                                        })
                                    }
                                    </div>

                                </li>
                            );

                        })
                    }
                </ul>
            </div>
        );
    }
}

export default SelectPane;