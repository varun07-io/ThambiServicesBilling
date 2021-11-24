
import React from 'react';
import './BillingButton.css'
import { Link } from 'react-router-dom'

const STYLES = ['billing--btn--primary', 'billing--btn--outline'];

const SIZES = ['billing--btn--medium', 'billing--btn--large'];

export const BillingButton = ({
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize
}) =>{
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]


    return (
        <Link  className="billing--btn-mobile">
            <button
            className={`billing--btn ${checkButtonStyle} ${checkButtonSize}`}
            onClick={onClick}
            type={type}
            >
            {children}
            </button>
        </Link>
    );
};