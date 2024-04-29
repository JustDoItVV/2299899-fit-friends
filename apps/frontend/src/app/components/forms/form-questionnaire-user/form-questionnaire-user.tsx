import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import {
    redirectToRoute, selectCurrentUser, selectResponseError, updateUser, useAppDispatch,
    useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { getResponseErrorMessage, pass } from '@2299899-fit-friends/helpers';
import {
    FrontendRoute, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

import Loading from '../../loading/loading';

export default function QuestionnaireFormUser(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const responseError = useAppSelector(selectResponseError);

  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [trainingDuration, setTrainingDuration] = useState<TrainingDuration | null>(null);
  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel | null>(null);
  const [caloriesTarget, setCaloriesTarget] = useState<number | null>(null);
  const [caloriesPerDay, setCaloriesPerDay] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser) {
      setTrainingTypes([...currentUser.trainingType]);
      setTrainingDuration(currentUser.trainingDuration ? currentUser.trainingDuration : null);
      setTrainingLevel(currentUser.trainingLevel);
      setCaloriesTarget(currentUser.caloriesTarget ? currentUser.caloriesTarget : null);
      setCaloriesPerDay(currentUser.caloriesPerDay ? currentUser.caloriesPerDay : null);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Loading />;
  }

  const hadleTrainingTypeInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const trainingType = evt.currentTarget.value as TrainingType;
    setTrainingTypes((old) => {
      let newValues;
      if (!old.includes(trainingType)) {
        newValues = [...old, trainingType];
      } else {
        const elementIndex = old.indexOf(trainingType);
        newValues = [...old.slice(0, elementIndex), ...old.slice(elementIndex + 1)];
      }
      return newValues;
    });
  };

  const handleTrainingDurationChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTrainingDuration(evt.currentTarget.value as TrainingDuration);
  };

  const handleTrainingLevelChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTrainingLevel(evt.currentTarget.value as TrainingLevel);
  };

  const getCaloriesInputChangeHandler = <T, V extends HTMLInputElement>(
      setState: React.Dispatch<React.SetStateAction<T>>
    ) => (evt: ChangeEvent<V>) => {
      if (evt.currentTarget) {
        setState(evt.currentTarget.valueAsNumber as T);
      }
    };

  const handleFormSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    if (currentUser.id) {
      try {
        const formData = new FormData();

        trainingTypes.forEach((type) => {
          formData.append('trainingType', type);
        });

        formData.append('trainingDuration', trainingDuration ?? '');
        formData.append('trainingLevel', trainingLevel ?? '');
        formData.append('caloriesTarget', caloriesTarget ? caloriesTarget.toString() : '');
        formData.append('caloriesPerDay', caloriesPerDay ? caloriesPerDay.toString() : '');

        unwrapResult(await dispatch(updateUser({ id: currentUser.id, data: formData })));
        dispatch(redirectToRoute(`/${FrontendRoute.Main}`));
      } catch {
        pass();
      }
    }
  };

  const trainingTypesElements = Object.values(TrainingType).map((type, index) => (
    <div className="btn-checkbox" key={`training_type_${index}`}>
      <label>
        <input
          className="visually-hidden"
          type="checkbox"
          name="trainingType"
          value={type}
          checked={trainingTypes.includes(type)}
          onChange={hadleTrainingTypeInputChange}
          data-testid='form-questionnaire-input-type'
        />
        <span className="btn-checkbox__btn">
          {type.charAt(0).toLocaleUpperCase() + type.slice(1)}
        </span>
      </label>
    </div>
  ));

  const trainingDurationsElements = Object.values(TrainingDuration).map(
    (duration, index) => (
      <div
        className="custom-toggle-radio__block"
        key={`training_duration_${index}`}
      >
        <label>
          <input
            type="radio"
            name="trainingDuration"
            value={duration}
            checked={trainingDuration === duration}
            onChange={handleTrainingDurationChange}
            data-testid='form-questionnaire-input-duration'
          />
          <span className="custom-toggle-radio__icon" />
          <span className="custom-toggle-radio__label">{duration}</span>
        </label>
      </div>
    )
  );

  const trainingLevelsElements = Object.values(TrainingLevel).map((level, index) => (
    <div className="custom-toggle-radio__block" key={`training_level_${index}`}>
      <label>
        <input
          type="radio"
          name="trainingLevel"
          value={level}
          checked={trainingLevel === level}
          onChange={handleTrainingLevelChange}
          data-testid='form-questionnaire-input-level'
        />
        <span className="custom-toggle-radio__icon" />
        <span className="custom-toggle-radio__label">
          {level.charAt(0).toLocaleUpperCase() + level.slice(1)}
        </span>
      </label>
    </div>
  ));

  return (
    <form method="post" action="#" onSubmit={handleFormSubmit} data-testid='questionnaire-form'>
      <div className="questionnaire-user">
        <h1 className="visually-hidden">Опросник</h1>
        <div className="questionnaire-user__wrapper">
          <div className="questionnaire-user__block">
            <span className="questionnaire-user__legend">
              Ваша специализация (тип) тренировок
            </span>
            <div className="specialization-checkbox questionnaire-user__specializations">
              {trainingTypesElements}
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(responseError, 'type')}
            </span>
          </div>
          <div className="questionnaire-user__block">
            <span className="questionnaire-user__legend">
              Сколько времени вы готовы уделять на тренировку в день
            </span>
            <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-user__radio">
              {trainingDurationsElements}
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(responseError, 'duration')}
            </span>
          </div>
          <div className="questionnaire-user__block">
            <span className="questionnaire-user__legend">Ваш уровень</span>
            <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-user__radio">
              {trainingLevelsElements}
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(responseError, 'traininglevel')}
            </span>
          </div>
          <div className="questionnaire-user__block">
            <div className="questionnaire-user__calories-lose">
              <span className="questionnaire-user__legend">
                Сколько калорий хотите сбросить
              </span>
              <div className="custom-input custom-input--with-text-right questionnaire-user__input">
                <label>
                  <span className="custom-input__wrapper">
                    <input
                      type="number"
                      name="calories-lose"
                      onChange={getCaloriesInputChangeHandler(setCaloriesTarget)}
                      required
                    />
                    <span className="custom-input__text">ккал</span>
                  </span>
                  <span className="custom-input__error">
                    {getResponseErrorMessage(responseError, 'target')}
                  </span>
                </label>
              </div>
            </div>
            <div className="questionnaire-user__calories-waste">
              <span className="questionnaire-user__legend">
                Сколько калорий тратить в день
              </span>
              <div className="custom-input custom-input--with-text-right questionnaire-user__input">
                <label>
                  <span className="custom-input__wrapper">
                    <input
                      type="number"
                      name="calories-waste"
                      onChange={getCaloriesInputChangeHandler(setCaloriesPerDay)}
                      required
                    />
                    <span className="custom-input__text">ккал</span>
                  </span>
                  <span className="custom-input__error">
                    {getResponseErrorMessage(responseError, 'per')}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <button className="btn questionnaire-user__button" type="submit">
          Продолжить
        </button>
      </div>
    </form>
  );
}
