import '@testing-library/jest-dom';

import { act, render, screen } from '@testing-library/react';

import { withHistory } from '../../test-mocks/test-mocks-components';
import RegistrationPage from './registration.page';

jest.mock('../../components/forms/form-registration/form-registration', () => ({
  ...jest.requireActual('../../components/forms/form-registration/form-registration'),
  __esModule: true,
  default: jest.fn(() => <div>RegistrationForm</div>),
}));

describe('Component RegistrationPage', () => {
  test('should render correctly', async () => {
    await act(async () => render(withHistory(<RegistrationPage />)));

    expect(screen.queryByText('Регистрация')).toBeInTheDocument();
    expect(screen.queryByText('RegistrationForm')).toBeInTheDocument();
  });
});
