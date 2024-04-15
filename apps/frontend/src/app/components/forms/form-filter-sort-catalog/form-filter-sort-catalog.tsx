import classnames from 'classnames';
import { debounce } from 'lodash';
import { ChangeEvent, MouseEvent, useCallback, useMemo, useRef, useState } from 'react';

import {
    CaloriesTargetLimit, DEBOUNCE_THRESHOLD, METRO_STATIONS, PriceLimit, RatingLimit
} from '@2299899-fit-friends/consts';
import { redirectToRoute, useAppDispatch } from '@2299899-fit-friends/frontend-core';
import { isEmptyObject } from '@2299899-fit-friends/helpers';
import {
    FrontendRoute, QueryPagination, SortDirection, TrainingDuration, TrainingLevel,
    TrainingSortOption, TrainingType
} from '@2299899-fit-friends/types';

import MultiRangeSlider, {
    MultiRangeSliderHandles
} from '../../multi-range-slider/multi-range-slider';

type FormFilterSortCatalogProps = {
  classNamePrefix: string;
  filters: Record<string, boolean>;
  sorters: Record<string, boolean>;
  setQuery: React.Dispatch<React.SetStateAction<QueryPagination>>;
  title?: string;
  buttonBackPath?: string;
  debounceTreshold?: number;
};

