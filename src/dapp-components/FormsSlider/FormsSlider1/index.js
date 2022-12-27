import React, { useState } from 'react';

import { Grid } from '@material-ui/core';

import Slider from '@material-ui/core/Slider';

function valuetext(value) {
  return <span>{{ value }}°C</span>;
}

export default function FormsSlider1(props) {
  const [value, setValue] = useState(props.value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Grid container spacing={6} justify="center">
        <Grid item md={6}>
          <Slider
            className="slider-primary my-3"
            value={value}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </>
  );
}
