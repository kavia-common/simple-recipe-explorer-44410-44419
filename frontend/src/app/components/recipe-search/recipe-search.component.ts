import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { RecipeSearchFilters } from '../../models/recipe.interface';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.scss'
})
export class RecipeSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  
  searchQuery = '';
  selectedDifficulty = 'All';
  maxPrepTime?: number;
  isFilterExpanded = false;
  
  difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  prepTimeOptions = [
    { label: 'Any time', value: undefined },
    { label: 'Under 15 min', value: 15 },
    { label: 'Under 30 min', value: 30 },
    { label: 'Under 60 min', value: 60 }
  ];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.updateFilters();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // PUBLIC_INTERFACE
  onSearchInput(query: string): void {
    /**
     * Handles search input changes with debouncing.
     */
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  // PUBLIC_INTERFACE
  onDifficultyChange(): void {
    /**
     * Handles difficulty filter changes.
     */
    this.updateFilters();
  }

  // PUBLIC_INTERFACE
  onPrepTimeChange(): void {
    /**
     * Handles prep time filter changes.
     */
    this.updateFilters();
  }

  // PUBLIC_INTERFACE
  toggleFilters(): void {
    /**
     * Toggles the visibility of advanced filters.
     */
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  // PUBLIC_INTERFACE
  clearFilters(): void {
    /**
     * Clears all search filters and resets to default state.
     */
    this.searchQuery = '';
    this.selectedDifficulty = 'All';
    this.maxPrepTime = undefined;
    this.updateFilters();
  }

  private updateFilters(): void {
    const filters: RecipeSearchFilters = {
      query: this.searchQuery || undefined,
      difficulty: this.selectedDifficulty === 'All' ? undefined : this.selectedDifficulty,
      maxPrepTime: this.maxPrepTime
    };
    
    this.recipeService.updateSearchFilters(filters);
  }
}
