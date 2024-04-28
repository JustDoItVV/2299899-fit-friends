import '@testing-library/jest-dom';

import { makeFakeState, makeFakeTraining, State } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import {
    makeMockFetchCatalog, MockCardComponent, withHistory, withStore
} from '../../test-mocks/test-mocks-components';
import SliderBlock from './slider-block';

jest.mock('../cards/card-placeholder/card-placeholder', () => ({
  ...jest.requireActual('../cards/card-placeholder/card-placeholder'),
  __esModule: true,
  default: jest.fn(() => <div>CardPlaceholder</div>),
}));
jest.mock('../loading/loading', () => ({
  ...jest.requireActual('../loading/loading'),
  __esModule: true,
  default: jest.fn(() => <div>Loading</div>),
}));

describe('Component SliderBlock', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
  });

  test('should render correctly', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [makeFakeTraining(), makeFakeTraining()], totalItems: 2, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('CardPlaceholder')).not.toBeInTheDocument();
    expect(screen.getByTestId('slider-block-list').firstChild?.firstChild?.childNodes.length).toBe(1);
  });

  test('should render correctly with empty fetch response', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [], totalItems: 0, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('CardPlaceholder')).toBeInTheDocument();
  });

  test('should render with title', async () => {
    const mockTitle = 'mockTitle';
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [makeFakeTraining(), makeFakeTraining()], totalItems: 2, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
        title={mockTitle}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(mockTitle)).toBeInTheDocument();
  });

  test('should render with hidden title', async () => {
    const mockTitle = 'mockTitle';
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [makeFakeTraining(), makeFakeTraining()], totalItems: 2, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
        title={mockTitle}
        showTitle={false}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText(mockTitle).className.includes('visually-hidden')).toBeTruthy();
  });

  test('should render with provided classNamePrefix', async () => {
    const mockClassName = 'mockClassName';
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [makeFakeTraining(), makeFakeTraining()], totalItems: 2, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
        classNamePrefix={mockClassName}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId(`slider-block-${mockClassName}`)).toBeInTheDocument();
    expect(screen.getByTestId(`slider-block-${mockClassName}`).className.includes(`${mockClassName}__wrapper`)).toBeTruthy();
  });

  test('should render with provided header addition element', async () => {
    const expectedText = 'expectedText';
    const expectedComponent = <span>{expectedText}</span>;
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [makeFakeTraining(), makeFakeTraining()], totalItems: 2, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
        headerAdditionalElement={expectedComponent}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
  });

  test('should render with provided max items', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [makeFakeTraining(), makeFakeTraining()], totalItems: 2, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
        itemsPerPage={2}
        maxItems={1}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('CardPlaceholder')).not.toBeInTheDocument();
    expect(screen.getByTestId('slider-block-list').firstChild?.firstChild?.childNodes.length).toBe(1);
  });

  test('should render with controls', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [makeFakeTraining(), makeFakeTraining()], totalItems: 2, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
        controls={true}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('slider-block-controls')).toBeInTheDocument();
  });

  test('should render with provided children', async () => {
    const expectedText = 'expectedText';
    const expectedComponent = <span>{expectedText}</span>;
    const { withStoreComponent } = withStore(
      withHistory(<SliderBlock
        fetch={makeMockFetchCatalog({ entities: [makeFakeTraining(), makeFakeTraining()], totalItems: 2, totalPages: 1, itemsPerPage: 50, currentPage: 1 })}
        query={{}}
        component={MockCardComponent}
        children={expectedComponent}
      />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
  });
});
