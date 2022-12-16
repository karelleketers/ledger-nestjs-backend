import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

export class LocalAuthGuard extends AuthGuard('local') {
      getRequest(context: ExecutionContext) { 
        const ctx = GqlExecutionContext.create(context);
        const body = JSON.parse(JSON.stringify(ctx.getArgs().loginInput));
        const req = ctx.getContext().req;
        req.body = body;
        return req;
      }
}