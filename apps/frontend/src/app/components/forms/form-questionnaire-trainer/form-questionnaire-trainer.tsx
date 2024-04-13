import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import {
    redirectToRoute, selectCurrentUser, selectResponseError, updateUser, useAppDispatch,
    useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { getResponseErrorMessage, pass } from '@2299899-fit-friends/helpers';
import { FrontendRoute, TrainingLevel, TrainingType } from '@2299899-fit-friends/types';
import { unwrapResult } from '@reduxjs/toolkit';

import Loading from '../../loading/loading';

export default function FormQuestionnaireTrainer(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const responseError = useAppSelector(selectResponseError);

  const certificateRef = useRef<HTMLInputElement | null>(null);

  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>(TrainingLevel.Beginner);
  const [merits, setMerits] = useState<string>('');
  const [certificateName, setCertificateName] = useState<string>('Загрузите сюда файл формата PDF');
  const [isReadyToPersonal, setIsReadyToPersonal] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setTrainingTypes([...currentUser.trainingType]);
      setTrainingLevel(currentUser.trainingLevel);
      setMerits(currentUser.merits ? currentUser.merits : '');
      setIsReadyToPersonal(currentUser.isReadyToPersonal ? currentUser.isReadyToPersonal : false);
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

  const handleTrainingLevelChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTrainingLevel(evt.currentTarget.value as TrainingLevel);
  };

  const handleMeritsChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setMerits(evt.currentTarget.value);
  };

  const handleCertificateChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (
      evt.currentTarget.files &&
      evt.currentTarget.files.length !== 0
    ) {
      setCertificateName(evt.currentTarget.files[0].name);
    }
  };

  const handleIsReadyToPersonalInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setIsReadyToPersonal(evt.currentTarget.checked);
  };

  const handleFormSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    if (currentUser.id) {
      try {
        const formData = new FormData();

        trainingTypes.forEach((type) => {
          formData.append('trainingType', type);
        });

        formData.append('trainingLevel', trainingLevel);

        if (
          certificateRef.current?.files &&
          certificateRef.current?.files.length !== 0
        ) {
          formData.append('certificate', certificateRef.current.files[0]);
        }

        formData.append('merits', merits);
        formData.append('isReadyToPersonal', isReadyToPersonal.toString());

        unwrapResult(await dispatch(updateUser({ id: currentUser.id, data: formData })));
        dispatch(redirectToRoute(`/${FrontendRoute.Account}`));
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
        />
        <span className="btn-checkbox__btn">
          {type.charAt(0).toLocaleUpperCase() + type.slice(1)}
        </span>
      </label>
    </div>
  ));

  const trainingLevelsElements = Object.values(TrainingLevel).map((level, index) => (
    <div className="custom-toggle-radio__block" key={`training_level_${index}`}>
      <label>
        <input
          type="radio"
          name="trainingLevel"
          value={level}
          checked={trainingLevel === level}
          onChange={handleTrainingLevelChange}
        />
        <span className="custom-toggle-radio__icon" />
        <span className="custom-toggle-radio__label">
          {level.charAt(0).toLocaleUpperCase() + level.slice(1)}
        </span>
      </label>
    </div>
  ));

  return (
    <form method="post" action="#" onSubmit={handleFormSubmit}>
      <div className="questionnaire-coach">
        <h1 className="visually-hidden">Опросник</h1>
        <div className="questionnaire-coach__wrapper">
          <div className="questionnaire-coach__block">
            <span className="questionnaire-coach__legend">
              Ваша специализация (тип) тренировок
            </span>
            <div className="specialization-checkbox questionnaire-coach__specializations">
              {trainingTypesElements}
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(responseError, 'type')}
            </span>
          </div>
          <div className="questionnaire-coach__block">
            <span className="questionnaire-coach__legend">Ваш уровень</span>
            <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-coach__radio">
              {trainingLevelsElements}
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(responseError, 'traininglevel')}
            </span>
          </div>
          <div className="questionnaire-coach__block">
            <span className="questionnaire-coach__legend">
              Ваши дипломы и сертификаты
            </span>
            <div className="drag-and-drop questionnaire-coach__drag-and-drop">
              <label>
                <span className="drag-and-drop__label" tabIndex={0}>
                  {certificateName}
                  <svg width={20} height={20} aria-hidden="true">
                    <use xlinkHref="#icon-import" />
                  </svg>
                </span>
                <input
                  ref={certificateRef}
                  type="file"
                  name="certificate"
                  tabIndex={-1}
                  accept=".pdf"
                  onChange={handleCertificateChange}
                />
                <span className="custom-input__error">
                  {getResponseErrorMessage(responseError, 'file')}
                </span>
              </label>
            </div>
          </div>
          <div className="questionnaire-coach__block">
            <span className="questionnaire-coach__legend">
              Расскажите о своём опыте, который мы сможем проверить
            </span>
            <div className="custom-textarea questionnaire-coach__textarea">
              <label>
                <textarea
                  name="description"
                  placeholder=" "
                  defaultValue={merits}
                  onChange={handleMeritsChange}
                />
              </label>
            </div>
            <span className="custom-input__error">
              {getResponseErrorMessage(responseError, 'merits')}
            </span>
          </div>
          <div>
            <div className="questionnaire-coach__checkbox">
              <label>
                <input
                  type="checkbox"
                  name="individual-training"
                  checked={isReadyToPersonal}
                  onChange={handleIsReadyToPersonalInputChange}
                />
                <span className="questionnaire-coach__checkbox-icon">
                  <svg width={9} height={6} aria-hidden="true">
                    <use xlinkHref="#arrow-check" />
                  </svg>
                </span>
                <span className="questionnaire-coach__checkbox-label">
                  Хочу дополнительно индивидуально тренировать
                </span>
              </label>
            </div>
          </div>
        </div>
        <button
          className="btn questionnaire-coach__button"
          type="submit"
          disabled={certificateRef.current?.files?.length === 0 && !!merits}
        >
          Продолжить
        </button>
      </div>
    </form>
  );
}
