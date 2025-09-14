import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { BackButtonComponent } from '../../shared/back-button/back-button';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButtonComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  emailError = '';
  usernameError = '';
  passwordError = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    // Reset error messages
    this.emailError = '';
    this.usernameError = '';
    this.passwordError = '';

    // Trim inputs
    const email = this.email.trim();
    const username = this.username.trim();
    const password = this.password.trim();

    // Email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation checks
    if (!email) {
      this.emailError = 'Email is required';
      return;
    }
    if (!emailRegex.test(email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }
    if (!username) {
      this.usernameError = 'Username is required';
      return;
    }
    if (!password) {
      this.passwordError = 'Password is required';
      return;
    }

    // Proceed with registration
    this.authService.register(email, username, password);
    this.router.navigate(['/login']);
  }
}
