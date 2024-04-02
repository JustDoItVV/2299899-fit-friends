import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { selectResponseError, updateUserAction } from '@2299899-fit-friends/storage';
import { TrainingDuration, TrainingLevel, TrainingType, User } from '@2299899-fit-friends/types';

import { useAppDispatch, useAppSelector } from '../hooks';
import Loading from '../loading/loading';

type QuestionnaireFormUserProps = {
  user: User | null;
};

export default function QuestionnaireFormUser(props: QuestionnaireFormUserProps): JSX.Element {
  const { user } = props;
  const dispatch = useAppDispatch();
  const responseError = useAppSelector(selectResponseError);
  const [updatedTrainingTypes, setUpdatedTrainingTypes] = useState<TrainingType[]>([]);
  const [updatedTrainingDuration, setUpdatedTrainingDuration] = useState<TrainingDuration>(TrainingDuration.Thirty);
  const [updatedTrainingLevel, setUpdatedTrainingLevel] = useState<TrainingLevel>(TrainingLevel.Beginner);
  const [updatedCaloriesTarget, setUpdatedCaloriesTarget] = useState<number | null>(null);
  const [updatedCaloriesPerDay, setUpdatedCaloriesPerDay] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setUpdatedTrainingTypes([...user.trainingType]);
      setUpdatedTrainingDuration(user.trainingDuration ? user.trainingDuration : TrainingDuration.Thirty);
      setUpdatedTrainingLevel(user.trainingLevel);
      setUpdatedCaloriesTarget(user.caloriesTarget ? user.caloriesTarget : null);
      setUpdatedCaloriesPerDay(user.caloriesPerDay ? user.caloriesPerDay : null);
    }
  }, [user]);

  if (!user) {
    return <Loading />;
  }

  const hadleTrainingTypeInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const trainingType = evt.currentTarget.value as TrainingType;

    if (!updatedTrainingTypes.includes(trainingType)) {
      setUpdatedTrainingTypes([...updatedTrainingTypes, trainingType]);
    } else {
      const elementIndex = updatedTrainingTypes.indexOf(trainingType)
      setUpdatedTrainingTypes([...updatedTrainingTypes.slice(0, elementIndex), ...updatedTrainingTypes.slice(elementIndex + 1)]);
    }
  }

  const handleTrainingDurationChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setUpdatedTrainingDuration(evt.currentTarget.value as TrainingDuration);
  };

  const handleTrainingLevelChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setUpdatedTrainingLevel(evt.currentTarget.value as TrainingLevel);
  };

  const getCaloriesInputChangeHandler = <T, V extends HTMLInputElement>(setState: React.Dispatch<React.SetStateAction<T>>) =>
    (evt: ChangeEvent<V>) => {
      if (evt.currentTarget) {
        setState(evt.currentTarget.valueAsNumber as T);
      }
    };

  const handleFormSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (user.id) {
      const formData = new FormData();

      updatedTrainingTypes.forEach((type) => {
        formData.append('trainingType', type);
      });

      formData.append('trainingDuration', updatedTrainingDuration);
      formData.append('trainingLevel', updatedTrainingLevel);
      formData.append('caloriesTarget', updatedCaloriesTarget ? updatedCaloriesTarget.toString() : '');
      formData.append('caloriesPerDay', updatedCaloriesPerDay ? updatedCaloriesPerDay.toString() : '');

      dispatch(updateUserAction({ id: user.id, data: formData }));
    }
  }

  const trainingTypes = Object.values(TrainingType).map((type, index) => (
    <div className="btn-checkbox" key={`training_type_${index}`} >
      <label>
        <input
          className="visually-hidden"
          type="checkbox"
          name="trainingType"
          value={type}
          checked={updatedTrainingTypes.includes(type)}
          onChange={hadleTrainingTypeInputChange}
        />
        <span className="btn-checkbox__btn">
          {type.charAt(0).toLocaleUpperCase() + type.slice(1)}
        </span>
      </label>
    </div>
  ));

  const trainingDurations = Object.values(TrainingDuration).map((duration, index) => (
    <div className="custom-toggle-radio__block" key={`training_duration_${index}`}>
      <label>
        <input
          type="radio"
          name="trainingDuration"
          value={duration}
          checked={updatedTrainingDuration === duration}
          onChange={handleTrainingDurationChange}
        />
        <span className="custom-toggle-radio__icon" />
        <span className="custom-toggle-radio__label">
          {duration}
        </span>
      </label>
    </div>
  ));

  const trainingLevels = Object.values(TrainingLevel).map((level, index) => (
    <div className="custom-toggle-radio__block" key={`training_level_${index}`}>
      <label>
        <input
          type="radio"
          name="trainingLevel"
          value={level}
          checked={updatedTrainingLevel === level}
          onChange={handleTrainingLevelChange}
        />
        <span className="custom-toggle-radio__icon" />
        <span className="custom-toggle-radio__label">
          {level.charAt(0).toLocaleUpperCase() + level.slice(1)}
        </span>
      </label>
    </div>
  ));

  const getResponseErrorMessage = (
    codes: number[],
    statusCode: number | undefined,
    message: string | string[] | undefined,
    field: string
  ) => {
    if (!statusCode || !message || !codes.includes(statusCode)) {
      return ' ';
    }

    if (!Array.isArray(message)) {
      return message;
    }

    return message.filter((item) => item.toLowerCase().includes(field)).join(', ');
  };

  return (
    <form method="post" action="#" onSubmit={handleFormSubmit}>
      <div className="questionnaire-user">
        <h1 className="visually-hidden">Опросник</h1>
        <div className="questionnaire-user__wrapper">
          <div className="questionnaire-user__block">
            <span className="questionnaire-user__legend">
              Ваша специализация (тип) тренировок
            </span>
            <div className="specialization-checkbox questionnaire-user__specializations">
              {trainingTypes}
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(
                [400],
                responseError?.statusCode,
                responseError?.message,
                'type'
              )}
            </span>
          </div>
          <div className="questionnaire-user__block">
            <span className="questionnaire-user__legend">
              Сколько времени вы готовы уделять на тренировку в день
            </span>
            <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-user__radio">
              {trainingDurations}
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(
                [400],
                responseError?.statusCode,
                responseError?.message,
                'duration'
              )}
            </span>
          </div>
          <div className="questionnaire-user__block">
            <span className="questionnaire-user__legend">
              Ваш уровень
            </span>
            <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-user__radio">
              {trainingLevels}
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(
                [400],
                responseError?.statusCode,
                responseError?.message,
                'level'
              )}
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
                    <input type="number" name="calories-lose" onChange={getCaloriesInputChangeHandler(setUpdatedCaloriesTarget)} required />
                    <span className="custom-input__text">ккал</span>
                  </span>
                  <span className="custom-input__error">
                    {getResponseErrorMessage(
                      [400],
                      responseError?.statusCode,
                      responseError?.message,
                      'target'
                    )}
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
                    <input type="number" name="calories-waste" onChange={getCaloriesInputChangeHandler(setUpdatedCaloriesPerDay)} required />
                    <span className="custom-input__text">ккал</span>
                  </span>
                  <span className="custom-input__error">
                    {getResponseErrorMessage(
                      [400],
                      responseError?.statusCode,
                      responseError?.message,
                      'per'
                    )}
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