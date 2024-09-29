export enum OrderDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IEmailDto {
  templateCode: string;
  to?: string;
  subject: string;
  from?: string;
  bcc?: string;
  html?: string;
  data?: any;
}

export interface IAuthContext {
  fullname: string;
  email: string;
  uuid: string;
}
