import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { makeFakeReview, makeFakeState, makeFakeUser } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardReview from './card-review';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardReview', () => {
  test('should render correctly', async () => {
    const item = makeFakeReview();
    const user = makeFakeUser();
    item.userId = user.id ?? '';
    const mockState = makeFakeState();
    mockState.APP.currentUser = { ...makeFakeUser() };
    const { withStoreComponent, mockAxiosAdapter } = withStore(
      withHistory(<CardReview item={item} />),
      mockState,
    );
    mockAxiosAdapter.onGet(`${ApiRoute.User}/${user.id}`).reply(200, user);

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('card-image')).toBeInTheDocument();
    expect(screen.queryByText(user.name)).toBeInTheDocument();
    expect(screen.queryByText(item.rating)).toBeInTheDocument();
    expect(screen.queryByText(item.text)).toBeInTheDocument();
  });
});
