import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, Subject, takeUntil, map, switchMap } from 'rxjs';
import { Recipe } from '../../models/recipe.interface';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss'
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe$!: Observable<Recipe | null>;
  isLoading = true;
  hasError = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.loadRecipe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // PUBLIC_INTERFACE
  loadRecipe(): void {
    /**
     * Loads recipe details based on the route parameter.
     */
    this.isLoading = true;
    this.hasError = false;

    this.recipe$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.recipeService.getRecipeById(id)),
      takeUntil(this.destroy$)
    );

    this.recipe$.subscribe({
      next: (recipe) => {
        this.isLoading = false;
        this.hasError = !recipe;
        
        if (!recipe) {
          // Recipe not found, navigate back to home after a delay
          if (typeof setTimeout !== 'undefined') {
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 3000);
          }
        }
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  // PUBLIC_INTERFACE
  goBack(): void {
    /**
     * Navigates back to the recipe list.
     */
    this.router.navigate(['/']);
  }

  // PUBLIC_INTERFACE
  getDifficultyColor(difficulty: string): string {
    /**
     * Returns the appropriate color class for recipe difficulty.
     */
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return 'difficulty-easy';
    }
  }

  // PUBLIC_INTERFACE
  getTotalTime(recipe: Recipe): number {
    /**
     * Calculates the total cooking time (prep + cook time).
     */
    return recipe.prepTime + recipe.cookTime;
  }

  // PUBLIC_INTERFACE
  onImageError(event: any): void {
    /**
     * Handles image loading errors by showing a placeholder.
     */
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ci8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNS41MjMgMTUwIDIxMCAxNDUuNTIzIDIxMCAxNDBDMjEwIDEzNC40NzcgMjA1LjUyMyAxMzAgMjAwIDEzMEMxOTQuNDc3IDEzMCAxOTAgMTM0LjQ3NyAxOTAgMTQwQzE5MCAxNDUuNTIzIDE5NC40NzcgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNzAgMTIwSDEzMEMxMjQuNDc3IDEyMCAxMjAgMTI0LjQ3NyAxMjAgMTMwVjE4MEMxMjAgMTg1LjUyMyAxMjQuNDc3IDE5MCAxMzAgMTkwSDI3MEMyNzUuNTIzIDE5MCAyODAgMTg1LjUyMyAyODAgMTgwVjEzMEMyODAgMTI0LjQ3NyAyNzUuNTIzIDEyMCAyNzAgMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
  }
}
