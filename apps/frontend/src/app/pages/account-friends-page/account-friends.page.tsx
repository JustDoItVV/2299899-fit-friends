import './account-friends.page.css';

import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import {
    fetchRequests, fetchTrainerFriends, fetchUserFriends, selectCurrentUser, useAppSelector,
    useBackButton, useFetchPagination
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination, UserRole } from '@2299899-fit-friends/types';

import CardFriends from '../../components/cards/card-friends/card-friends';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import Header from '../../components/header/header';

export default function AccountFriendsPage(): JSX.Element {
  const currentUser = useAppSelector(selectCurrentUser);
  const handleBackButtonClick = useBackButton();
  const [query, setQuery] = useState<QueryPagination>({});
  const { items: requests, fetchAll: fetch } = useFetchPagination(fetchRequests, query);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentUser) {
      setQuery(currentUser?.role === UserRole.Trainer ? { targetId: currentUser.id } : { authorId: currentUser.id });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="wrapper">
      <Helmet><title>Список друзей — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Friends} />
      <main>
        <section className="friends-list">
          <div ref={ref} className="container">
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
                component={CardFriends}
                classNamePrefix='friends-list'
                query={{ limit: 3 }}
                additionalData={{ requests }}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
