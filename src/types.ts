import { AdminRoles } from "./modules/admin/admin.entities";

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

export interface RoleDecoratorOptionsInterface {
  roles: string[];
}

export interface IAdminAuthContext {
  name: string;
  email: string;
  adminUserUuid: string;
  role: AdminRoles;
}