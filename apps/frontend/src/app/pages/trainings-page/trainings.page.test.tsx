import '@testing-library/jest-dom';

import { act, render, screen } from '@testing-library/react';

import { withHistory } from '../../test-mocks/test-mocks-components';
import TrainingsPage from './trainings.page';

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

describe('Component TrainingsPage', () => {
  test('should render correctly', async () => {
    await act(async () => render(withHistory(<TrainingsPage />)));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('FormFilterSortCatalog')).toBeInTheDocument();
    expect(screen.queryByText('Каталог тренировок')).toBeInTheDocument();
    expect(screen.queryByText('ExpandingCatalog')).toBeInTheDocument();
  });
});
