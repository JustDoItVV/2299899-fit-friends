import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import {
    fetchTrainerOrders, redirectToRoute, useAppDispatch
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, QueryPagination } from '@2299899-fit-friends/types';

import CardOrders from '../../components/cards/card-orders/card-orders';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import Header from '../../components/header/header';

export default function AccountOrdersPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const [queryParams,] = useState<QueryPagination>({ page: 1, limit: 4 });

  const handleBackButtonClick = () => {
    dispatch(redirectToRoute(`/${FrontendRoute.Account}`));
  };

  return (
    <div className="wrapper">
      <Helmet><title>Мои заказы — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Account} />
      <main>
        <section className="my-orders">
          <div className="container">
            <div className="my-orders__wrapper">
              <button
                className="btn-flat btn-flat--underlined my-orders__back"
                type="button"
                onClick={handleBackButtonClick}
              >
                <svg width={14} height={10} aria-hidden="true">
                  <use xlinkHref="#arrow-left" />
                </svg>
                <span>Назад</span>
              </button>
              <div className="my-orders__title-wrapper">
                <h1 className="my-orders__title">Мои заказы</h1>
                <div className="sort-for">
                  <p>Сортировать по:</p>
                  <div className="sort-for__btn-container">
                    <button className="btn-filter-sort" type="button">
                      <span>Сумме</span>
                      <svg width={16} height={10} aria-hidden="true">
                        <use xlinkHref="#icon-sort-up" />
                      </svg>
                    </button>
                    <button className="btn-filter-sort" type="button">
                      <span>Количеству</span>
                      <svg width={16} height={10} aria-hidden="true">
                        <use xlinkHref="#icon-sort-down" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <ExpandingCatalog
                fetch={fetchTrainerOrders}
                component={CardOrders}
                classNameList='my-orders__list'
                queryParams={queryParams}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
