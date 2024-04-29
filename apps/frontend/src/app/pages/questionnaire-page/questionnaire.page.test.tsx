import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import QuestionnairePage from './questionnaire.page';

jest.mock('../../components/forms/form-questionnaire-trainer/form-questionnaire-trainer', () => ({
  ...jest.requireActual('../../components/forms/form-questionnaire-trainer/form-questionnaire-trainer'),
  __esModule: true,
  default: jest.fn(() => <div>FormQuestionnaireTrainer</div>),
}));
jest.mock('../../components/forms/form-questionnaire-user/form-questionnaire-user', () => ({
  ...jest.requireActual('../../components/forms/form-questionnaire-user/form-questionnaire-user'),
  __esModule: true,
  default: jest.fn(() => <div>FormQuestionnaireUser</div>),
}));

describe('Component QuestionnairePage', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
    mockState.APP.authStatus = AuthStatus.Auth;
  });

  test('should render correctly for role user', async () => {
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };
    const { withStoreComponent } = withStore(
      withHistory(<QuestionnairePage />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('FormQuestionnaireUser')).toBeInTheDocument();
  });

  test('should render correctly for role trainer', async () => {
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };
    const { withStoreComponent } = withStore(
      withHistory(<QuestionnairePage />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('FormQuestionnaireTrainer')).toBeInTheDocument();
  });
});
