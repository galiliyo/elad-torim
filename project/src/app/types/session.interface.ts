import { User } from '@appRoot/types/user.interface';

export interface Session {
  user: User;
  loginTime: string;
}
