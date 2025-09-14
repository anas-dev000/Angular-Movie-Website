import { Injectable } from '@angular/core';
import { CanMatch, Router, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch {
  constructor(private authService: AuthService, private router: Router) {}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
