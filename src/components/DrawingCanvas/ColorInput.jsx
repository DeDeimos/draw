import React from "react";
import { SketchPicker } from "react-color";
import { Twitter } from "react-color/lib/components/twitter/Twitter";
import { useState } from "react";
import { CompactPicker } from "react-color";

const ColorInput = ({ color, setColor }) => {
    // console.log(`ColorInput: ${color}`);
    const handleChangeComplete = (color) => {
        setColor(color.hex);
        console.log(`${color.hex}`);
    }

    return (
        // <SketchPicker
        //     color={color}
        //     onChangeComplete={handleChangeComplete}
        // />
        <CompactPicker
            color={color}
            onChange={handleChangeComplete}
            />
    );
}   

export default ColorInput;
