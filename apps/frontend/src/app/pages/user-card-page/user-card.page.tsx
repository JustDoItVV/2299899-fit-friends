import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { fetchUserAction, useAppDispatch, useBackButton } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute } from '@2299899-fit-friends/types';

import CardUserInfo from '../../components/cards/card-user-info/card-user-info';
import Header from '../../components/header/header';

export default function UserCardPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const handleBackButtonClick = useBackButton();

  useEffect(() => {
    if (id) {
      dispatch(fetchUserAction(id));
    }
  }, [dispatch, id]);

  return (
    <div className="wrapper">
      <Helmet><title>Карточка пользователя — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Main} />
      <main>
        <div className="inner-page inner-page--no-sidebar">
          <div className="container">
            <div className="inner-page__wrapper">
              <button
                className="btn-flat inner-page__back"
                type="button"
                onClick={handleBackButtonClick}
              >
                <svg width={14} height={10} aria-hidden="true">
                  <use xlinkHref="#arrow-left" />
                </svg>
                <span>Назад</span>
              </button>
              <div className="inner-page__content">
                <CardUserInfo />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
