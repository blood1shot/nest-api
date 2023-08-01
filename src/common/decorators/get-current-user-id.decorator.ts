import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    return request.user['sub'];
  },
);
