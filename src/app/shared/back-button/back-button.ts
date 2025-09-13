import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  templateUrl: './back-button.html',
  styleUrls: ['./back-button.css'],
})
export class BackButtonComponent {
  constructor(private router: Router) {}

  goToMovies() {
    this.router.navigate(['/movies']);
  }
}
