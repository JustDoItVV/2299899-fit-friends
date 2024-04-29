import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountPage from './account.page';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: 'abc' } },
  Outline: null,
  Page: () => <div>page</div>,
  Document: () => <div>page</div>,
}));
jest.mock('../../components/header/header', () => ({
  ...jest.requireActual('../../components/header/header'),
  __esModule: true,
  default: jest.fn(() => <div>Header</div>),
}));
jest.mock('../../components/account-about/account-about', () => ({
  ...jest.requireActual('../../components/account-about/account-about'),
  __esModule: true,
  default: jest.fn(() => <div>AccountAbout</div>),
}));
jest.mock('../../components/account-certificates/account-certificates', () => ({
  ...jest.requireActual('../../components/account-certificates/account-certificates'),
  __esModule: true,
  default: jest.fn(() => <div>AccountCertificates</div>),
}));
jest.mock('../../components/account-panel-trainer/account-panel-trainer', () => ({
  ...jest.requireActual('../../components/account-panel-trainer/account-panel-trainer'),
  __esModule: true,
  default: jest.fn(() => <div>AccountPanelTrainer</div>),
}));
jest.mock('../../components/account-panel-user/account-panel-user', () => ({
  ...jest.requireActual('../../components/account-panel-user/account-panel-user'),
  __esModule: true,
  default: jest.fn(() => <div>AccountPanelUser</div>),
}));
jest.mock('../../components/account-user-schedule/account-user-schedule', () => ({
  ...jest.requireActual('../../components/account-user-schedule/account-user-schedule'),
  __esModule: true,
  default: jest.fn(() => <div>AccountUserSchedule</div>),
}));

describe('Component AccountPage', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<AccountPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;

    mockState.APP.authStatus = AuthStatus.Auth;
  });

  test('should render correctly with role Trainer', async () => {
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('Личный кабинет')).toBeInTheDocument();
    expect(screen.queryByText('AccountAbout')).toBeInTheDocument();
    expect(screen.queryByText('AccountCertificates')).toBeInTheDocument();
    expect(screen.queryByText('AccountPanelTrainer')).toBeInTheDocument();
    expect(screen.queryByText('AccountPanelUser')).not.toBeInTheDocument();
    expect(screen.queryByText('AccountUserSchedule')).not.toBeInTheDocument();
  });

  test('should render correctly with role User', async () => {
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('Личный кабинет')).toBeInTheDocument();
    expect(screen.queryByText('AccountAbout')).toBeInTheDocument();
    expect(screen.queryByText('AccountCertificates')).not.toBeInTheDocument();
    expect(screen.queryByText('AccountPanelTrainer')).not.toBeInTheDocument();
    expect(screen.queryByText('AccountPanelUser')).toBeInTheDocument();
    expect(screen.queryByText('AccountUserSchedule')).toBeInTheDocument();
  });
});
