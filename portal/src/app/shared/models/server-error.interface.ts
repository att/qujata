export interface IServerError {
  code: number;
  message: string;
  variables: string[];
  error?: string;
}

export interface IAuthError {
  url: string
}
