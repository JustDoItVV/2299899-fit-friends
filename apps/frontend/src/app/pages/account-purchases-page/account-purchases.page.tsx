import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { QueryParameters } from '@2299899-fit-friends/consts';
import { fetchBalanceCatalog, useBackButton } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination } from '@2299899-fit-friends/types';

import CardTrainingBalance from '../../components/cards/card-training-balance/card-training-balance';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import Header from '../../components/header/header';

export default function AccountPurchasesPage(): JSX.Element {
  const [query, setQuery] = useState<QueryPagination>({
    limit: QueryParameters.PurchasesLimit,
  });
  const [active, setActive] = useState<boolean>(false);

  const handleBackButtonClick = useBackButton();

  const handleFilterInputChange = () => {
    if (active) {
      setActive(false);
      setQuery((oldQuery) => {
        const newQuery = { ...oldQuery };
        delete newQuery.availableMin;
        return newQuery;
      });
    } else {
      setActive(true);
      setQuery((oldQuery) => ({ ...oldQuery, availableMin: 1 }));
    }
  };

  return (
    <div className="wrapper">
      <Helmet><title>Мои покупки — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Account} />
      <main>
        <section className="my-purchases">
          <div className="container">
            <div className="my-purchases__wrapper">
              <button
                className="btn-flat my-purchases__back"
                type="button"
                onClick={handleBackButtonClick}
              >
                <svg width={14} height={10} aria-hidden="true">
                  <use xlinkHref="#arrow-left" />
                </svg>
                <span>Назад</span>
              </button>
              <div className="my-purchases__title-wrapper">
                <h1 className="my-purchases__title">Мои покупки</h1>
                <div className="my-purchases__controls">
                  <div
                    className="custom-toggle custom-toggle--switch custom-toggle--switch-right my-purchases__switch"
                    data-validate-type="checkbox"
                  >
                    <label>
                      <input
                        type="checkbox"
                        defaultValue="user-agreement-1"
                        name="user-agreement"
                        checked={active}
                        onChange={handleFilterInputChange}
                      />
                      <span className="custom-toggle__icon">
                        <svg width={9} height={6} aria-hidden="true">
                          <use xlinkHref="#arrow-check" />
                        </svg>
                      </span>
                      <span className="custom-toggle__label">Только активные</span>
                    </label>
                  </div>
                </div>
              </div>
              <ExpandingCatalog
                fetch={fetchBalanceCatalog}
                component={CardTrainingBalance}
                classNamePrefix='my-purchases'
                query={query}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
