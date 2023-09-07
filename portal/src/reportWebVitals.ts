import { ReportHandler } from 'web-vitals';

const reportWebVitals: () => void = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // eslint-disable-next-line @typescript-eslint/typedef
    import('web-vitals').then(({
      getCLS, getFID, getFCP, getLCP, getTTFB,
    }): void => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
