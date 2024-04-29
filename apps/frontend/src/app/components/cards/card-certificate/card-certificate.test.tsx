import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    CatalogItem, checkAuth, extractActionsTypes, makeFakeState, makeFakeUser, State, updateUser
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardCertificate from './card-certificate';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: 'abc' } },
  Outline: null,
  Page: () => <div>page</div>,
  Document: () => <div>page</div>,
}));
jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardCertificate', () => {
  let mockState: State;
  let item: CatalogItem;

  beforeEach(() => {
    item = makeFakeUser();
    mockState = makeFakeState();

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };
  });

  test('should render correctly without change button', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<CardCertificate item={item} path={''} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('card-certificate')).toBeInTheDocument();
    expect(screen.queryByText('Изменить')).not.toBeInTheDocument();
  });

  test('should render correctly with change button', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<CardCertificate item={item} path={''} changeable={true} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('card-certificate')).toBeInTheDocument();
    expect(screen.queryByText('Изменить')).toBeInTheDocument();
  });

  test('should change to editing mode by change button click', async () => {
    const user = userEvent.setup();
    const { withStoreComponent } = withStore(
      withHistory(<CardCertificate item={item} path={''} changeable={true} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Изменить'));

    expect(screen.queryByTestId('card-certificate')).toBeInTheDocument();
    expect(screen.queryByText('Сохранить')).toBeInTheDocument();
  });

  test('should dispatch "updateUser.pending", "checkAuth.pending", "updateUser.fulfilled", "checkAuth.rejected" when save button click', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      withHistory(<CardCertificate item={item} path={''} changeable={true} />),
      mockState,
    );
    const mockData = new Blob();
    global.URL.createObjectURL = jest.fn();
    mockAxiosAdapter.onPost(`${ApiRoute.User}/(.*)${ApiRoute.Certificates}`).reply(200, mockData);

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Изменить'));
    fireEvent.change(screen.getByTestId('change-certificate'), { target: { files: ['mock'] } })
    await user.click(screen.getByText('Сохранить'));
    const actions = extractActionsTypes(mockStore.getActions());

    expect(actions).toEqual([
      updateUser.pending.type,
      checkAuth.pending.type,
      updateUser.fulfilled.type,
      checkAuth.rejected.type,
    ]);
  });
});
