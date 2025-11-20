import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Recipe Explorer - Discover Amazing Recipes'
  },
  {
    path: 'recipe/:id',
    loadComponent: () => import('./components/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent),
    title: 'Recipe Details - Recipe Explorer'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
