
import React from 'react';
import './RemoveCartItems.css'
import { Link } from 'react-router-dom'

const STYLES = ['remove--btn--primary', 'remove--btn--outline'];

const SIZES = ['remove--btn--medium', 'remove--btn--large'];

export const RemoveCartItems = ({
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize
}) =>{
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]


    return (
        <Link  className="remove--btn-mobile">
            <button
            className={`remove--btn ${checkButtonStyle} ${checkButtonSize}`}
            onClick={onClick}
            type={type}
            >
            {children}
            </button>
        </Link>
    );
};