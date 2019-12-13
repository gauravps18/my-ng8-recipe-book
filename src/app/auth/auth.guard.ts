import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(take(1), map((user) => {
            return !!user || this.router.createUrlTree(['/auth']);
        }))
    }
}
