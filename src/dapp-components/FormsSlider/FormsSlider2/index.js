import React, { useState } from 'react';

import Slider from '@material-ui/core/Slider';

export default function FormsSlider2(props) {
  const [value, setValue] = useState(props.defaultRange);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeCommitted = (event, newValue) => {
    if (props.onChange !== undefined)
      props.onChange(newValue, props.filterId)
  };

  return (
    <>
      <span style={{ fontSize: '15px', position: 'absolute', float: 'right', marginBottom: '10px' }}>{props.title}</span>

      <Slider
        className="slider-second mt-4"
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        min={props.defaultRange[0]}
        max={props.defaultRange[1]}
        getAriaValueText={props.valuetext}
      />
      <span style={{ fontSize: '12px', position: 'absolute', float: 'left', marginTop: '60px' }}>From {value[0]} to {value[1]}</span>
    </>
  );
}
