import '@testing-library/jest-dom';

import { makeFakeState, makeFakeTraining } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardTraining from './card-training';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component CardTraining', () => {
  test('should render correctly', async () => {
    const item = makeFakeTraining();
    const mockState = makeFakeState();
    const { withStoreComponent } = withStore(
      withHistory(<CardTraining item={item} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('card-image')).toBeInTheDocument();
    expect(screen.queryByText(item.title)).toBeInTheDocument();
    expect(screen.queryByText(`#${item.type}`)).toBeInTheDocument();
    expect(screen.queryByText(`#${item.calories}ккал`)).toBeInTheDocument();
    expect(screen.queryByText(item.description)).toBeInTheDocument();
    expect(screen.queryByText('Подробнее')).toBeInTheDocument();
    expect(screen.queryByText('Отзывы')).toBeInTheDocument();
  });
});
