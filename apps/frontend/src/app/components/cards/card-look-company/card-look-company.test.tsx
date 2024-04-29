import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardLookCompany from './card-look-company';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardLookCompany', () => {
  test('should render correctly', async () => {
    const item = makeFakeUser();
    const mockState = makeFakeState();
    mockState.APP.currentUser = { ...makeFakeUser() };
    const { withStoreComponent } = withStore(
      withHistory(<CardLookCompany item={item} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(item.name)).toBeInTheDocument();
    expect(screen.queryByText(item.location)).toBeInTheDocument();
    expect(screen.queryByTestId('card-image')).toBeInTheDocument();
    expect(screen.queryByText('Подробнее')).toBeInTheDocument();
  });
});
