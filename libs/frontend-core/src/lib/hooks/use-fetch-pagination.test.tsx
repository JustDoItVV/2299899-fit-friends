import { Provider } from 'react-redux';
import { withExtraArgument } from 'redux-thunk';

import { Pagination, QueryPagination, Training } from '@2299899-fit-friends/types';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action, createAsyncThunk } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';

import { createApiService } from '../services/api';
import { CatalogItem } from '../storage/types/catalog-item.type';
import { State } from '../storage/types/state.type';
import { AppThunkDispatch } from '../test-mocks/app-thunk-dispatch.type';
import { makeFakeState, makeFakeTraining } from '../test-mocks/test-mocks';
import { useFetchPagination } from './use-fetch-pagination';

describe('Hook useFetchFile', () => {
  const axios = createApiService();
  const middleware = [withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  const mockStore = mockStoreCreator(makeFakeState());
  const wrapper = ({ children }) => (<Provider store={mockStore}>{children}</Provider>);

  test('should return correct values with first page', async () => {
    const mockPagination: Pagination<CatalogItem> = {
      entities: [makeFakeTraining()],
      totalItems: 1,
      totalPages: 1,
      itemsPerPage: 1,
      currentPage: 1,
    };
    const fetch = createAsyncThunk<Pagination<CatalogItem>, QueryPagination, Record<string, unknown>>('mock', async () => mockPagination);

    const renderHookResult = renderHook(() => useFetchPagination(fetch, {}), { wrapper });
    await act(() => renderHookResult.result.current.fetchNextPage());

    expect(renderHookResult.result.current.items).toEqual(mockPagination.entities);
    expect(renderHookResult.result.current.loading).toBe(false);
  });

  test('should return correct values with last page', async () => {
    const mockPagination: Pagination<CatalogItem> = {
      entities: [makeFakeTraining(), makeFakeTraining()],
      totalItems: 2,
      totalPages: 2,
      itemsPerPage: 1,
      currentPage: 1.
    };
    const fetch = createAsyncThunk<Pagination<CatalogItem>, QueryPagination, Record<string, unknown>>('mock', async () => mockPagination);

    const renderHookResult = renderHook(() => useFetchPagination(fetch, {}), { wrapper });
    await act(() => renderHookResult.result.current.fetchNextPage());
    await act(() => renderHookResult.result.current.fetchNextPage());

    expect(renderHookResult.result.current.items).toEqual(mockPagination.entities);
    expect(renderHookResult.result.current.loading).toBe(false);
  });

  test('should return correct values with all pages', async () => {
    const mockData: Training[] = [makeFakeTraining(), makeFakeTraining()];
    const fetch = createAsyncThunk<Pagination<Training>, QueryPagination, Record<string, unknown>>('mock', async ({ page }) => ({
      entities: [mockData[(page ?? 1) - 1]],
      totalItems: 2,
      totalPages: 2,
      itemsPerPage: 1,
      currentPage: page ?? 1,
    }));

    const renderHookResult = renderHook(() => useFetchPagination<Training>(fetch, { limit: 1 }), { wrapper });
    await act(() => renderHookResult.result.current.fetchAll());

    expect(renderHookResult.result.current.items).toEqual(mockData);
    expect(renderHookResult.result.current.loading).toBe(false);
  });

  test('should return correct values with all pages and maxItems', async () => {
    const mockData: Training[] = [makeFakeTraining(), makeFakeTraining()];
    const fetch = createAsyncThunk<Pagination<Training>, QueryPagination, Record<string, unknown>>('mock', async ({ page }) => ({
      entities: [mockData[(page ?? 1) - 1]],
      totalItems: 2,
      totalPages: 2,
      itemsPerPage: 1,
      currentPage: page ?? 1,
    }));

    const renderHookResult = renderHook(() => useFetchPagination<Training>(fetch, { limit: 1 }, 1), { wrapper });
    await act(() => renderHookResult.result.current.fetchAll());

    expect(renderHookResult.result.current.items).toEqual([mockData[0]]);
    expect(renderHookResult.result.current.loading).toBe(false);
  });
});
