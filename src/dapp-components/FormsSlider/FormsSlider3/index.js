import React, { useState } from 'react';

import { Grid } from '@material-ui/core';

import Slider from '@material-ui/core/Slider';
function valuetext(value) {
  return <span>{{ value }}°C</span>;
}

export default function LivePreviewExample() {
  const [value, setValue] = useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container spacing={6} justify="center">
        <Grid item md={6}>
          <Slider
            className="slider-primary mt-4"
            track="inverted"
            value={value}
            onChange={handleChange}
            valueLabelDisplay="on"
            getAriaValueText={valuetext}
          />
          <div className="divider mt-4" />
          <Slider
            className="slider-second mt-4"
            track="inverted"
            value={value}
            onChange={handleChange}
            valueLabelDisplay="on"
            getAriaValueText={valuetext}
          />
        </Grid>
        <Grid item md={6}>
          <Slider
            className="slider-first mt-4"
            track="inverted"
            value={value}
            onChange={handleChange}
            valueLabelDisplay="on"
            getAriaValueText={valuetext}
          />
          <div className="divider mt-4" />
          <Slider
            className="slider-danger mt-4"
            track="inverted"
            value={value}
            onChange={handleChange}
            valueLabelDisplay="on"
            getAriaValueText={valuetext}
          />
        </Grid>
      </Grid>
    </>
  );
}
