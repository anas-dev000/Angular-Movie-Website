import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MovieService } from '../services/movie';
import { LanguageService } from '../services/language';
import { MovieCardComponent } from '../shared/movie-card/movie-card';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MovieCardComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="fw-bold text-warning">Now Playing</h2>
        <div class="dropdown">
          <button
            class="btn btn-warning dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort by: {{ sortByLabel }}
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" (click)="setSortBy('popularity.desc')">Popularity Desc</a>
            </li>
            <li>
              <a class="dropdown-item" (click)="setSortBy('release_date.desc')"
                >Release Date Desc</a
              >
            </li>
            <li>
              <a class="dropdown-item" (click)="setSortBy('vote_average.desc')">Rating Desc</a>
            </li>
          </ul>
        </div>
        <div class="dropdown mb-3">
          <button
            class="btn btn-warning dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ selectedGenres.length ? getSelectedGenreNames() : 'Genres' }}
          </button>
          <ul class="dropdown-menu">
            @for (genre of genres; track genre.id) {
            <li>
              <a
                class="dropdown-item"
                [class.active]="selectedGenres.includes(genre.id)"
                (click)="toggleGenre(genre.id)"
              >
                {{ genre.name }}
              </a>
            </li>
            }
          </ul>
        </div>
      </div>

      @if (loading) {
      <div class="text-center">
        <div class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      } @else {
      <div class="row g-3 m-3">
        @for (movie of movies; track movie.id) {
        <div class="col-lg-3 col-md-4 col-sm-6 col-6">
          <app-movie-card [movie]="movie"></app-movie-card>
        </div>
        } @empty { @for (i of [1, 2, 3, 4]; track i) {
        <div class="col-lg-2 col-md-4 col-sm-6 col-6">
          <div class="skeleton"></div>
        </div>
        } }
      </div>
      }

      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="page === 1">
            <a class="page-link btn" (click)="changePage(page - 1)">Previous</a>
          </li>
          <li class="page-item" [class.disabled]="page >= totalPages">
            <a class="page-link btn" (click)="changePage(page + 1)">Next</a>
          </li>
        </ul>
      </nav>

      <button class="btn btn-warning position-fixed bottom-0 end-0 m-3" (click)="scrollToTop()">
        Back to Top
      </button>
    </div>
  `,
  styles: [
    `
      h2 {
        font-size: 1.8rem;
        margin-bottom: 0;
      }
      .dropdown-toggle {
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
        border-radius: 10px;
      }
      .dropdown-menu {
        font-size: 0.9rem;
        border-radius: 10px;
        max-height: 200px;
        overflow-y: auto;
      }
      .dropdown-item {
        cursor: pointer;
      }
      .dropdown-item.active {
        background-color: #ffc107;
        color: #000;
        font-weight: bold;
      }
      .skeleton {
        width: 100%;
        height: 250px;
        background: #e0e0e0;
        border-radius: 10px;
      }
    `,
  ],
})
export class MoviesComponent implements OnInit {
  movies: any[] = [];
  genres: any[] = [];
  selectedGenres: number[] = [];
  sortBy = 'popularity.desc';
  sortByLabel = 'Popularity Desc';
  page = 1;
  totalPages = 1;
  language = 'en';
  loading = true;

  constructor(
    private movieService: MovieService,
    private languageService: LanguageService,
    private title: Title
  ) {}

  ngOnInit() {
    this.languageService.getCurrentLanguage().subscribe((lang) => {
      this.language = lang;
      this.loadGenres();
      this.loadMovies();
    });
  }

  loadGenres() {
    this.movieService.getGenres(this.language).subscribe((data) => (this.genres = data.genres));
  }

  loadMovies() {
    this.loading = true;
    const genresStr = this.selectedGenres.join(',');
    this.movieService
      .getDiscover(this.page, this.language, this.sortBy, genresStr)
      .subscribe((data) => {
        this.movies = data.results;
        this.totalPages = data.total_pages;
        this.loading = false;
        this.title.setTitle(`Movie App - Now Playing (Page ${this.page})`);
        this.sortByLabel = this.getSortByLabel(this.sortBy);
      });
  }

  setSortBy(value: string) {
    this.sortBy = value;
    this.loadMovies();
  }

  getSortByLabel(value: string): string {
    switch (value) {
      case 'popularity.desc':
        return 'Popularity Desc';
      case 'release_date.desc':
        return 'Release Date Desc';
      case 'vote_average.desc':
        return 'Rating Desc';
      default:
        return 'Sort';
    }
  }

  toggleGenre(id: number) {
    const index = this.selectedGenres.indexOf(id);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(id);
    }
    this.loadMovies();
  }

  getSelectedGenreNames(): string {
    return this.genres
      .filter((g) => this.selectedGenres.includes(g.id))
      .map((g) => g.name)
      .join(', ');
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadMovies();
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
