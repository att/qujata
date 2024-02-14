import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { MutableRefObject, useRef } from 'react';
import { useOutsideClick } from './useOutsideClick';

interface TestComponentProps {
  onClickOutside: () => void
}

describe('useOutsideClick', () => {
  let TestComponent: React.FC<TestComponentProps>;

  beforeEach(() => {
    TestComponent = function Component({ onClickOutside }: TestComponentProps) {
        const innerElementRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
        useOutsideClick(innerElementRef, onClickOutside);
        return <div ref={innerElementRef} data-testid='inside'>Test Component</div>;
      };
  });
  afterEach(cleanup);

  test('should not trigger event when inside element is clicked', () => {
    const onClickOutside: jest.Mock = jest.fn();
    const { getByTestId } = render(<TestComponent onClickOutside={onClickOutside} />);
    const insideElement: HTMLElement = getByTestId('inside');
    act(() => {
      fireEvent.mouseDown(insideElement);
    });
    expect(onClickOutside).toHaveBeenCalledTimes(0);
  });
});
