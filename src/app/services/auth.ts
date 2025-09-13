import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  register(email: string, username: string, password: string) {
    localStorage.setItem('user', JSON.stringify({ email, username, password }));
  }

  login(username: string, password: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.username === username && user.password === password) {
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
