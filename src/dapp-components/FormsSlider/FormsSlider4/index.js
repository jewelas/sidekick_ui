import React from 'react';

import { Grid } from '@material-ui/core';

import Slider from '@material-ui/core/Slider';

const marks = [
  {
    value: 0,
    label: '0°C'
  },
  {
    value: 20,
    label: '20°C'
  },
  {
    value: 37,
    label: '37°C'
  },
  {
    value: 100,
    label: '100°C'
  }
];

function valuetext(value) {
  return <span>{{ value }}°C</span>;
}

export default function LivePreviewExample() {
  return (
    <>
      <Grid container spacing={6} justify="center">
        <Grid item md={6}>
          <Slider
            className="slider-success my-3"
            track={false}
            getAriaValueText={valuetext}
            defaultValue={30}
            marks={marks}
          />
        </Grid>
        <Grid item md={6}>
          <Slider
            className="slider-warning my-3"
            track={false}
            getAriaValueText={valuetext}
            defaultValue={[20, 37, 50]}
            marks={marks}
          />
        </Grid>
      </Grid>
    </>
  );
}
