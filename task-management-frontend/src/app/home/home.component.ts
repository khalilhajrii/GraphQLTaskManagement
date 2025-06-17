import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  currentUser: any = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Get the current user from the auth service
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // If we don't have the current user yet, try to fetch it
    if (!this.currentUser) {
      this.authService.fetchCurrentUser().subscribe();
    }
  }
}