import { UserRole } from '../users/user.entity';

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
  sessionId: string;
};

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
  sid: string;
};
