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
  imports: [CommonModule, FormsModule, RouterModule, MovieCardComponent, NavbarComponent],
  templateUrl: './movies.html',
  styleUrls: ['./movies.css'],
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
