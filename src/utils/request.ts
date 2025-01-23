/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

interface RequestConfig extends AxiosRequestConfig {}

export interface Response<T = any> extends AxiosResponse<T> {}

export interface RequestError extends AxiosError {}

export class Request {
  constructor(private request = axios) {}

  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config)
  }

  public static isRequestError(err: AxiosError): boolean {
    return !!(err.response && err.response.status)
  }
}
