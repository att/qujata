import { CurlRequest } from './curl-request.dto';
import { validate } from 'class-validator';
describe('CurlRequest', () => {
  it('should pass validation when all properties are valid', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    curlRequest.iterationsCount = 1000;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(0);
  });
  it('should fail validation when algorithm is empty', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = '';
    curlRequest.iterationsCount = 1000;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints.isNotEmpty).toBeDefined();
  });
  it('should fail validation when iterationsCount is not a number', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    (curlRequest.iterationsCount as any) = 'not a number';
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints.isNumber).toBeDefined();
  });
  it('should fail validation when iterationsCount is less than 500', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    curlRequest.iterationsCount = 499;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints.min).toBeDefined();
  });
  it('should fail validation when iterationsCount is greater than 100000', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    curlRequest.iterationsCount = 100001;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints.max).toBeDefined();
  });
});