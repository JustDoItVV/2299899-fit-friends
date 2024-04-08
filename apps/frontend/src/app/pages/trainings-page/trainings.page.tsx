import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { FormQueryParams } from '@2299899-fit-friends/consts';
import { fetchTrainingsCatalog } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination } from '@2299899-fit-friends/types';

import CardTraining from '../../components/cards/card-training/card-training';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import FormFilterSortCatalog from '../../components/forms/form-filter-sort-catalog/form-filter-sort-catalog';
import Header from '../../components/header/header';

export default function TrainingsPage(): JSX.Element {
  const [query, setQuery] = useState<QueryPagination>({
    limit: FormQueryParams.TrainingsCatalogLimit,
  });

  return (
    <div className="wrapper">
      <Helmet><title>Каталог тренировок — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Main} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Каталог тренировок</h1>
              <FormFilterSortCatalog
                classNamePrefix='gym-catalog'
                filters={{
                  price: true,
                  calories: true,
                  rating: true,
                  type: true,
                }}
                sorters={{
                  price: true,
                }}
                setQuery={setQuery}
              />
              <ExpandingCatalog
                fetch={fetchTrainingsCatalog}
                query={query}
                component={CardTraining}
                classNamePrefix='training-catalog'
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
