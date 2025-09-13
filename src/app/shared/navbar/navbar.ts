import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist';
import { LanguageService } from '../../services/language';
import { ThemeService } from '../../services/theme';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit {
  searchQuery = '';
  wishlistCount = 0;
  languages: string[] = [];
  selectedLanguage = 'en';
  currentTheme = 'light';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private languageService: LanguageService,
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.languageService.getCurrentLanguage().subscribe((lang) => (this.selectedLanguage = lang));
    this.wishlistService.getWishlistCount().subscribe((count) => (this.wishlistCount = count));
    this.themeService.getTheme().subscribe((theme) => (this.currentTheme = theme));
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  search(event: Event) {
    event.preventDefault();
    if (this.searchQuery) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
      this.searchQuery = '';
    }
  }

  changeLanguage() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/movies']);
  }
}
