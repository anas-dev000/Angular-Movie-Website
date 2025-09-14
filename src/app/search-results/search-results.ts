import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MovieService } from '../services/movie';
import { LanguageService } from '../services/language';
import { MovieCardComponent } from '../shared/movie-card/movie-card';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, NavbarComponent],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResultsComponent implements OnInit {
  movies: any[] = [];
  query = '';
  page = 1;
  totalPages = 1;
  language = 'en';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private languageService: LanguageService,
    private title: Title
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'] || '';
      this.languageService.getCurrentLanguage().subscribe((lang) => {
        this.language = lang;
        this.loadSearch();
      });
    });
  }

  loadSearch() {
    this.loading = true;
    this.movieService.searchMovies(this.query, this.page, this.language).subscribe((data) => {
      this.movies = data.results;
      this.totalPages = data.total_pages;
      this.loading = false;
      this.title.setTitle(`Movie App - Search: ${this.query} (Page ${this.page})`);
    });
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadSearch();
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
