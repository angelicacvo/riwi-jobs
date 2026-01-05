import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Standardized API response structure
 */
export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Global response interceptor to standardize all API responses
 * Wraps all responses in { success, data, message } format
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * Transform response data to standard format
   * @param context - Execution context
   * @param next - Call handler for next interceptor/controller
   * @returns Observable with transformed response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If response already has success property, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // If response has message property, extract and restructure
        if (data && typeof data === 'object' && 'message' in data) {
          const { message, ...res } = data;
          return {
            success: true,
            data: res,
            message: message || 'Operation successful',
          };
        }

        // Default response structure
        return {
          success: true,
          data: data,
          message: 'Operation successful',
        };
      }),
    );
  }
}
