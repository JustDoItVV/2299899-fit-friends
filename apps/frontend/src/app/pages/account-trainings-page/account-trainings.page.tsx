import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { fetchTrainerCatalog } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination } from '@2299899-fit-friends/types';

import CardTraining from '../../components/cards/card-training/card-training';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import Header from '../../components/header/header';
import TrainingsQueryForm from '../../components/trainings-query-form/trainings-query-form';

export default function AccountTrainingsPage(): JSX.Element {
  const [queryParams, setQueryParams] = useState<QueryPagination>({ page: 1, limit: 3 });

  return (
    <div className="wrapper">
      <Helmet><title>Личный кабинет — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Account} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Мои тренировки</h1>
              <TrainingsQueryForm setQueryParams={setQueryParams} />
              <div className="inner-page__content">
                <div className="my-trainings">
                  <ExpandingCatalog
                    fetch={fetchTrainerCatalog}
                    component={CardTraining}
                    classNameList='my-trainings__list'
                    queryParams={queryParams}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}