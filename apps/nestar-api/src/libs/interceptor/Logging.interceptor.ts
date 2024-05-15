import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    private readonly logger: Logger = new Logger();

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const recordTime = Date.now();
        const requestType = context.getType<GqlContextType>();

        if(requestType === 'http') {
            // Develop logic for rest api if needed
        } else if (requestType === 'graphql') {
            // (1) Print Request
        const GqlContext = GqlExecutionContext.create(context);
        this.logger.log(`${this.stringify(GqlContext.getContext().req.body)}`, 'REQUEST');

            // (2) Error handling via GraphQL
            // (3) If no Errors giving Response below
        return next.handle().pipe(
            tap((context) => {
                const responseTime = Date.now() - recordTime;
                this.logger.log(`${this.stringify(context)} - ${responseTime}ms\n\n`, 'RESPONSE')
            }),
        );
        }
    }

    private stringify(context: ExecutionContext): string {
        return JSON.stringify(context).slice(0, 75)
    }
}