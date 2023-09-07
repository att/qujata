export interface IServerError {
  code: number;
  message: string;
  variables: string[];
}

export interface IAuthError {
  url: string
}
