import { Helmet } from 'react-helmet-async';

import { selectCurrentUser, useAppSelector } from '@2299899-fit-friends/frontend-core';
import { UserRole } from '@2299899-fit-friends/types';

import FormQuestionnaireTrainer from '../../components/forms/form-questionnaire-trainer/form-questionnaire-trainer';
import FormQuestionnaireUser from '../../components/forms/form-questionnaire-user/form-questionnaire-user';

export default function QuestionnairePage(): JSX.Element {
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <div className="wrapper">
      <Helmet>
        <title>Опросник — FitFriends</title>
      </Helmet>
      <main>
        <div className="background-logo">
          <svg
            className="background-logo__logo"
            width={750}
            height={284}
            aria-hidden="true"
          >
            <use xlinkHref="#logo-big" />
          </svg>
          <svg
            className="background-logo__icon"
            width={343}
            height={343}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-logotype" />
          </svg>
        </div>
        <div className="popup-form popup-form--questionnaire-user">
          <div className="popup-form__wrapper">
            <div className="popup-form__content">
              <div className="popup-form__form">
                {currentUser?.role === UserRole.Trainer ? (
                  <FormQuestionnaireTrainer />
                ) : (
                  <FormQuestionnaireUser />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
