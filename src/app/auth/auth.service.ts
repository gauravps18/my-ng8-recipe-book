import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, exhaustMap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

export interface AuthResponseData {
    king: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCmzaNuKQdO3d8KSK_omk0RBgFU5nv7qfM', {
            email,
            password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap((resData) => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCmzaNuKQdO3d8KSK_omk0RBgFU5nv7qfM', {
            email,
            password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap((resData) => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expiresIn: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresIn);
    }

    autoLogin() {
        const userData: { 
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string 
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            this.user.next(loadedUser)
            const expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expiresIn);
        }

    }

    private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResp: HttpErrorResponse) {
        let errorMessage = 'Unknown error occurred!';
        if (errorResp.error && errorResp.error.error) {
            switch(errorResp.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'Email already exists';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'Email does not exist';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'Password is incorrect';
                    break;
            }
        }
        return throwError(errorMessage);
    }
}
