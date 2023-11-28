import { downloadDataAsFile, downloadAnchor } from './downloadDataAsFile';

describe('downloadDataAsFile', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    downloadAnchor.click = jest.fn();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('downloads data as file', () => {
    const fileName = 'test.txt';
    const data = new Blob(['test data'], { type: 'text/plain' });
    const url = 'blob:test';

    (URL.createObjectURL as jest.Mock).mockReturnValue(url);

    downloadDataAsFile(fileName, data);

    expect(URL.createObjectURL).toHaveBeenCalledWith(data);
    expect(downloadAnchor.href).toBe(url);
    expect(downloadAnchor.download).toBe(fileName);
    expect(downloadAnchor.click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(url);
  });
});
