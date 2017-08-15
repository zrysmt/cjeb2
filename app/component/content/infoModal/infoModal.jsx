import './infoModal.scss';

import React from 'react';

const InfoModal = ({info})=>{
    console.log("info",info);
    if(info.length == 0) return (<ul></ul>);

    return(
        <ul className="infomodal-ul">
            {
                info.map((data, index) => {
                    return (<li key={index}>
                        <div className="name-div"> {data.name} </div>
                        <div className="value-div"> {data.value} </div>
                        </li>)
                })
            }
        </ul>
    )
}


export default InfoModal;