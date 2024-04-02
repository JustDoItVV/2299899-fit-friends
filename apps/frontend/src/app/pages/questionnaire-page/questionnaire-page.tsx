import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { fetchUserAction, selectCurrentUser, selectUser } from '@2299899-fit-friends/storage';
import { UserRole } from '@2299899-fit-friends/types';

import { useAppDispatch, useAppSelector } from '../../components/hooks';
import QuestionnaireFormTrainer from '../../components/questionnaire-form-trainer/questionnaire-form-trainer';
import QuestionnaireFormUser from '../../components/questionnaire-form-user/questionnaire-form-user';

export default function QuestionnairePage(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserAction(currentUser?.id));
    }
  }, [dispatch, currentUser]);

  return (
    <div className="wrapper">
      <Helmet><title>Опросник — FitFriends</title></Helmet>
      <main>
        <div className="background-logo">
          <svg className="background-logo__logo" width={750} height={284} aria-hidden="true">
            <use xlinkHref="#logo-big" />
          </svg>
          <svg className="background-logo__icon" width={343} height={343} aria-hidden="true">
            <use xlinkHref="#icon-logotype" />
          </svg>
        </div>
        <div className="popup-form popup-form--questionnaire-user">
          <div className="popup-form__wrapper">
            <div className="popup-form__content">
              <div className="popup-form__form">
                {currentUser?.role === UserRole.Trainer ? <QuestionnaireFormTrainer user={user} /> : <QuestionnaireFormUser user={user} />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