export default function FormFilterSortCatalog(props: FormFilterSortCatalogProps): JSX.Element {
  const { classNamePrefix, title, filters, sorters, setQuery } = props;
  const backButtonPath = props.buttonBackPath ?? `/${FrontendRoute.Main}`;
  const debounceTreshold = props.debounceTreshold ?? DEBOUNCE_THRESHOLD;

  const dispatch = useAppDispatch();

  const priceMinInputRef = useRef<HTMLInputElement | null>(null);
  const priceMaxInputRef = useRef<HTMLInputElement | null>(null);
  const sliderPriceRef = useRef<MultiRangeSliderHandles | null>(null);
  const caloriesMinInputRef = useRef<HTMLInputElement | null>(null);
  const caloriesMaxInputRef = useRef<HTMLInputElement | null>(null);
  const sliderCaloriesRef = useRef<MultiRangeSliderHandles | null>(null);
  const locationRef = useRef<string[]>([]);
  const typeRef = useRef<string[]>([]);
  const specializationRef = useRef<string[]>([]);
  const durationRef = useRef<string[]>([]);

  const [locationsShowAll, setLocationsShowAll] = useState<boolean>(false);
  const [typesShowAll, setTypesShowAll] = useState<boolean>(false);

  const debouncedSetQueryParams = useMemo(() =>
    debounce((params: Record<string, string[] | string | null>) => {
      setQuery((oldData) => {
        const newData = { ...oldData };
        Object.keys(params).forEach((key) => {
          if (!params[key]) {
            delete newData[key];
          } else {
            newData[key] = params[key];
          }
        });
        return newData;
      });
    }, debounceTreshold),
    [setQuery, debounceTreshold],
  );

  const handleBackButtonClick = () => {
    dispatch(redirectToRoute(backButtonPath));
  };

  const handlePriceMinInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const slider = sliderPriceRef.current;
    const target = evt.currentTarget;
    if (slider) {
      slider.setMinValue(target.valueAsNumber || PriceLimit.Min);
    }
    debouncedSetQueryParams({ priceMin: target.value ? target.value : null });
  };

  const handlePriceMinChange = useCallback((value: number) => {
    if (priceMinInputRef.current) {
      priceMinInputRef.current.value = value.toString();
    }
    debouncedSetQueryParams({ priceMin: value.toString()});
  }, [debouncedSetQueryParams]);

  const handlePriceMaxInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const slider = sliderPriceRef.current;
    const target = evt.currentTarget;
    if (slider) {
      slider.setMaxValue(target.valueAsNumber || PriceLimit.MockMax);
    }
    debouncedSetQueryParams({ priceMax: target.value ? target.value : null });
  };

  const handleInputInput = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.currentTarget.validity.valid) {
      evt.currentTarget.value = '';
    }
  };

  const handlePriceMaxChange = useCallback((value: number) => {
    if (priceMaxInputRef.current) {
      priceMaxInputRef.current.value = value.toString();
    }
    debouncedSetQueryParams({ priceMax: value.toString() });
  }, [debouncedSetQueryParams]);

  const handleCaloriesMinInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const slider = sliderCaloriesRef.current;
    const target = evt.currentTarget;
    if (slider) {
      slider.setMinValue(target.valueAsNumber || CaloriesTargetLimit.Min);
    }
    debouncedSetQueryParams({ caloriesMin: target.value ? target.value : null });
  };

  const handleCaloriesMinChange = useCallback((value: number) => {
    if (caloriesMinInputRef.current) {
      caloriesMinInputRef.current.value = value.toString();
    }
    debouncedSetQueryParams({ caloriesMin: value.toString() });
  }, [debouncedSetQueryParams]);

  const handleCaloriesMaxInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const slider = sliderCaloriesRef.current;
    const target = evt.currentTarget;
    if (slider) {
      slider.setMaxValue(target.valueAsNumber || CaloriesTargetLimit.Max);
    }
    debouncedSetQueryParams({ caloriesMax: target.value ? target.value : null });
  };

  const handleCaloriesMaxChange = useCallback((value: number) => {
    if (caloriesMaxInputRef.current) {
      caloriesMaxInputRef.current.value = value.toString();
    }
    debouncedSetQueryParams({ caloriesMax: value.toString() });
  }, [debouncedSetQueryParams]);

  const handleRatingMinChange = useCallback((value: number) => {
    debouncedSetQueryParams({ ratingMin: value.toString() });
  }, [debouncedSetQueryParams]);

  const handleRatingMaxChange = useCallback((value: number) => {
    debouncedSetQueryParams({ ratingMax: value.toString() });
  }, [debouncedSetQueryParams]);

  const handleLocationInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;
    const index = locationRef.current.indexOf(value);

    if (evt.currentTarget.checked) {
      locationRef.current.push(value);
    } else if (index !== -1) {
      locationRef.current.splice(index, 1);
    }

    debouncedSetQueryParams({ location: locationRef.current });
  };

  const handleTypeInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;
    const index = typeRef.current.indexOf(value);

    if (evt.currentTarget.checked) {
      typeRef.current.push(value);
    } else if (index !== -1) {
      typeRef.current.splice(index, 1);
    }

    debouncedSetQueryParams({ type: typeRef.current });
  };

  const handleSpecializationInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;
    const index = specializationRef.current.indexOf(value);

    if (evt.currentTarget.checked) {
      specializationRef.current.push(value);
    } else if (index !== -1) {
      specializationRef.current.splice(index, 1);
    }

    debouncedSetQueryParams({ specialization: specializationRef.current });
  };

  const handleLevelInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    debouncedSetQueryParams({ level: evt.currentTarget.value });
  };

  const handleDurationInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.currentTarget.value;
    const index = durationRef.current.indexOf(value);

    if (evt.currentTarget.checked) {
      durationRef.current.push(value);
    } else if (index !== -1) {
      durationRef.current.splice(index, 1);
    }

    debouncedSetQueryParams({ duration: durationRef.current });
  };

  const handleSortPriceChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const queryOptions: Record<string, string> = {
      sortOption: TrainingSortOption.Price,
    };
    const value = evt.currentTarget.value;

    if (value === 'free') {
      queryOptions.sortDirection = SortDirection.Asc;
      queryOptions.priceMin = PriceLimit.Min.toString();
      queryOptions.priceMax = PriceLimit.Min.toString();
    } else {
      queryOptions.sortDirection = value;
    }

    debouncedSetQueryParams(queryOptions);
  };

  const handleSortRoleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    debouncedSetQueryParams({ sortOption: 'role', sortDirection: evt.currentTarget.value });
  };

  const handleLocationsShowAllButtonClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.currentTarget.classList.add('visually-hidden');
    setLocationsShowAll(true);
  };

  const handleTypesShowAllButtonClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.currentTarget.classList.add('visually-hidden');
    setTypesShowAll(true);
  };

  const durationFilterElements = Object.values(TrainingDuration).map((duration, index) => (
    <li className={`${classNamePrefix}-form__check-list-item`} key={`duration_filter_${index}`}>
      <div className="custom-toggle custom-toggle--checkbox">
        <label>
          <input
            type="checkbox"
            value={duration}
            name="duration"
            onChange={handleDurationInputChange}
          />
          <span className="custom-toggle__icon">
            <svg width={9} height={6} aria-hidden="true">
              <use xlinkHref="#arrow-check" />
            </svg>
          </span>
          <span className="custom-toggle__label">
            {duration}
          </span>
        </label>
      </div>
    </li>
  ));

  const locationElements = METRO_STATIONS.map((location, index) => (
    <li className={classnames(
      `${classNamePrefix}-form__check-list-item`,
      { 'visually-hidden': !locationsShowAll && index > 3 },
    )} key={`filter_location_${index}`}>
      <div className="custom-toggle custom-toggle--checkbox">
        <label>
          <input
            type="checkbox"
            value={location}
            name="user-agreement"
            onChange={handleLocationInputChange}
          />
          <span className="custom-toggle__icon">
            <svg width={9} height={6} aria-hidden="true">
              <use xlinkHref="#arrow-check" />
            </svg>
          </span>
          <span className="custom-toggle__label">{location}</span>
        </label>
      </div>
    </li>
  ));

  const typeFilterElements = Object.values(TrainingType).map((type, index) => (
    <li className={`${classNamePrefix}__check-list-item`} key={`type_filter_${index}`}>
      <div className="custom-toggle custom-toggle--checkbox">
        <label>
          <input
            type="checkbox"
            value={type}
            name="type"
            onChange={handleTypeInputChange}
          />
          <span className="custom-toggle__icon">
            <svg width={9} height={6} aria-hidden="true">
              <use xlinkHref="#arrow-check" />
            </svg>
          </span>
          <span className="custom-toggle__label">
            {type.charAt(0).toLocaleUpperCase() + type.slice(1)}
          </span>
        </label>
      </div>
    </li>
  ));

  const specializationFilterElements = Object.values(TrainingType).map((specialization, index) => (
    <li className={classnames(
      `${classNamePrefix}-form__check-list-item`,
      { 'visually-hidden': !typesShowAll && index > 3 }
    )} key={`type_filter_${index}`}>
      <div className="custom-toggle custom-toggle--checkbox">
        <label>
          <input
            type="checkbox"
            value={specialization}
            name="spezialization"
            onChange={handleSpecializationInputChange}
          />
          <span className="custom-toggle__icon">
            <svg width={9} height={6} aria-hidden="true">
              <use xlinkHref="#arrow-check" />
            </svg>
          </span>
          <span className="custom-toggle__label">
            {specialization.charAt(0).toLocaleUpperCase() + specialization.slice(1)}
          </span>
        </label>
      </div>
    </li>
  ));

  const levelElements = Object.values(TrainingLevel).map((level, index) => (
    <div className="custom-toggle-radio__block" key={`filter_level_${index}`}>
      <label>
        <input
          type="radio"
          name="user-agreement"
          value={level}
          onChange={handleLevelInputChange}
        />
        <span className="custom-toggle-radio__icon" />
        <span className="custom-toggle-radio__label">
          {level.charAt(0).toLocaleUpperCase() + level.slice(1)}
        </span>
      </label>
    </div>
  ));

  return (
    <div className={`${classNamePrefix}-form`}>
      {
        title &&
        <h2 className="visually-hidden">{title} Фильтр</h2>
      }
        <div className={`${classNamePrefix}-form__wrapper`}>
        <button
          className={`btn-flat btn-flat--underlined ${classNamePrefix}-form__btnback`}
          type="button"
          onClick={handleBackButtonClick}
        >
          <svg width={14} height={10} aria-hidden="true">
            <use xlinkHref="#arrow-left" />
          </svg>
          <span>Назад</span>
        </button>
        {
          !isEmptyObject(filters) &&
          <h3 className={`${classNamePrefix}-form__title`}>фильтры</h3>
        }
        <form className={`${classNamePrefix}-form__form`}>
          {
            Object.prototype.hasOwnProperty.call(filters, 'price') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--price`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>Цена, ₽</h4>
              <div className="filter-price">
                <div className="filter-price__input-text filter-price__input-text--min">
                  <input
                    ref={priceMinInputRef}
                    type="number"
                    id="text-min"
                    name="text-min"
                    min={PriceLimit.Min}
                    onChange={handlePriceMinInputChange}
                    onInput={handleInputInput}
                  />
                  <label htmlFor="text-min">от</label>
                </div>
                <div className="filter-price__input-text filter-price__input-text--max">
                  <input
                    ref={priceMaxInputRef}
                    type="number"
                    id="text-max"
                    name="text-max"
                    onChange={handlePriceMaxInputChange}
                  />
                  <label htmlFor="text-max">до</label>
                </div>
              </div>
              <div className="filter-range">
                <MultiRangeSlider
                  ref={sliderPriceRef}
                  min={PriceLimit.Min}
                  max={PriceLimit.MockMax}
                  onChangeMin={handlePriceMinChange}
                  onChangeMax={handlePriceMaxChange}
                  labels={false}
                />
              </div>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'calories') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--calories`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>Калории</h4>
              <div className="filter-calories">
                <div className="filter-calories__input-text filter-calories__input-text--min">
                  <input
                    ref={caloriesMinInputRef}
                    type="number"
                    id="text-min-cal"
                    name="text-min-cal"
                    min={1}
                    onChange={handleCaloriesMinInputChange}
                    onInput={handleInputInput}
                  />
                  <label htmlFor="text-min-cal">от</label>
                </div>
                <div className="filter-calories__input-text filter-calories__input-text--max">
                  <input
                    ref={caloriesMaxInputRef}
                    type="number"
                    id="text-max-cal"
                    name="text-max-cal"
                    onChange={handleCaloriesMaxInputChange}
                  />
                  <label htmlFor="text-max-cal">до</label>
                </div>
              </div>
              <div className="filter-range">
                <MultiRangeSlider
                  ref={sliderCaloriesRef}
                  min={CaloriesTargetLimit.Min}
                  max={CaloriesTargetLimit.Max}
                  onChangeMin={handleCaloriesMinChange}
                  onChangeMax={handleCaloriesMaxChange}
                  labels={false}
                />
              </div>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'rating') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--raiting`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>Рейтинг</h4>
              <div className="filter-raiting">
                <MultiRangeSlider
                  min={0}
                  max={RatingLimit.Max}
                  onChangeMin={handleRatingMinChange}
                  onChangeMax={handleRatingMaxChange}
                />
              </div>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'location') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--location`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>
                Локация, станция метро
              </h4>
              <ul className={`${classNamePrefix}-form__check-list`}>
                {locationElements}
              </ul>
              <button
                className={`btn-show-more ${classNamePrefix}-form__btn-show`}
                type="button"
                onClick={handleLocationsShowAllButtonClick}
              >
                <span>Посмотреть все</span>
                <svg
                  className="btn-show-more__icon"
                  width={10}
                  height={4}
                  aria-hidden="true"
                >
                  <use xlinkHref="#arrow-down" />
                </svg>
              </button>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'type') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--type`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>
                Тип
              </h4>
              <ul className={`${classNamePrefix}-form__check-list`}>
                {typeFilterElements}
              </ul>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'specialization') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--spezialization`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>
                Тип
              </h4>
              <ul className={`${classNamePrefix}-form__check-list`}>
                {specializationFilterElements}
              </ul>
              <button
                className={`btn-show-more ${classNamePrefix}-form__btn-show`}
                type="button"
                onClick={handleTypesShowAllButtonClick}
              >
                <span>Посмотреть все</span>
                <svg
                  className="btn-show-more__icon"
                  width={10}
                  height={4}
                  aria-hidden="true"
                >
                  <use xlinkHref="#arrow-down" />
                </svg>
              </button>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'level') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--level`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>
                Ваш уровень
              </h4>
              <div className="custom-toggle-radio">
                {levelElements}
              </div>
            </div>
          }
          {
            Object.prototype.hasOwnProperty.call(filters, 'duration') &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--duration`}>
              <h4 className={`${classNamePrefix}-form__block-title`}>
                Длительность
              </h4>
              <ul className={`${classNamePrefix}-form__check-list`}>
                {durationFilterElements}
              </ul>
            </div>
          }
          {
            !isEmptyObject(sorters) &&
            <div className={`${classNamePrefix}-form__block ${classNamePrefix}-form__block--sort`}>
              <h4 className={`${classNamePrefix}-form__title ${classNamePrefix}-form__title--sort`}>
                Сортировка
              </h4>
              {
                Object.prototype.hasOwnProperty.call(sorters, 'price') &&
                <div className={`btn-radio-sort ${classNamePrefix}-form__radio`}>
                  <label>
                    <input type="radio" name="sort" value={SortDirection.Asc} onChange={handleSortPriceChange} defaultChecked />
                    <span className="btn-radio-sort__label">Дешевле</span>
                  </label>
                  <label>
                    <input type="radio" name="sort" value={SortDirection.Desc} onChange={handleSortPriceChange} />
                    <span className="btn-radio-sort__label">Дороже</span>
                  </label>
                  <label>
                    <input type="radio" name="sort" value='free' onChange={handleSortPriceChange} />
                    <span className="btn-radio-sort__label">Бесплатные</span>
                  </label>
                </div>
              }
              {
                Object.prototype.hasOwnProperty.call(sorters, 'role') &&
                <div className="btn-radio-sort">
                  <label>
                    <input
                      type="radio"
                      name="sort"
                      value={SortDirection.Desc}
                      onChange={handleSortRoleChange}
                    />
                    <span className="btn-radio-sort__label">
                      Тренеры
                    </span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="sort"
                      value={SortDirection.Asc}
                      onChange={handleSortRoleChange}
                    />
                    <span className="btn-radio-sort__label">
                      Пользователи
                    </span>
                  </label>
                </div>
              }
            </div>
          }
        </form>
      </div>
    </div>
  );
}
