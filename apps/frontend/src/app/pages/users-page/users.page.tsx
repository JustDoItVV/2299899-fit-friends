import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { FormQueryParams } from '@2299899-fit-friends/consts';
import { fetchUsersCatalog } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination } from '@2299899-fit-friends/types';

import CardUser from '../../components/cards/card-user/card-user';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import FormFilterSortCatalog from '../../components/forms/form-filter-sort-catalog/form-filter-sort-catalog';
import Header from '../../components/header/header';

export default function UsersPage(): JSX.Element {
  const [query, setQuery] = useState<QueryPagination>({
    limit: FormQueryParams.UsersCatalogLimit,
  });

  return (
    <div className="wrapper">
      <Helmet><title>Каталог пользователей — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Main} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Каталог пользователей</h1>
              <FormFilterSortCatalog
                classNamePrefix='user-catalog'
                filters={{
                  location: true,
                  specialization: true,
                  level: true,
                }}
                sorters={{
                  role: true,
                }}
                setQuery={setQuery}
              />
              <div className="inner-page__content">
                <ExpandingCatalog
                  fetch={fetchUsersCatalog}
                  query={query}
                  component={CardUser}
                  classNamePrefix='users-catalog'
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
