import '@testing-library/jest-dom';

import {
    CatalogItem, makeFakeState, makeFakeTraining, State
} from '@2299899-fit-friends/frontend-core';
import { Pagination, QueryPagination } from '@2299899-fit-friends/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import ExpandingCatalog from './expanding-catalog';

describe('Component ExpandingCatalog', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
  });
  test('should render correctly', async () => {
    const fetch = createAsyncThunk<Pagination<CatalogItem>, QueryPagination, AsyncThunkConfig>('mock', async () => ({
      entities: [makeFakeTraining(), makeFakeTraining()],
      totalItems: 2,
      totalPages: 1,
      itemsPerPage: 50,
      currentPage: 1,
    }));
    const { withStoreComponent } = withStore(withHistory(
      <ExpandingCatalog
        fetch={fetch}
        query={{}}
        component={jest.fn(function() { return <div>Card</div> })}
      />
    ), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryAllByText('Card').length).toBe(2);
    expect(screen.queryByText('Показать еще')).toBeInTheDocument();
    expect(screen.getByText('Показать еще').className.includes('show-more__button--to-top')).toBeTruthy();
    expect(screen.queryByText('Вернуться в начало')).toBeInTheDocument();
    expect(screen.getByText('Вернуться в начало').className.includes('show-more__button--to-top')).toBeTruthy();
  });

  test('should render correctly for multiple pages and first page', async () => {
    const fetch = createAsyncThunk<Pagination<CatalogItem>, QueryPagination, AsyncThunkConfig>('mock', async () => ({
      entities: [makeFakeTraining(), makeFakeTraining()],
      totalItems: 2,
      totalPages: 2,
      itemsPerPage: 1,
      currentPage: 1,
    }));
    const { withStoreComponent } = withStore(withHistory(
      <ExpandingCatalog
        fetch={fetch}
        query={{}}
        component={jest.fn(function() { return <div>Card</div> })}
      />
    ), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryAllByText('Card').length).toBe(2);
    expect(screen.getByText('Показать еще').className.includes('show-more__button--to-top')).toBeFalsy();
    expect(screen.getByText('Вернуться в начало').className.includes('show-more__button--to-top')).toBeTruthy();
  });

  test('should render correctly for multiple pages and first page', async () => {
    const fetch = createAsyncThunk<Pagination<CatalogItem>, QueryPagination, AsyncThunkConfig>('mock', async () => ({
      entities: [makeFakeTraining(), makeFakeTraining()],
      totalItems: 2,
      totalPages: 2,
      itemsPerPage: 1,
      currentPage: 2,
    }));
    const { withStoreComponent } = withStore(withHistory(
      <ExpandingCatalog
        fetch={fetch}
        query={{}}
        component={jest.fn(function() { return <div>Card</div> })}
      />
    ), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryAllByText('Card').length).toBe(2);
    expect(screen.getByText('Показать еще').className.includes('show-more__button--to-top')).toBeTruthy();
    expect(screen.getByText('Вернуться в начало').className.includes('show-more__button--to-top')).toBeFalsy();
  });

  test('should render correctly for zero records', async () => {
    const fetch = createAsyncThunk<Pagination<CatalogItem>, QueryPagination, AsyncThunkConfig>('mock', async () => ({
      entities: [],
      totalItems: 0,
      totalPages: 1,
      itemsPerPage: 1,
      currentPage: 1,
    }));
    const { withStoreComponent } = withStore(withHistory(
      <ExpandingCatalog
        fetch={fetch}
        query={{}}
        component={jest.fn(function() { return <div>Card</div> })}
      />
    ), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryAllByText('Card').length).toBe(0);
    expect(screen.queryByText('Записей не найдено')).toBeInTheDocument();
  });
});


