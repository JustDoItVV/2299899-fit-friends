import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { updateUserAction } from '@2299899-fit-friends/storage';
import { TrainingLevel, TrainingType, User } from '@2299899-fit-friends/types';

import { useAppDispatch } from '../hooks';
import Loading from '../loading/loading';

type QuestionnaireFormTrainerProps = {
  user: User | null;
};

export default function QuestionnaireFormTrainer(props: QuestionnaireFormTrainerProps): JSX.Element {
  const { user } = props;
  const dispatch = useAppDispatch();
  const [updatedTrainingTypes, setUpdatedTrainingTypes] = useState<TrainingType[]>([]);
  const [updatedTrainingLevel, setUpdatedTrainingLevel] = useState<TrainingLevel>(TrainingLevel.Beginner);
  const certificateRef = useRef<HTMLInputElement | null>(null);
  const [updatedMerits, setUpdatedMerits] = useState<string>('');
  const [updatedIsReadyToPersonal, setUpdatedIsReadyToPersonal] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUpdatedTrainingTypes([...user.trainingType]);
      setUpdatedTrainingLevel(user.trainingLevel);
      setUpdatedMerits(user.merits ? user.merits : '');
      setUpdatedIsReadyToPersonal(user.isReadyToPersonal ? user.isReadyToPersonal : false);
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

  const handleTrainingLevelChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setUpdatedTrainingLevel(evt.currentTarget.value as TrainingLevel);
  };

  const handleMeritsChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedMerits(evt.currentTarget.value);
  }

  const handleFormSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (user.id) {
      const formData = new FormData();

      updatedTrainingTypes.forEach((type) => {
        formData.append('trainingType', type);
      });

      formData.append('trainingLevel', updatedTrainingLevel);

      if (certificateRef.current?.files && certificateRef.current?.files.length !== 0) {
        formData.append('certificate', certificateRef.current.files[0]);
      }

      formData.append('merits', updatedMerits);
      formData.append('isReadyToPersonal', updatedIsReadyToPersonal.toString());

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
              {trainingTypes}
            </div>
          </div>
          <div className="questionnaire-coach__block">
            <span className="questionnaire-coach__legend">Ваш уровень</span>
            <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-coach__radio">
              {trainingLevels}
            </div>
          </div>
          <div className="questionnaire-coach__block">
            <span className="questionnaire-coach__legend">
              Ваши дипломы и сертификаты
            </span>
            <div className="drag-and-drop questionnaire-coach__drag-and-drop">
              <label>
                <span className="drag-and-drop__label" tabIndex={0}>
                  Загрузите сюда файл формата PDF
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
                />
              </label>
            </div>
          </div>
          <div className="questionnaire-coach__block">
            <span className="questionnaire-coach__legend">
              Расскажите о своём опыте, который мы сможем проверить
            </span>
            <div className="custom-textarea questionnaire-coach__textarea">
              <label>
                <textarea name="description" placeholder=" " defaultValue={""} onChange={handleMeritsChange} />
              </label>
            </div>
            <div className="questionnaire-coach__checkbox">
              <label>
                <input
                  type="checkbox"
                  name="individual-training"
                  defaultChecked
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
        <button className="btn questionnaire-coach__button" type="submit" disabled={certificateRef.current?.files?.length === 0 && !!updatedMerits}>
          Продолжить
        </button>
      </div>
    </form>
  );
}
