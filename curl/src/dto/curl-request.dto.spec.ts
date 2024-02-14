import { CurlRequest } from './curl-request.dto';
import { validate } from 'class-validator';

describe('CurlRequest', () => {
  it('should pass validation when all properties are valid', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    curlRequest.iterationsCount = 1000;
    curlRequest.messageSize = 10;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(0);
  });

  it('should fail validation when algorithm is empty', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = '';
    curlRequest.iterationsCount = 1000;
    curlRequest.messageSize = 10;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints.isNotEmpty).toBeDefined();
  });

  it('should fail validation when iterationsCount is not a number', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    curlRequest.iterationsCount = 'not a number' as any;
    curlRequest.messageSize = 10;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints.isNumber).toBeDefined();
  });

  it('should fail validation when iterationsCount is not from the list', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    curlRequest.iterationsCount = -3;
    curlRequest.messageSize = 10;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints).toBeDefined();
  });

  it('should fail validation when messageSize is not a number', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    curlRequest.iterationsCount = 1000;
    curlRequest.messageSize = 'not a number' as any;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints.isNumber).toBeDefined();
  });

  it('should fail validation when messageSize is not from the list', async () => {
    const curlRequest = new CurlRequest();
    curlRequest.algorithm = 'ExampleAlgorithm';
    curlRequest.iterationsCount = 1000;
    curlRequest.messageSize = -3;
    const validationErrors = await validate(curlRequest);
    expect(validationErrors).toHaveLength(1);
    expect(validationErrors[0].constraints).toBeDefined();
  });
});
