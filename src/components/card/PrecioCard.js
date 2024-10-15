import React from 'react';

const PrecioCard = (props) => {
    return (
        <div className="card custom-card">
            <div className="card-body info">
                <img src={props.src} alt={props.src} className= "img-responsive float-right"  />
                <div>
                <h6 className="card-title mb-4 fw-semibold">{props.header} </h6>
                <p className="card-text">Teléfono:</p>
                <p className="card-text"><small className="text-muted">{props.label}</small></p>
                <p className="card-text">Dirección:</p>
                <p className="card-text"><small className="text-muted">{props.value}</small></p>
                </div>
                
                
            </div>  
        </div>
    )
};

export default PrecioCard;