import React from "react";
import { SketchPicker } from "react-color";
import { useState } from "react";

const ColorInput = ({ color, setColor }) => {
    // console.log(`ColorInput: ${color}`);
    const handleChangeComplete = (color) => {
        setColor(color.hex);
        console.log(`${color.hex}`);
    }

    return (
        <SketchPicker
            color={color}
            onChangeComplete={handleChangeComplete}
        />
    );
}   

export default ColorInput;
