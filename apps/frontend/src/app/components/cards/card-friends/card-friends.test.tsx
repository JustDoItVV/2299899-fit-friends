import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    createRequest, extractActionsTypes, makeFakeRequest, makeFakeState, makeFakeUser, State,
    updateRequest
} from '@2299899-fit-friends/frontend-core';
import { TrainingRequestStatus, User, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardFriends from './card-friends';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardFriends', () => {
  let mockState: State;
  let item: User;

  beforeEach(() => {
    item = makeFakeUser();
    mockState = makeFakeState();
    mockState.APP.currentUser = { ...makeFakeUser() };
  });

  test('should render correctly', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<CardFriends item={item} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(item.name)).toBeInTheDocument();
    expect(screen.queryByText(item.location)).toBeInTheDocument();
    expect(screen.queryByTestId('card-image')).toBeInTheDocument();
  });

  test('should render correctly with request accepted', async () => {
    const mockRequest = makeFakeRequest();
    const mockCurrentUser = makeFakeUser();
    mockRequest.authorId = mockCurrentUser.id ?? '';
    mockRequest.targetId = item.id ?? '';
    mockRequest.status = TrainingRequestStatus.Accepted;
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    item.role = UserRole.User;
    const { withStoreComponent } = withStore(
      withHistory(<CardFriends item={item} additionalData={{ requests: [mockRequest] }} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Запрос на совместную тренировку принят')).toBeInTheDocument();
  });

  test('should render correctly with request rejected', async () => {
    const mockRequest = makeFakeRequest();
    const mockCurrentUser = makeFakeUser();
    mockRequest.authorId = mockCurrentUser.id ?? '';
    mockRequest.targetId = item.id ?? '';
    mockRequest.status = TrainingRequestStatus.Rejected;
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    item.role = UserRole.Trainer;
    const { withStoreComponent } = withStore(
      withHistory(<CardFriends item={item} additionalData={{ requests: [mockRequest] }} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Запрос на персональную тренировку отклонён')).toBeInTheDocument();
  });

  test('should render correctly with accept reject buttons', async () => {
    const mockRequest = makeFakeRequest();
    const mockCurrentUser = makeFakeUser();
    mockRequest.targetId = mockCurrentUser.id ?? '';
    mockRequest.authorId = item.id ?? '';
    mockRequest.status = TrainingRequestStatus.Consideration;
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    item.role = UserRole.Trainer;
    const { withStoreComponent } = withStore(
      withHistory(<CardFriends item={item} additionalData={{ requests: [mockRequest] }} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Запрос на персональную тренировку')).toBeInTheDocument();
    expect(screen.queryByText('Принять')).toBeInTheDocument();
    expect(screen.queryByText('Отклонить')).toBeInTheDocument();
  });

  test('should dispatch "updateRequest.pending", "updateRequest.fulfilled" when accept button click', async () => {
    const mockRequest = makeFakeRequest();
    const mockCurrentUser = makeFakeUser();
    mockRequest.targetId = mockCurrentUser.id ?? '';
    mockRequest.authorId = item.id ?? '';
    mockRequest.status = TrainingRequestStatus.Consideration;
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    item.role = UserRole.Trainer;
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(
      withHistory(<CardFriends item={item} additionalData={{ requests: [mockRequest] }} />),
      mockState,
    );
    mockAxiosAdapter.onPatch(new RegExp(`${ApiRoute.TrainingRequest}/(.*)`)).reply(200);

    await act(async () => render(withStoreComponent));
    await userEvent.click(screen.getByText('Принять'));
    const emittedActions = mockStore.getActions();
    const actions = extractActionsTypes(emittedActions);

    expect(actions).toEqual([
      updateRequest.pending.type,
      updateRequest.fulfilled.type,
    ]);
    expect(screen.queryByText('Запрос на персональную тренировку принят')).toBeInTheDocument();
  });

  test('should dispatch "updateRequest.pending", "updateRequest.fulfilled" when reject button click', async () => {
    const mockRequest = makeFakeRequest();
    const mockCurrentUser = makeFakeUser();
    mockRequest.targetId = mockCurrentUser.id ?? '';
    mockRequest.authorId = item.id ?? '';
    mockRequest.status = TrainingRequestStatus.Consideration;
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    item.role = UserRole.Trainer;
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(
      withHistory(<CardFriends item={item} additionalData={{ requests: [mockRequest] }} />),
      mockState,
    );
    mockAxiosAdapter.onPatch(new RegExp(`${ApiRoute.TrainingRequest}/(.*)`)).reply(200);

    await act(async () => render(withStoreComponent));
    await userEvent.click(screen.getByText('Отклонить'));
    const emittedActions = mockStore.getActions();
    const actions = extractActionsTypes(emittedActions);

    expect(actions).toEqual([
      updateRequest.pending.type,
      updateRequest.fulfilled.type,
    ]);
    expect(screen.queryByText('Запрос на персональную тренировку отклонён')).toBeInTheDocument();
  });

  test('should dispatch "createRequest.pending", "createRequest.fulfilled" when invite button click', async () => {
    const mockRequest = makeFakeRequest();
    const mockCurrentUser = makeFakeUser();
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    item.role = UserRole.User;
    item.isReadyToTraining = true;
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(
      withHistory(<CardFriends item={item} additionalData={{ requests: [mockRequest] }} />),
      mockState,
    );
    mockAxiosAdapter.onPost(ApiRoute.TrainingRequest).reply(200);

    await act(async () => render(withStoreComponent));
    await userEvent.click(screen.getByTestId('invite-training-button'));
    const emittedActions = mockStore.getActions();
    const actions = extractActionsTypes(emittedActions);

    expect(actions).toEqual([
      createRequest.pending.type,
      createRequest.fulfilled.type,
    ]);
    expect(screen.queryByText('Запрос на совместную тренировку отправлен')).toBeInTheDocument();
  });
});
