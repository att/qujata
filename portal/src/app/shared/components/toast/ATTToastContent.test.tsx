import { render, screen } from '@testing-library/react';
import { ATTToastContent } from './ATTToastContent';
import { ToastContentProps } from 'react-toastify';

describe('ATTToastContent', () => {
  let props: ToastContentProps<unknown>;
  it('renders title and message', () => {
    render(<ATTToastContent title="Test Title" message="Test Message" {...props} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <ATTToastContent title="Test Title" message="Test Message" {...props} >
        <div>Test Child</div>
      </ATTToastContent>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
