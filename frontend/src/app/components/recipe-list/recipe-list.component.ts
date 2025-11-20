import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss'
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes$!: Observable<Recipe[]>;
  isLoading = true;
  hasError = false;
  private destroy$ = new Subject<void>();

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // PUBLIC_INTERFACE
  loadRecipes(): void {
    /**
     * Loads recipes from the service and handles loading states.
     */
    this.isLoading = true;
    this.hasError = false;
    
    this.recipes$ = this.recipeService.getRecipes();
    
    // Subscribe to handle loading states
    this.recipes$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (recipes) => {
        this.isLoading = false;
        this.hasError = false;
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  // PUBLIC_INTERFACE
  retryLoad(): void {
    /**
     * Retries loading recipes after an error.
     */
    this.loadRecipes();
  }

  // PUBLIC_INTERFACE
  trackByRecipeId(index: number, recipe: Recipe): string {
    /**
     * Track function for ngFor to improve performance.
     */
    return recipe.id;
  }
}
