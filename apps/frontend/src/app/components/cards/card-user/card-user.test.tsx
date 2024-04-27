import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardUser from './card-user';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardUser', () => {
  test('should render correctly', async () => {
    const item = makeFakeUser();
    const mockState = makeFakeState();
    const { withStoreComponent } = withStore(
      withHistory(<CardUser item={item} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('card-image')).toBeInTheDocument();
    expect(screen.queryByText(item.name)).toBeInTheDocument();
    expect(screen.queryByText(item.location)).toBeInTheDocument();
    expect(screen.queryByText('Подробнее')).toBeInTheDocument();
  });
});
