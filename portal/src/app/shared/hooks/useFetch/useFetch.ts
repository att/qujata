import { Dispatch, MutableRefObject, useCallback, useRef, useState } from 'react';
import { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';

import { FetchDataStatus } from './useFetch.enum';
import { IHttp, IHttpResponseData, IHttpRequestOptions, IHttpRequestProps } from './useFetch.interface';
import { IServerError } from '../../models/server-error.interface';
import { HttpMethod } from '../../constants/http';
import axios from '../../middlewares/axiosMiddleware';

export function useFetch<T, ERROR_TYPE = IServerError>(fetchDataProps: AxiosRequestConfig): IHttp<T, ERROR_TYPE> {
  // eslint-disable-next-line max-len
  const [response, setResponse]: [IHttpResponseData<T, ERROR_TYPE>, Dispatch<IHttpResponseData<T, ERROR_TYPE>>] = useState<IHttpResponseData<T, ERROR_TYPE>>({ status: FetchDataStatus.Init });
  const cancelSourcesRef: MutableRefObject<CancelTokenSource[]> = useRef([]);

  const handleSuccess: (data: T) => void = (data: T) => {
    setResponse({ status: FetchDataStatus.Success, data });
  };

  const handleError: (error: AxiosError<ERROR_TYPE>) => void = (error: AxiosError<ERROR_TYPE>) => {
    if (axios.isCancel(error)) {
      setResponse({ status: FetchDataStatus.Canceled });
    } else {
      setResponse({ status: FetchDataStatus.Error, error });
    }
  };

  async function callHttpRequest(requestProps: IHttpRequestProps) {
    // @TODO - check if response data set to empty
    setResponse({ status: FetchDataStatus.Fetching });
    const requestOptions: IHttpRequestOptions = prepareHttpRequestOptions(requestProps);

    let res: AxiosResponse<T> | undefined;

    try {
      res = (await axios(requestOptions)) as AxiosResponse<T>;
    } catch (error) {
      handleError(error as AxiosError<ERROR_TYPE>);
    }

    if (res) {
      handleSuccess(res.data);
    }
  }

  function prepareHttpRequestOptions(requestProps: IHttpRequestProps): IHttpRequestOptions {
    // axios source is used so we can have the option to cancel request at any time using cancelRequest method
    const source: CancelTokenSource = axios.CancelToken.source();
    cancelSourcesRef.current.push(source);
    const url: string = (fetchDataProps.url || '') + (requestProps.url || '');
    const options: IHttpRequestOptions = {
      url,
      method: requestProps.method,
      data: requestProps.data as Record<string, unknown>,
      params: requestProps.params as Record<string, string>,
      cancelToken: source.token,
      responseType: requestProps.responseType || axios.defaults.responseType,
      timeout: 840000,
    };

    return options;
  }

  const get: (requestProps?: IHttpRequestProps) => void = useCallback((requestProps?: IHttpRequestProps) => {
    callHttpRequest({ ...requestProps, method: HttpMethod.GET });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const post: (requestProps?: IHttpRequestProps) => void = useCallback((requestProps?: IHttpRequestProps) => {
    callHttpRequest({ ...requestProps, method: HttpMethod.POST });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const put: (requestProps?: IHttpRequestProps) => void = useCallback((requestProps?: IHttpRequestProps) => {
    callHttpRequest({ ...requestProps, method: HttpMethod.PUT });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch: (requestProps?: IHttpRequestProps) => void = useCallback((requestProps?: IHttpRequestProps) => {
    callHttpRequest({ ...requestProps, method: HttpMethod.PATCH });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* eslint-disable-next-line no-underscore-dangle */ // need this since "delete" is a reserved word
  const delete_: (requestProps?: IHttpRequestProps) => void = useCallback((requestProps?: IHttpRequestProps) => {
    callHttpRequest({ ...requestProps, method: HttpMethod.DELETE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelRequest: () => void = useCallback(() => {
    cancelSourcesRef.current.forEach((source: CancelTokenSource) => source.cancel());
    cancelSourcesRef.current = [];
    setResponse({ status: FetchDataStatus.Canceled });
  }, []);

  return { ...response, get, post, put, patch, delete_, cancelRequest } as IHttp<T, ERROR_TYPE>;
}
