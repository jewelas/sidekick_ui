import React, { useState, useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Strings from '../../config/localization/translations'

export default function StringComponent(props) {
  const { prefix, suffix } = props;
  const { selectedLangauge } = useStoreState((state) => state.Dapp);

  const getString = (jsonPath, langaugeId) => {
    //console.log(Strings);
    return jsonPath[langaugeId] === '' ? jsonPath[1] : jsonPath[langaugeId];
  }

  return (
    <>
      <span>{ (prefix === undefined ? '' : prefix )  + getString(props.string, selectedLangauge) + (suffix === undefined ? '' : suffix ) }</span>
    </>
  );
}
