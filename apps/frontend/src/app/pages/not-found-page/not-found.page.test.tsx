import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory } from '../../test-mocks/test-mocks-components';
import NotFoundPage from './not-found.page';

describe('Component NotFoundPage', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser() };
  });

  test('should render correctly', async () => {
    await act(async () => render(withHistory(<NotFoundPage />)));

    expect(screen.queryByText('404')).toBeInTheDocument();
    expect(screen.queryByText('Вернуться на главную')).toBeInTheDocument();
  });
});
