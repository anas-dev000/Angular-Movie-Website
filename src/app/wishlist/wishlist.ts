import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../services/wishlist';
import { MovieCardComponent } from '../shared/movie-card/movie-card';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-wishlist',

  imports: [CommonModule, RouterModule, MovieCardComponent, NavbarComponent],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'],
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
