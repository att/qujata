import { EXPERIMENT_EN } from '../translate/en';
import { handleSectionScrolling } from './sections-scrolling.utils';
import { renderHook } from '@testing-library/react-hooks';

describe('sections-scrolling utils', () => {
  let observe: jest.Mock;
  let unobserve: jest.Mock;
  let mockRef: { current: HTMLDivElement | null };

  beforeEach(() => {
    observe = jest.fn();
    unobserve = jest.fn();

    global.IntersectionObserver = class IntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];
      disconnect: () => void = jest.fn();
      observe: (target: Element) => void = observe;
      unobserve: (target: Element) => void = unobserve;
      takeRecords: () => IntersectionObserverEntry[] = jest.fn();
    };

    global.IntersectionObserver = jest.fn(() => ({
      root: null,
      rootMargin: '',
      thresholds: [],
      disconnect: jest.fn(),
      observe,
      unobserve,
      takeRecords: jest.fn()
    }));

    mockRef = { current: document.createElement('div') };
  });

  it('should observe sections on mount', () => {
    renderHook(() => handleSectionScrolling(mockRef, mockRef, jest.fn()));
    expect(observe).toHaveBeenCalledTimes(2);
  });

  // it('should unobserve sections on unmount', () => {
  //   const { unmount } = renderHook(() => handleSectionScrolling(mockRef, mockRef, jest.fn()));
  //   unmount();
  //   expect(unobserve).toHaveBeenCalledTimes(2);
  // });

  it('should set current section when intersecting', () => {
    let callback: IntersectionObserverCallback | undefined;
    global.IntersectionObserver = jest.fn((cb) => {
      callback = cb;
      return { root: null, rootMargin: '', thresholds: [], disconnect: jest.fn(), observe: jest.fn(), unobserve: jest.fn(), takeRecords: jest.fn() };
    });

    const setCurrentSection = jest.fn();
    renderHook(() => handleSectionScrolling(mockRef, mockRef, setCurrentSection));
    if (callback)
      callback([{ isIntersecting: true, target: { id: EXPERIMENT_EN.TITLES.RESULTS_DATA } } as any], {} as IntersectionObserver);
    expect(setCurrentSection).toHaveBeenCalledWith(EXPERIMENT_EN.TITLES.RESULTS_DATA);
  });
});
