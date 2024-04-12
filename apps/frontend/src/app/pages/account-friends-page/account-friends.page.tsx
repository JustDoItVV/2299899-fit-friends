import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import {
    fetchTrainerFriends, fetchUserFriends, redirectToRoute, selectCurrentUser, useAppDispatch,
    useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination, UserRole } from '@2299899-fit-friends/types';

import CardFriendsTrainer from '../../components/cards/card-friends-trainer/card-friends-trainer';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import Header from '../../components/header/header';

export default function AccountFriendsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const [query,] = useState<QueryPagination>({ page: 1, limit: 3 });

  const handleBackButtonClick = () => {
    dispatch(redirectToRoute(`/${FrontendRoute.Account}`));
  };

  return (
    <div className="wrapper">
      <Helmet><title>Список друзей — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Friends} />
      <main>
        <section className="friends-list">
          <div className="container">
            <div className="friends-list__wrapper">
              <button className="btn-flat friends-list__back" type="button" onClick={handleBackButtonClick} >
                <svg width={14} height={10} aria-hidden="true">
                  <use xlinkHref="#arrow-left" />
                </svg>
                <span>Назад</span>
              </button>
              <div className="friends-list__title-wrapper">
                <h1 className="friends-list__title">Мои друзья</h1>
              </div>
              <ExpandingCatalog
                fetch={currentUser?.role === UserRole.Trainer ? fetchTrainerFriends : fetchUserFriends}
                component={CardFriendsTrainer}
                classNamePrefix='friends-list'
                query={query}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
