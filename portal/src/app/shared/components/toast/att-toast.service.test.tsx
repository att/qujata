import { toast } from 'react-toastify';
import { attToast } from './att-toast.service';

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
});
