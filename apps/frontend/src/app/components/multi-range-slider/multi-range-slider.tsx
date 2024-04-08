import './multi-range-slider.css';

import classnames from 'classnames';
import {
    ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState
} from 'react';

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

  const handleMinInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(+evt.currentTarget.value, maxVal - 1);
    setMinVal(value);
    evt.currentTarget.value = value.toString();
    onChangeMin(value);
  };

  const handleMaxInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(+evt.currentTarget.value, minVal + 1);
    setMaxVal(value);
    evt.currentTarget.value = value.toString();
    onChangeMax(value);
  };

  return (
    <div className="filter-range">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={handleMinInputChange}
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
        onChange={handleMaxInputChange}
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
