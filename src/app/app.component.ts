import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { loadItems } from './state/items/items.actions';


interface AppState {
  items?: {
    items: any[];
    loading: boolean;
    error: string | null;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'EYE MOVIE';
  isOnline = navigator.onLine;
  
  constructor(private store: Store<AppState>) {}
  
  ngOnInit() {

    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('App is online');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('App is offline');
    });
  }
  
  testStore() {
    console.log('Test NgRx Action clicked');

    this.store.select(state => state).subscribe(state => {
      console.log('Store state:', state);
    });
  }
  
  checkStore() {
    console.log('Check Store State clicked');
    this.store.select(state => state).subscribe((state: AppState) => {
      console.log('Current store:', state);
      console.log('Items in store:', state.items?.items?.length || 0);
    });
  }
  
  clearStore() {
    console.log('Clear clicked');

  }
}