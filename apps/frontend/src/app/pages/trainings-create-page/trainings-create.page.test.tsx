import '@testing-library/jest-dom';

import { act, render, screen } from '@testing-library/react';

import { withHistory } from '../../test-mocks/test-mocks-components';
import TrainingsCreatePage from './trainings-create.page';

jest.mock('../../components/header/header', () => ({
  ...jest.requireActual('../../components/header/header'),
  __esModule: true,
  default: jest.fn(() => <div>Header</div>),
}));
jest.mock('../../components/forms/form-trainings-create/form-trainings-create', () => ({
  ...jest.requireActual('../../components/forms/form-trainings-create/form-trainings-create'),
  __esModule: true,
  default: jest.fn(() => <div>FormTrainingsCreate</div>),
}));

describe('Component TrainingsCreatePage', () => {
  test('should render correctly', async () => {
    await act(async () => render(withHistory(<TrainingsCreatePage />)));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('FormTrainingsCreate')).toBeInTheDocument();
  });
});
