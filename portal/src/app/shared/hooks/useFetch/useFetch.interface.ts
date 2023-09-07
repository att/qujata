/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, ResponseType } from 'axios';
import { HttpMethod } from '../../constants/http';
import { FetchDataStatus } from './useFetch.enum';
import { IServerError } from '../../models/server-error.interface';

export interface IHttpRequestOptions extends AxiosRequestConfig {
    numOfRetries?: number;
}
export interface IHttpRequestProps {
    method?: HttpMethod;
    url?: string;
    params?: any;
    data?: any;
    responseType?: ResponseType;
    headers?: AxiosRequestHeaders;
}

export interface IHttpResponseData<T, ERROR_TYPE = IServerError>{
    status: FetchDataStatus;
    data?: T;
    error?: AxiosError<ERROR_TYPE>;
}

export interface IHttp<T, ERROR_TYPE = IServerError> extends IHttpResponseData<T, ERROR_TYPE> {
    get: (getDataProps?: IHttpRequestProps) => void;
    post: (postDataProps?: IHttpRequestProps) => void;
    put: (putDataProps?: IHttpRequestProps) => void;
    patch: (putDataProps?: IHttpRequestProps) => void;
    delete_: (deleteDataProps?: IHttpRequestProps) => void;
    cancelRequest: () => void;
}
