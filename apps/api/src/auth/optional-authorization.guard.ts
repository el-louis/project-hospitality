import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthorizationGuard } from './authorization.guard';

@Injectable()
export class OptionalAuthorizationGuard extends AuthorizationGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(context);
    } catch {
      return true;
    }
  }
}
