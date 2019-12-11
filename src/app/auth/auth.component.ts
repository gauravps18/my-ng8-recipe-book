import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode: boolean = true;
    isLoading: boolean = false;
    error = null;

    constructor(private authService: AuthService) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        this.error = null;
        this.isLoading = true;
        if (this.isLoginMode) {
            // ..
        } else {
            this.authService.signUp(email, password)
                .subscribe((respData) => {
                    console.log(respData);
                    this.isLoading = false;
                }, (error) => {
                    console.log(error);
                    this.error = 'An error occurred!';
                    this.isLoading = false;
                });
        }
        // Reste form
        form.reset();
    }
}
