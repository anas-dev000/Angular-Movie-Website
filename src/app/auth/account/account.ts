import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../shared/back-button/back-button';

@Component({
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './account.html',
  styleUrls: ['./account.css'],
})
export class AccountComponent {
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser() || { email: '', username: '' };
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/movies']);
  }
}
