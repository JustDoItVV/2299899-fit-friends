import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    addFriend, createRequest, deleteFriend, extractActionsTypes, makeFakeState, makeFakeUser, State,
    subscribeToTrainer, unsubscribeFromTrainer
} from '@2299899-fit-friends/frontend-core';
import { User, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardUserInfo from './card-user-info';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));
jest.mock('../../popups/popup-user-map/popup-user-map', () => ({
  ...jest.requireActual('../../popups/popup-user-map/popup-user-map'),
  __esModule: true,
  default: jest.fn(() => <div>PopupUserMap</div>),
}));
jest.mock('../../popups/popup-certificates/popup-certificates', () => ({
  ...jest.requireActual('../../popups/popup-certificates/popup-certificates'),
  __esModule: true,
  default: jest.fn(() => <div>PopupCertificates</div>),
}));
jest.mock('../card-training/card-training', () => ({
  ...jest.requireActual('../card-training/card-training'),
  __esModule: true,
  default: jest.fn(() => <div>CardTraining</div>),
}));
jest.mock('../../slider-block/slider-block', () => ({
  ...jest.requireActual('../../slider-block/slider-block'),
  __esModule: true,
  default: jest.fn(() => <div>SliderBlock</div>),
}));

describe('Component CardTrainingInfo', () => {
  let mockState: State;
  let mockCurrentUser: User;
  let mockUser: User;

  beforeEach(() => {
    mockState = makeFakeState();
    mockCurrentUser = makeFakeUser();
    mockUser = makeFakeUser();
  });

  test('should render correctly with current user role User', async () => {
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    mockState.USER.user = { ...mockUser, role: UserRole.Trainer };
    const { withStoreComponent } = withStore(
      withHistory(<CardUserInfo />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Карточка пользователя')).toBeInTheDocument();
    expect(screen.queryByText(mockUser.name)).toBeInTheDocument();
    expect(screen.queryByText('PopupUserMap')).toBeInTheDocument();
    expect(screen.queryAllByTestId('card-avatar').length).toBe(2);
    if (mockUser.role === UserRole.Trainer) {
      expect(screen.queryByText('Тренер')).toBeInTheDocument();
      expect(screen.queryByText('PopupCertificates')).toBeInTheDocument();
      expect(screen.queryByText('SliderBlock')).toBeInTheDocument();
      expect(screen.queryByText('Хочу персональную тренировку')).toBeInTheDocument();
      expect(screen.queryByText('Получать уведомление на почту о новой тренировке')).toBeInTheDocument();
    }
  });

  test('should dispatch "addFriend.pending", "addFriend.fulfilled" when add friend button click', async () => {
    const user = userEvent.setup();
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User, friends: [] };
    mockState.USER.user = { ...mockUser, role: UserRole.Trainer, friends: [] };
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      withHistory(<CardUserInfo />),
      mockState,
    );
    mockAxiosAdapter.onPost(new RegExp(`${ApiRoute.User}/(.*)${ApiRoute.Friend}`))
      .reply(200, { ...mockUser, friends: [mockCurrentUser.id] });

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Добавить в друзья'));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      addFriend.pending.type,
      addFriend.fulfilled.type,
    ]);
  });

  test('should dispatch "deleteFriend.pending", "deleteFriend.fulfilled" when delete friend button click', async () => {
    const user = userEvent.setup();
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User, friends: [mockUser.id ?? ''] };
    mockState.USER.user = { ...mockUser, role: UserRole.Trainer, friends: [mockCurrentUser.id ?? ''] };
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      withHistory(<CardUserInfo />),
      mockState,
    );
    mockAxiosAdapter.onDelete(new RegExp(`${ApiRoute.User}/(.*)${ApiRoute.Friend}`))
      .reply(200, { ...mockUser, friends: [] });

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Удалить из друзей'));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      deleteFriend.pending.type,
      deleteFriend.fulfilled.type,
    ]);
  });

  test('should dispatch "subscribeToTrainer.pending", "subscribeToTrainer.fulfilled" when subscribe checkbox tick', async () => {
    const user = userEvent.setup();
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User, emailSubscribtions: [] };
    mockState.USER.user = { ...mockUser, role: UserRole.Trainer, subscribers: [] };
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      withHistory(<CardUserInfo />),
      mockState,
    );
    mockAxiosAdapter.onPost(new RegExp(`${ApiRoute.User}/(.*)${ApiRoute.Subscribe}`))
      .reply(200, { ...mockUser, emailSubscribtions: [mockUser.id] });

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByTestId('card-user-info-checkbox-subscribe'));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      subscribeToTrainer.pending.type,
      subscribeToTrainer.fulfilled.type,
    ]);
  });

  test('should dispatch "unsubscribeFromTrainer.pending", "unsubscribeFromTrainer.fulfilled" when unsubscribe checkbox tick', async () => {
    const user = userEvent.setup();
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User, emailSubscribtions: [mockUser.id ?? ''] };
    mockState.USER.user = { ...mockUser, role: UserRole.Trainer, subscribers: [mockCurrentUser.id ?? ''] };
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      withHistory(<CardUserInfo />),
      mockState,
    );
    mockAxiosAdapter.onDelete(new RegExp(`${ApiRoute.User}/(.*)${ApiRoute.Subscribe}`))
      .reply(200, { ...mockUser, emailSubscribtions: [mockUser.id] });

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByTestId('card-user-info-checkbox-subscribe'));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      unsubscribeFromTrainer.pending.type,
      unsubscribeFromTrainer.fulfilled.type,
    ]);
  });

  test('should dispatch "createRequest.pending", "createRequest.fulfilled" when want personal training button click', async () => {
    const user = userEvent.setup();
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User, friends: [mockUser.id ?? ''] };
    mockState.USER.user = { ...mockUser, role: UserRole.Trainer, friends: [mockCurrentUser.id ?? ''], isReadyToPersonal: true };
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      withHistory(<CardUserInfo />),
      mockState,
    );
    mockAxiosAdapter.onPost(ApiRoute.TrainingRequest).reply(200);

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Хочу персональную тренировку'));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      createRequest.pending.type,
      createRequest.fulfilled.type,
    ]);
  });
});
