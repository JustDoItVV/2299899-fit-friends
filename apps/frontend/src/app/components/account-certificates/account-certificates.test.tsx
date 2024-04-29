import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    checkAuth, extractActionsTypes, makeFakeState, makeFakeUser, State, updateUser
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, User, UserRole } from '@2299899-fit-friends/types';
import { faker } from '@faker-js/faker';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountCertificates from './account-certificates';

jest.mock('../cards/card-certificate/card-certificate', () => ({
  ...jest.requireActual('../cards/card-certificate/card-certificate'),
  __esModule: true,
  default: jest.fn(() => <div>CardCertificate</div>),
}));
jest.mock('react-slick');

describe('Component CardCertificate', () => {
  let mockState: State;
  let mockUser: User;

  beforeEach(() => {
    mockState = makeFakeState();
    mockUser = makeFakeUser();
    mockUser.certificates = [faker.image.dataUri()];
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...mockUser, role: UserRole.Trainer };
  });

  test('should render correctly', async () => {
    const { withStoreComponent } = withStore(withHistory(
      <AccountCertificates />
    ), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Дипломы и сертификаты')).toBeInTheDocument();
    expect(screen.queryByText('Загрузить')).toBeInTheDocument();
  });

  test('should dispatch "updateUser.pending", "checkAuth.pending", "updateUser.fulfilled", "checkAuth.rejected" when upload input change', async () => {
    const mockData = new Blob();
    global.URL.createObjectURL = jest.fn();
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(withHistory(
      <AccountCertificates />
    ), mockState);
    mockAxiosAdapter.onPost(`${ApiRoute.User}/(.*)`).reply(200, mockData);

    await act(async () => render(withStoreComponent));
    await act(async () => fireEvent.change(screen.getByTestId('account-certificate-input-upload'), { target: { files: ['mock.pdf'] } }));
    const actions = extractActionsTypes(mockStore.getActions());

    expect(actions).toEqual([
      updateUser.pending.type,
      checkAuth.pending.type,
      updateUser.fulfilled.type,
      checkAuth.rejected.type,
    ]);
  });
});
