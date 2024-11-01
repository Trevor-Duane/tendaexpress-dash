// ReusableFormComponents.js
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';

// Styles
export const styles = {
    button: {
        backgroundColor: '#663399',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        marginLeft: '4px',
        height: '37px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonOutline: {
        backgroundColor: '#fff',
        color: '#663399',
        padding: '10px 20px',
        border: '1px solid #663399',
        marginLeft: '4px',
        height: '37px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonBorderless: {
        backgroundColor: '#fff',
        textDecoderation: 'underline',
        color: '#a020f0',
        padding: '10px 20px',
        border: 'none',
        marginLeft: '4px',
        height: '37px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#e2c0f8',
    },
    buttonOutlineHover: {
        backgroundColor: '#e2c0f8',
        color: '#fff'
    },
    buttonBorderlessHover: {
        backgroundColor: '#e2c0f8',
        color: '#fff'
    },
    inputField: {
        border: '1px solid #a9a9a9',
        padding: '10px',
        width: '100%',
        marginBottom: '10px',
    },
    inputFieldSelect: {
        border: '1px solid #a9a9a9',
        padding: '10px',
        width: '100%',
        marginTop: '10px',
    },
    label: {
        marginBottom: '5px',
        color: '#a020f0',
        display: 'block',
    },
    dropdown: {
        border: '1px solid #a9a9a9',
        borderRadius: '5px',
        padding: '10px',
        width: '100%',
        marginBottom: '10px',
        position: 'relative',
    },
    dropdownIcon: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
    },
    closeIcon: {
        cursor: 'pointer',
        color: '#a9a9a9',
    },
};

// Input Button Component
export const InputButton = ({ onClick, children, icon }) => {
    return (
        <button
            style={styles.button}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// Input Button Outline Component
export const InputButtonOutline = ({ onClick, children }) => {
    return (
        <button
            style={styles.buttonOutline}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonOutlineHover.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.buttonOutline.backgroundColor)}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// Input Button Borderless Component
export const InputButtonBorderless = ({ onClick, children }) => {
    return (
        <button
            style={styles.buttonBorderless}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonBorderlessHover.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.buttonBorderless.backgroundColor)}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// Input Field with Label Component
export const InputField = ({ type, value, name, onChange, placeholder, readOnly }) => {
    return (
        <div>
            <input
                style={styles.inputField}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
            />
        </div>
    );
};

// Input Field with Label Component
export const InputFieldLabel = ({ label, type, value, onChange, placeholder }) => {
    return (
        <div>
            <label style={styles.label}>{label}</label>
            <input
                style={styles.inputField}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

// Close Icon Component
export const CloseIcon = ({ onClose }) => {
    return (
        <button onClick={onClose}>
            <AiOutlineClose style={styles.closeIcon}  size={20} />
        </button>
    );
};

// Dropdown Component
export const Dropdown = ({ label, options, onChange }) => {
    return (
        <div>
            <label style={styles.label}>{label}</label>
            <div style={styles.dropdown}>
                <select style={styles.inputField} onChange={onChange}>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <FaChevronDown style={styles.dropdownIcon} />
            </div>
        </div>
    );
};

// Export all components
export default {
    InputButton,
    InputField,
    CloseIcon,
    Dropdown,
};
