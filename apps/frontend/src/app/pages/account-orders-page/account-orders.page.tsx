import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { fetchTrainerOrders, useBackButton } from '@2299899-fit-friends/frontend-core';
import {
    FrontendRoute, OrderSortOption, QueryPagination, SortDirection
} from '@2299899-fit-friends/types';

import CardOrders from '../../components/cards/card-orders/card-orders';
import ExpandingCatalog from '../../components/expanding-catalog/expanding-catalog';
import Header from '../../components/header/header';

export default function AccountOrdersPage(): JSX.Element {
  const [query, setQuery] = useState<QueryPagination>({ page: 1, limit: 4 });
  const [sumOrder, setSumOrder] = useState<SortDirection>(SortDirection.Desc);
  const [amountOrder, setAmountOrder] = useState<SortDirection>(SortDirection.Desc);
  const sortFieldRef = useRef<OrderSortOption>(OrderSortOption.CreatedAt);

  const handleBackButtonClick = useBackButton(`/${FrontendRoute.Account}`);

  const handleSortSumButtonClick = () => {
    const newOrder = sumOrder === SortDirection.Desc ? SortDirection.Asc : SortDirection.Desc;
    if (sortFieldRef.current !== OrderSortOption.OrderSum) {
      sortFieldRef.current = OrderSortOption.OrderSum;
    }
    setSumOrder(newOrder);
    setQuery((old) => ({
      ...old,
      sortOption: sortFieldRef.current,
      sortDirection: newOrder,
    }));
  };

  const handleSortAmountButtonClick = () => {
    const newOrder = amountOrder === SortDirection.Desc ? SortDirection.Asc : SortDirection.Desc;
    if (sortFieldRef.current !== OrderSortOption.Amount) {
      sortFieldRef.current = OrderSortOption.Amount;
    }
    setAmountOrder(newOrder);
    setQuery((old) => ({
      ...old,
      sortOption: sortFieldRef.current,
      sortDirection: newOrder,
    }));
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
                    <button className="btn-filter-sort" type="button" onClick={handleSortSumButtonClick}>
                      <span>Сумме</span>
                      <svg width={16} height={10} aria-hidden="true">
                        <use xlinkHref={`#icon-sort-${sumOrder === SortDirection.Desc ? 'up' : 'down'}`} />
                      </svg>
                    </button>
                    <button className="btn-filter-sort" type="button" onClick={handleSortAmountButtonClick}>
                      <span>Количеству</span>
                      <svg width={16} height={10} aria-hidden="true">
                        <use xlinkHref={`#icon-sort-${amountOrder === SortDirection.Desc ? 'up' : 'down'}`} />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <ExpandingCatalog
                fetch={fetchTrainerOrders}
                component={CardOrders}
                classNamePrefix='my-orders'
                query={query}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
