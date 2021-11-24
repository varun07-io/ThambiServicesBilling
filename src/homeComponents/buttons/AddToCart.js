
import React from 'react';
import './AddToCart.css'
import { Link } from 'react-router-dom'

const STYLES = ['cart--btn--primary', 'cart--btn--outline'];

const SIZES = ['cart--btn--medium', 'cart--btn--large'];

export const AddToCart = ({
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize
}) =>{
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]


    return (
        <Link  className="cart--btn-mobile">
            <button
            className={`cart--btn ${checkButtonStyle} ${checkButtonSize}`}
            onClick={onClick}
            type={type}
            >
            {children}
            </button>
        </Link>
    );
};