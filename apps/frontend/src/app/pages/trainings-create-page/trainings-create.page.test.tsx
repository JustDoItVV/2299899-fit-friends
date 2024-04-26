import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import TrainingsCreatePage from './trainings-create.page';

describe('Component TrainingsCreatePage', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<TrainingsCreatePage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Создание тренировки')).toBeInTheDocument();
  });
});
