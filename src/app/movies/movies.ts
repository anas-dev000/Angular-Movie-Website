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
      <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
        <h2 class="fw-bold text-warning mb-0">Now Playing</h2>
        <div class="dropdown w-100">
          <button
            class="btn btn-warning dropdown-toggle w-100"
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
        <div class="dropdown mb-3 w-100">
          <button
            class="btn btn-warning dropdown-toggle w-100"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ selectedGenres.length ? getSelectedGenreNames() : 'Genres' }}
          </button>
          <ul class="dropdown-menu genre-dropdown">
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
        <div class="col-lg-3 col-md-4 col-sm-6 col-12">
          <app-movie-card [movie]="movie"></app-movie-card>
        </div>
        } @empty { @for (i of [1, 2, 3, 4, 5]; track i) {
        <div class="col-lg-2-4 col-md-4 col-sm-6 col-12">
          <div class="skeleton"></div>
        </div>
        } }
      </div>
      }
      <nav aria-label="Page navigation" class="pagination-container">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="page === 1">
            <a class="page-link btn" (click)="changePage(page - 1)">Previous</a>
          </li>
          <li class="page-item" [class.disabled]="page >= totalPages">
            <a class="page-link btn" (click)="changePage(page + 1)">Next</a>
          </li>
        </ul>
      </nav>
      <button class="btn btn-warning position-fixed back-to-top m-3" (click)="scrollToTop()">
        Back to Top
      </button>
    </div>
  `,
  styles: [
    `
      h2 {
        font-size: 1.8rem;
        margin-bottom: 0;
        text-align: center;
      }
      .dropdown {
        width: 100%;
        max-width: 200px;
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
        height: 300px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 10px;
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .pagination-container {
        margin-bottom: 3rem;
      }
      .back-to-top {
        bottom: 0;
        right: 0;
        z-index: 1000;
        border-radius: 50%;
        padding: 0.6rem;
        font-size: 0.9rem;
      }
      @media (max-width: 767px) {
        h2 {
          font-size: 1.5rem;
          width: 100%;
        }
        .dropdown {
          max-width: 100%;
        }
        .dropdown-toggle {
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
        }
        .col-lg-2-4, .col-md-4, .col-sm-6, .col-12 {
          flex: 0 0 100%;
          max-width: 100%;
          margin-bottom: 1rem;
        }
        .pagination {
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: space-between;
        }
        .page-item {
          flex: 0 0 48%;
          text-align: center;
        }
        .page-link {
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
        }
        .pagination-container {
          margin-bottom: 4.5rem;
        }
        .back-to-top {
          bottom: 1rem;
          right: 1rem;
          padding: 0.5rem;
          font-size: 0.8rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
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
