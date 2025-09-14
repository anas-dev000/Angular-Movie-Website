import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MovieService } from '../services/movie';
import { LanguageService } from '../services/language';
import { WishlistService } from '../services/wishlist';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../shared/navbar/navbar';
import { MovieCardComponent } from '../shared/movie-card/movie-card';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MovieCardComponent],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.css'],
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  recommendations: any[] = [];
  imgBaseUrl = environment.imgBaseUrl;
  isInWishlist = false;
  trailerUrl: SafeResourceUrl | null = null;
  language = 'en';
  loading = true;
  recLoading = true;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private languageService: LanguageService,
    private wishlistService: WishlistService,
    private sanitizer: DomSanitizer,
    private title: Title
  ) {}

  ngOnInit() {
    this.languageService.getCurrentLanguage().subscribe((lang) => {
      this.language = lang;
      this.subscribeToRouteChanges();
    });
  }

  subscribeToRouteChanges() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.loading = true;
      this.recLoading = true;
      this.trailerUrl = null;
      this.isInWishlist = this.wishlistService.isInWishlist(id);
      this.loadDetails(id);
      this.loadRecommendations(id);
      this.loadTrailer(id);
    });
  }

  loadDetails(id: number) {
    this.movieService.getMovieDetails(id, this.language).subscribe((data) => {
      this.movie = data;
      this.loading = false;
      this.title.setTitle(`Movie App - ${this.movie?.title || 'Details'}`);
    });
  }

  loadRecommendations(id: number) {
    this.movieService.getRecommendations(id, this.language).subscribe((data) => {
      this.recommendations = data.results;
      this.recLoading = false;
    });
  }

  loadTrailer(id: number) {
    this.movieService.getVideos(id).subscribe((data) => {
      const trailer = data.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${trailer.key}`
        );
      }
    });
  }

  toggleWishlist() {
    this.wishlistService.toggleWishlist(this.movie);
    this.isInWishlist = !this.isInWishlist;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
