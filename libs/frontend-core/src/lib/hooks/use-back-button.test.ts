import { FrontendRoute } from '@2299899-fit-friends/types';
import { faker } from '@faker-js/faker';
import { renderHook } from '@testing-library/react';

import { useBackButton } from './use-back-button';

const mockUseNavigate = jest.fn((value: string | number) => value);
const mockUseLocation = jest.fn(() => ({ key: 'default' }));

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation(),
}));

describe('Hook useBackButton', () => {
  test('should return callback with default path', () => {
    const handleBackButtonClick = renderHook(() => useBackButton());
    handleBackButtonClick.result.current();

    expect(mockUseNavigate).toHaveBeenCalled();
    expect(mockUseNavigate.mock.results[0].value).toBe(`/${FrontendRoute.Main}`);
  });

  test('should return callback with provided path', () => {
    const mockPath = faker.internet.url();

    const handleBackButtonClick = renderHook(() => useBackButton(mockPath));
    handleBackButtonClick.result.current();

    expect(mockUseNavigate).toHaveBeenCalled();
    expect(mockUseNavigate.mock.results[1].value).toBe(mockPath);
  });

  test('should return callback with existed history', () => {
    mockUseLocation.mockImplementationOnce(() => ({ key: 'mock' }))

    const handleBackButtonClick = renderHook(() => useBackButton());
    handleBackButtonClick.result.current();

    expect(mockUseNavigate).toHaveBeenCalled();
    expect(mockUseNavigate.mock.results[2].value).toBe(-1);
  });
});
