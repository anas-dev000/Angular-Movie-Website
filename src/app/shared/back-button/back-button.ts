import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',

  templateUrl: './back-button.html',
  styleUrls: ['./back-button.css'],
})
export class BackButtonComponent {
  constructor(private router: Router) {}

  goToMovies() {
    this.router.navigate(['/movies']);
  }
}
