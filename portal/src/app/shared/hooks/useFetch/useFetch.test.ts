import { act, renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useFetch } from './useFetch';
import { IHttpRequestOptions } from './useFetch.interface';
import { FetchDataStatus } from './useFetch.enum';

const mockData = [{
  id: 'test',
  name: 'test1',
}];

describe('useFetch', () => {
  test('should get data', async () => {

    const mock = new MockAdapter(axios);
    const requestOptions: IHttpRequestOptions = {
      url: 'http://jsonplaceholder.typicode.com/posts',
    };
    mock.onGet('https://us-central1-hutoma-backend.cloudfunctions.net/chat').reply(200, mockData);
    const { result } = renderHook(() => useFetch(requestOptions));
    act(() => {
      result.current.get({url: 'tests-url'});
    });
    const { status } = result.current;
    await act( () => waitFor(() => {
      expect(status).toBe(FetchDataStatus.Fetching);
    }));

  });

  test('should post data', async () => {
    const mock = new MockAdapter(axios);
    const requestOptions: IHttpRequestOptions = {
      url: 'http://jsonplaceholder.typicode.com/posts',
    };
    mock.onPost('https://us-central1-hutoma-backend.cloudfunctions.net/chat', mockData).reply(200);
    const { result } = renderHook(() => useFetch(requestOptions));
    act(() => {
      result.current.post({data: 'test data'});
    });
    const { status } = result.current;
    await act( () => waitFor(() => {
      expect(status).toBe(FetchDataStatus.Fetching);
    }));
  });

  test('should put data', async () => {
    const mock = new MockAdapter(axios);
    const requestOptions: IHttpRequestOptions = {
      url: 'http://jsonplaceholder.typicode.com/posts',
    };
    mock.onPut('https://us-central1-hutoma-backend.cloudfunctions.net/chat', mockData).reply(200);
    const { result } = renderHook(() => useFetch(requestOptions));
    act(() => {
      result.current.put({data: 'test data'});
    });

    const { status } = result.current;
    await act( () => waitFor(() => {
      expect(status).toBe(FetchDataStatus.Fetching);
    }));
  });

  test('should delete data', async () => {
    const mock = new MockAdapter(axios);
    const requestOptions: IHttpRequestOptions = {
      url: 'http://jsonplaceholder.typicode.com/posts',
    };
    mock.onDelete('https://us-central1-hutoma-backend.cloudfunctions.net/chat', mockData).reply(200);
    const { result } = renderHook(() => useFetch(requestOptions));
    act(() => {
      result.current.delete_();
    });
    const { status } = result.current;
    await act( () => waitFor(() => {
      expect(status).toBe(FetchDataStatus.Fetching);
    }));
  });

  test('should cancel request', async () => {
    const requestOptions: IHttpRequestOptions = {
      url: 'http://jsonplaceholder.typicode.com/posts',
    };
    const { result } = renderHook(() => useFetch(requestOptions));
    act(() => {
      // @ts-ignore
      result.current.cancelRequest();
    });
    const { status } = result.current;
    await act( () => waitFor(() => {
      expect(status).toBe(FetchDataStatus.Canceled);
    }));
  });

  test('should retry get 3 times', async () => {
    const requestOptions: IHttpRequestOptions = {
      url: 'http://jsonplaceholder.typicode.com/posts',
      numOfRetries: 3,
    };
    const { result } = renderHook(() => useFetch(requestOptions));
    act(() => {
      // @ts-ignore
      result.current.get();
    });
    const { status } = result.current;
    await act( () => waitFor(() => {
      expect(status).toBe(FetchDataStatus.Fetching);
    }));
  });
});
