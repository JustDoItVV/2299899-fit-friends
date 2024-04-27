import '@testing-library/jest-dom';

import {
    makeFakeOrder, makeFakeState, makeFakeUser, State
} from '@2299899-fit-friends/frontend-core';
import { Order } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardOrders from './card-orders';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardOrders', () => {
  let mockState: State;
  let item: Order;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    item = makeFakeOrder();
    mockState = makeFakeState();
    mockState.APP.currentUser = { ...makeFakeUser() };
    const withStoreResult = withStore(
      withHistory(<CardOrders item={item} />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('card-image')).toBeInTheDocument();
    expect(screen.queryByText(`#${item.training?.type}`)).toBeInTheDocument();
    expect(screen.queryByText(`#${item.training?.calories}ккал`)).toBeInTheDocument();
    expect(screen.queryByText('Куплено тренировок')).toBeInTheDocument();
    expect(screen.queryByText('Общая сумма')).toBeInTheDocument();
    expect(screen.queryByText('Подробнее')).toBeInTheDocument();
  });
});
