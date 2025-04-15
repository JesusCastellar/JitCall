import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = getAuth();
    const user = auth.currentUser;

    return from(this.getTokens(user)).pipe(
      switchMap(tokens => {
        let modifiedReq = req;

        // Agregar token de Firebase si existe
        if (tokens.firebaseToken) {
          modifiedReq = modifiedReq.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.firebaseToken}`
            }
          });
        }

        // Agregar token del servidor externo si es la URL correspondiente
        if (req.url.includes('ravishing-courtesy-production.up.railway.app') && tokens.externalToken) {
          modifiedReq = modifiedReq.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.externalToken}`
            }
          });
        }

        return next.handle(modifiedReq);
      })
    );
  }

  private async getTokens(user: any): Promise<{ firebaseToken?: string, externalToken?: string }> {
    let firebaseToken: string | undefined;
    let externalToken: string | null = localStorage.getItem('externalToken');

    if (user) {
      firebaseToken = await user.getIdToken();
    }

    return {
      firebaseToken,
      externalToken: externalToken ?? undefined
    };
  }
}
