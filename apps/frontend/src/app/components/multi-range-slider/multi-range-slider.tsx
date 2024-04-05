import './multi-range-slider.css';

import classnames from 'classnames';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

type MultiRangeSliderProps = {
  min: number,
  max: number,
  onChangeMin: (value: number) => void;
  onChangeMax: (value: number) => void;
  labels?: boolean;
};

export type MultiRangeSliderHandles = {
  setMinValue: (value: number) => void,
  setMaxValue: (value: number) => void,
};

export default forwardRef<MultiRangeSliderHandles, MultiRangeSliderProps>(function MultiRangeSlider(props: MultiRangeSliderProps, ref): JSX.Element {
  const { min, max, onChangeMin, onChangeMax, labels } = props;
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef<HTMLInputElement | null>(null);
  const maxValRef = useRef<HTMLInputElement | null>(null);
  const range = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    setMinValue(value) {
      setMinVal(value);
    },
    setMaxValue(value) {
      setMaxVal(value);
    },
  }));

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    if (onChangeMin) {
      onChangeMin(minVal);
    }
  }, [minVal, onChangeMin]);

  useEffect(() => {
    if (onChangeMax) {
      onChangeMax(maxVal);
    }
  }, [maxVal, onChangeMax])

  return (
    <div className="filter-range">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classnames("thumb thumb--zindex-3", {
          "thumb--zindex-5": minVal > max - 100
        })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        {labels ?? <div className="slider__left-value">{min}</div>}
        {labels ?? <div className="slider__right-value">{max}</div>}
      </div>
    </div>
  );
});
