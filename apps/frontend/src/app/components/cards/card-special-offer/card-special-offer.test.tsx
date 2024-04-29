import '@testing-library/jest-dom';

import { makeFakeState, makeFakeTraining, makeFakeUser } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardSpecialOffer from './card-special-offer';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardSpecialOffer', () => {
  test('should render correctly', async () => {
    const item = makeFakeTraining();
    const user = makeFakeUser();
    item.userId = user.id ?? '';
    const mockState = makeFakeState();
    const { withStoreComponent } = withStore(
      withHistory(<CardSpecialOffer item={item} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('card-image')).toBeInTheDocument();
    expect(screen.queryByText(item.title)).toBeInTheDocument();
    expect(screen.queryByText('Горячее предложение')).toBeInTheDocument();
  });
});
