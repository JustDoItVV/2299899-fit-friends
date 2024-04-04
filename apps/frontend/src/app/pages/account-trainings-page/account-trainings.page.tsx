import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { FrontendRoute, QueryPagination } from '@2299899-fit-friends/types';

import Header from '../../components/header/header';
import TrainingCatalog from '../../components/training-catalog/training-catalog';
import TrainingsQueryForm from '../../components/trainings-query-form/trainings-query-form';

export default function AccountTrainingsPage(): JSX.Element {
  const [queryParams, setQueryParams] = useState<QueryPagination>({ page: 1, limit: 6 });

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
              <TrainingCatalog queryParams={queryParams}/>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
