import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Recipe } from '../../models/recipe.interface';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss'
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;

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
  getTotalTime(): number {
    /**
     * Calculates the total cooking time (prep + cook time).
     */
    return this.recipe.prepTime + this.recipe.cookTime;
  }

  // PUBLIC_INTERFACE
  onImageError(event: any): void {
    /**
     * Handles image loading errors by showing a placeholder.
     */
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNS41MjMgMTUwIDIxMCAxNDUuNTIzIDIxMCAxNDBDMjEwIDEzNC40NzcgMjA1LjUyMyAxMzAgMjAwIDEzMEMxOTQuNDc3IDEzMCAxOTAgMTM0LjQ3NyAxOTAgMTQwQzE5MCAxNDUuNTIzIDE5NC40NzcgMTUwIDIwMCAxNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNzAgMTIwSDEzMEMxMjQuNDc3IDEyMCAxMjAgMTI0LjQ3NyAxMjAgMTMwVjE4MEMxMjAgMTg1LjUyMyAxMjQuNDc3IDE5MCAxMzAgMTkwSDI3MEMyNzUuNTIzIDE5MCAyODAgMTg1LjUyMyAyODAgMTgwVjEzMEMyODAgMTI0LjQ3NyAyNzUuNTIzIDEyMCAyNzAgMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
  }
}
