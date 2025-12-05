import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemCardComponent],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  searchQuery = '';

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('MenuListComponent loaded');
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.loadItems();
    });
  }

  loadItems() {
    console.log('Loading items from MenuService...');
    this.loading = true;
    this.error = '';
    
    this.menuService.getItems(this.searchQuery).subscribe({
      next: (items) => {
        console.log('Items received:', items?.length || 0, 'items');
        this.items = items || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.error = 'Ошибка загрузки данных';
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchQuery || null },
      queryParamsHandling: 'merge'
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearch();
  }
}