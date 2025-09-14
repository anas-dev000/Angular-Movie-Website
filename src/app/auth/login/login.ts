import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { BackButtonComponent } from '../../shared/back-button/back-button';

@Component({
  imports: [CommonModule, FormsModule, RouterModule, BackButtonComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  usernameError = '';
  passwordError = '';
  generalError = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // Reset error messages
    this.usernameError = '';
    this.passwordError = '';
    this.generalError = '';

    // Trim inputs
    const username = this.username.trim();
    const password = this.password.trim();

    // Validation checks
    if (!username) {
      this.usernameError = 'Username is required';
      return;
    }
    if (!password) {
      this.passwordError = 'Password is required';
      return;
    }

    // Proceed with login
    if (this.authService.login(username, password)) {
      this.router.navigate(['/movies']);
    } else {
      this.generalError = 'Invalid credentials';
    }
  }
}
