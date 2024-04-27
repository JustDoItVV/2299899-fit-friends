import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { User } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardLookCompany from './card-look-company';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardLookCompany', () => {
  let mockState: State;
  let item: User;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    item = makeFakeUser();
    mockState = makeFakeState();
    mockState.APP.currentUser = { ...makeFakeUser() };
    const withStoreResult = withStore(
      withHistory(<CardLookCompany item={item} />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(item.name)).toBeInTheDocument();
    expect(screen.queryByText(item.location)).toBeInTheDocument();
    expect(screen.queryByTestId('card-image')).toBeInTheDocument();
    expect(screen.queryByText('Подробнее')).toBeInTheDocument();
  });
});
