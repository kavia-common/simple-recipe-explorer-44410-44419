import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeSearchComponent } from '../../components/recipe-search/recipe-search.component';
import { RecipeListComponent } from '../../components/recipe-list/recipe-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecipeSearchComponent, RecipeListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'Discover Amazing Recipes';
  subtitle = 'Browse, search, and cook delicious meals with our curated collection of recipes';
}
