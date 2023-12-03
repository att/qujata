import { act, render, screen } from '@testing-library/react';
import { SpinnerProviderWrapper } from './SpinnerProviderWrapper';
import { SpinnerContext } from './spinner.context';

describe('SpinnerProviderWrapper', () => {
  it('renders children', () => {
    render(
      <SpinnerProviderWrapper>
        <div>Test Child</div>
      </SpinnerProviderWrapper>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('updates isSpinnerOn when setSpinner is called', () => {
    let contextValue: any;
    render(
      <SpinnerProviderWrapper>
        <SpinnerContext.Consumer>
          {value => {
            contextValue = value;
            return null;
          }}
        </SpinnerContext.Consumer>
      </SpinnerProviderWrapper>
    );

    expect(contextValue.isSpinnerOn).toBe(false);

    act(() => {
      contextValue.setSpinner(true);
    });

    expect(contextValue.isSpinnerOn).toBe(true);
  });
});
