import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (error.status === 0) {
        message = 'Unable to connect to server. Please check your connection.';
      } else if (error.status === 404) {
        message = 'Resource not found';
      } else if (error.status === 500) {
        message = 'Internal server error. Please try again later.';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      console.error(`HTTP Error ${error.status}: ${message}`);
      return throwError(() => new Error(message));
    })
  );
};
