import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../services/wishlist';
import { MovieCardComponent } from '../shared/movie-card/movie-card';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-4">
      <h2>Watch List</h2>
      @if (wishlist.length === 0) {
        <div class="text-center">
          <i class="bi bi-heartbreak display-1 text-muted"></i>
          <p>No Movies in watch list</p>
          <button class="btn btn-warning" routerLink="/movies">Back to home</button>
        </div>
      } @else {
        <div class="row">
          @for (movie of wishlist; track movie.id) {
            <div class="col-md-3">
              <app-movie-card [movie]="movie"></app-movie-card>
            </div>
          }
        </div>
      }
      <button class="btn btn-warning position-fixed bottom-0 end-0 m-3" (click)="scrollToTop()">
        Back to Top
      </button>
    </div>
  `,
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];

  constructor(private wishlistService: WishlistService, private title: Title) {}

  ngOnInit() {
    this.wishlistService.getWishlistObservable().subscribe((wishlist) => {
      this.wishlist = wishlist;
    });
    this.title.setTitle('Movie App - Wishlist');
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}