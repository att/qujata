import { toast } from 'react-toastify';
import { render } from '@testing-library/react';
import { attToast } from './att-toast.service';
import { ATTToastContent } from './ATTToastContent';

jest.mock('react-toastify');

describe('ATTToastService', () => {
  let errorSpy: jest.SpyInstance;
  let successSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;
  let warningSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(toast, 'error');
    successSpy = jest.spyOn(toast, 'success');
    infoSpy = jest.spyOn(toast, 'info');
    warningSpy = jest.spyOn(toast, 'warning');
  });

  afterEach(() => {
    errorSpy.mockRestore();
    successSpy.mockRestore();
    infoSpy.mockRestore();
    warningSpy.mockRestore();
  });

  it('calls toast.error with correct arguments', () => {
    const message = 'Test Message';
    const title = 'Test Title';

    attToast.error(message, title, {});

    expect(errorSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Object));
  });

  it('calls toast.success with correct arguments', () => {
    const message = 'Test Message';
    const title = 'Test Title';

    attToast.success(message, title, {});

    expect(successSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Object));
  });


  it('calls toast.info with correct arguments', () => {
    const message = 'Test Message';
    const title = 'Test Title';

    attToast.info(message, title, {});

    expect(infoSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Object));
  });


  it('calls toast.warning with correct arguments', () => {
    const message = 'Test Message';
    const title = 'Test Title';

    attToast.warning(message, title, {});

    expect(warningSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Object));
  });

  test('renders with props and children', () => {
    const props = { prop1: 'value1', prop2: 'value2' };
    const basicProps = { basicProp1: 'basicValue1', basicProp2: 'basicValue2' };
    const children = 'Test Children';

    const { getByText, container } = render(<ATTToastContent {...props} {...basicProps}>{children}</ATTToastContent>);
    expect(getByText(children)).toBeInTheDocument();
    expect(container.firstChild).toBeTruthy();
  });
});
