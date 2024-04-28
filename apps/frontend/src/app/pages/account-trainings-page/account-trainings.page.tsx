import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { QueryParameters } from '@2299899-fit-friends/consts';
import { fetchTrainerCatalog } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination } from '@2299899-fit-friends/types';

import CardTraining from '../../components/cards/card-training/card-training';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import FormFilterSortCatalog from '../../components/forms/form-filter-sort-catalog/form-filter-sort-catalog';
import Header from '../../components/header/header';

export default function AccountTrainingsPage(): JSX.Element {
  const [query, setQuery] = useState<QueryPagination>({
    limit: QueryParameters.AccountMyTrainingsLimit,
  });

  return (
    <div className="wrapper">
      <Helmet><title>Личный кабинет — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Account} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Мои тренировки</h1>
              <FormFilterSortCatalog
                classNamePrefix='my-training'
                filters={{
                  price: true,
                  calories: true,
                  rating: true,
                  duration: true,
                }}
                sorters={{}}
                setQuery={setQuery}
              />
              <div className="inner-page__content">
                <div className="my-trainings">
                  <ExpandingCatalog
                    fetch={fetchTrainerCatalog}
                    component={CardTraining}
                    classNamePrefix='my-trainings'
                    query={query}
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
