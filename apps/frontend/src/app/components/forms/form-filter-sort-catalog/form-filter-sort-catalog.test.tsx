import '@testing-library/jest-dom';

import { makeFakeState } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import FormFilterSortCatalog from './form-filter-sort-catalog';

describe('Component FormFilterSortCatalog', () => {
  const classNamePrefix = 'mock';
  const mockState = makeFakeState();

  test('should render correctly with empty filters', async () => {
    const { withStoreComponent } = withStore(
      withHistory(
        <FormFilterSortCatalog
          classNamePrefix={classNamePrefix}
          filters={{}}
          sorters={{}}
          setQuery={jest.fn()}
        />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByRole('button')?.className.includes(`${classNamePrefix}-form__btnback`)).toBeTruthy();
    expect(screen.queryByText('Назад')).toBeInTheDocument();
    expect(screen.queryByText('фильтры')).not.toBeInTheDocument();
  });

  test('should render correctly with filters and empty sorters', async () => {
    const { withStoreComponent } = withStore(
      withHistory(
        <FormFilterSortCatalog
          classNamePrefix={classNamePrefix}
          filters={{
            price: true,
            calories: true,
            rating: true,
            location: true,
            type: true,
            specialization: true,
            level: true,
            duration: true,
          }}
          sorters={{}}
          setQuery={jest.fn()}
        />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('фильтры')).toBeInTheDocument();
    expect(screen.getByTestId('form-filters').children.length).toBe(8);
    expect(screen.queryByText('Сортировка')).not.toBeInTheDocument();
  });

  test('should render correctly with filters and sorters', async () => {
    const { withStoreComponent } = withStore(
      withHistory(
        <FormFilterSortCatalog
          classNamePrefix={classNamePrefix}
          filters={{
            price: true,
          }}
          sorters={{
            price: true,
            role: true,
          }}
          setQuery={jest.fn()}
        />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('фильтры')).toBeInTheDocument();
    expect(screen.getByTestId('form-filters').children.length).toBe(2);
    expect(screen.queryByText('Сортировка')).toBeInTheDocument();
    expect(screen.getByTestId('form-sorters').children.length).toBe(3);
  });
});
