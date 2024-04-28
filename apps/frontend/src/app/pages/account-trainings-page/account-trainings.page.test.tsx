import '@testing-library/jest-dom';

import { makeFakeState } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountTrainingsPage from './account-trainings.page';

jest.mock('../../components/header/header', () => ({
  ...jest.requireActual('../../components/header/header'),
  __esModule: true,
  default: jest.fn(() => <div>Header</div>),
}));
jest.mock('../../components/forms/form-filter-sort-catalog/form-filter-sort-catalog', () => ({
  ...jest.requireActual('../../components/forms/form-filter-sort-catalog/form-filter-sort-catalog'),
  __esModule: true,
  default: jest.fn(() => <div>FormFilterSortCatalog</div>),
}));
jest.mock('../../components/expanding-catalog/expanding-catalog', () => ({
  ...jest.requireActual('../../components/expanding-catalog/expanding-catalog'),
  __esModule: true,
  default: jest.fn(() => <div>ExpandingCatalog</div>),
}));

describe('Component AccountTrainingsPage', () => {
  test('should render correctly', async () => {
    const mockState = makeFakeState();
    const { withStoreComponent } = withStore(
      withHistory(<AccountTrainingsPage />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('FormFilterSortCatalog')).toBeInTheDocument();
    expect(screen.queryByText('ExpandingCatalog')).toBeInTheDocument();
  });
});
