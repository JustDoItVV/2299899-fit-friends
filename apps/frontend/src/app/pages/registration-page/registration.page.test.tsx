import '@testing-library/jest-dom';

import { makeFakeState, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import RegistrationPage from './registration.page';

describe('Component RegistrationPage', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<RegistrationPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;

    mockState.APP.authStatus = AuthStatus.NoAuth;
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Регистрация')).toBeInTheDocument();
  });
});
