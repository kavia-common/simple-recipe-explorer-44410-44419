import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Recipe, RecipeSearchFilters } from '../models/recipe.interface';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private searchFiltersSubject = new BehaviorSubject<RecipeSearchFilters>({});
  private recipesCache: Recipe[] = [];
  private isUsingMockData = true;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {
    this.isUsingMockData = !this.environmentService.getApiBaseUrl();
  }

  // PUBLIC_INTERFACE
  getRecipes(): Observable<Recipe[]> {
    /**
     * Retrieves all recipes from either API or mock data.
     * Returns filtered results based on current search filters.
     */
    if (this.isUsingMockData) {
      if (this.recipesCache.length === 0) {
        this.recipesCache = this.getMockRecipes();
      }
      return combineLatest([
        of(this.recipesCache),
        this.searchFiltersSubject.pipe(debounceTime(300), distinctUntilChanged())
      ]).pipe(
        map(([recipes, filters]) => this.filterRecipes(recipes, filters))
      );
    } else {
      const apiUrl = this.environmentService.getApiBaseUrl();
      return this.http.get<Recipe[]>(`${apiUrl}/recipes`).pipe(
        map(recipes => {
          this.recipesCache = recipes;
          return this.filterRecipes(recipes, this.searchFiltersSubject.value);
        }),
        catchError(() => {
          console.warn('API failed, falling back to mock data');
          this.isUsingMockData = true;
          this.recipesCache = this.getMockRecipes();
          return of(this.filterRecipes(this.recipesCache, this.searchFiltersSubject.value));
        })
      );
    }
  }

  // PUBLIC_INTERFACE
  getRecipeById(id: string): Observable<Recipe | null> {
    /**
     * Retrieves a specific recipe by ID from either API or mock data.
     */
    if (this.isUsingMockData) {
      if (this.recipesCache.length === 0) {
        this.recipesCache = this.getMockRecipes();
      }
      const recipe = this.recipesCache.find(r => r.id === id) || null;
      return of(recipe);
    } else {
      const apiUrl = this.environmentService.getApiBaseUrl();
      return this.http.get<Recipe>(`${apiUrl}/recipes/${id}`).pipe(
        catchError(() => {
          console.warn('API failed, falling back to mock data');
          const recipe = this.getMockRecipes().find(r => r.id === id) || null;
          return of(recipe);
        })
      );
    }
  }

  // PUBLIC_INTERFACE
  updateSearchFilters(filters: RecipeSearchFilters): void {
    /**
     * Updates the search filters and triggers recipe filtering.
     */
    this.searchFiltersSubject.next({ ...this.searchFiltersSubject.value, ...filters });
  }

  // PUBLIC_INTERFACE
  getSearchFilters(): Observable<RecipeSearchFilters> {
    /**
     * Returns the current search filters as an observable.
     */
    return this.searchFiltersSubject.asObservable();
  }

  private filterRecipes(recipes: Recipe[], filters: RecipeSearchFilters): Recipe[] {
    if (!filters || Object.keys(filters).length === 0) {
      return recipes;
    }

    return recipes.filter(recipe => {
      // Text search in title, description, and ingredients
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(query);
        const matchesDescription = recipe.description.toLowerCase().includes(query);
        const matchesIngredients = recipe.ingredients.some(ing => 
          ing.name.toLowerCase().includes(query)
        );
        
        if (!matchesTitle && !matchesDescription && !matchesIngredients) {
          return false;
        }
      }

      // Filter by difficulty
      if (filters.difficulty && filters.difficulty !== 'All') {
        if (recipe.difficulty !== filters.difficulty) {
          return false;
        }
      }

      // Filter by prep time
      if (filters.maxPrepTime) {
        if (recipe.prepTime > filters.maxPrepTime) {
          return false;
        }
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          recipe.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  }

  private getMockRecipes(): Recipe[] {
    return [
      {
        id: '1',
        title: 'Classic Spaghetti Carbonara',
        description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        difficulty: 'Medium',
        ingredients: [
          { id: '1-1', name: 'Spaghetti', amount: 400, unit: 'g' },
          { id: '1-2', name: 'Pancetta', amount: 200, unit: 'g' },
          { id: '1-3', name: 'Eggs', amount: 3, unit: 'large' },
          { id: '1-4', name: 'Parmesan cheese', amount: 100, unit: 'g', notes: 'freshly grated' },
          { id: '1-5', name: 'Black pepper', amount: 1, unit: 'tsp', notes: 'freshly ground' }
        ],
        instructions: [
          { id: '1-1', step: 1, description: 'Bring a large pot of salted water to boil. Cook spaghetti according to package directions until al dente.', duration: 8 },
          { id: '1-2', step: 2, description: 'While pasta cooks, heat pancetta in a large skillet over medium heat until crispy.', duration: 5 },
          { id: '1-3', step: 3, description: 'In a bowl, whisk together eggs, grated Parmesan, and black pepper.' },
          { id: '1-4', step: 4, description: 'Drain pasta, reserving 1 cup pasta water. Add hot pasta to pancetta skillet.' },
          { id: '1-5', step: 5, description: 'Remove from heat. Quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce.' }
        ],
        tags: ['Italian', 'Pasta', 'Quick', 'Comfort Food']
      },
      {
        id: '2',
        title: 'Thai Green Curry',
        description: 'Aromatic and spicy Thai curry with coconut milk and fresh vegetables',
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
        prepTime: 20,
        cookTime: 25,
        servings: 4,
        difficulty: 'Medium',
        ingredients: [
          { id: '2-1', name: 'Green curry paste', amount: 3, unit: 'tbsp' },
          { id: '2-2', name: 'Coconut milk', amount: 400, unit: 'ml' },
          { id: '2-3', name: 'Chicken breast', amount: 500, unit: 'g', notes: 'cut into strips' },
          { id: '2-4', name: 'Thai eggplant', amount: 2, unit: 'medium', notes: 'quartered' },
          { id: '2-5', name: 'Bell peppers', amount: 2, unit: 'medium', notes: 'sliced' },
          { id: '2-6', name: 'Thai basil', amount: 1, unit: 'cup', notes: 'fresh leaves' },
          { id: '2-7', name: 'Fish sauce', amount: 2, unit: 'tbsp' },
          { id: '2-8', name: 'Palm sugar', amount: 1, unit: 'tbsp' }
        ],
        instructions: [
          { id: '2-1', step: 1, description: 'Heat 2 tbsp of the thick coconut cream in a wok over medium heat.', duration: 3 },
          { id: '2-2', step: 2, description: 'Add green curry paste and fry until fragrant and oil separates.', duration: 5 },
          { id: '2-3', step: 3, description: 'Add chicken and stir-fry until nearly cooked through.', duration: 8 },
          { id: '2-4', step: 4, description: 'Add remaining coconut milk, eggplant, and bell peppers. Simmer until vegetables are tender.', duration: 15 },
          { id: '2-5', step: 5, description: 'Season with fish sauce and palm sugar. Add Thai basil and serve with jasmine rice.' }
        ],
        tags: ['Thai', 'Curry', 'Spicy', 'Coconut', 'Asian']
      },
      {
        id: '3',
        title: 'Classic Caesar Salad',
        description: 'Crisp romaine lettuce with homemade Caesar dressing and croutons',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
        prepTime: 15,
        cookTime: 10,
        servings: 4,
        difficulty: 'Easy',
        ingredients: [
          { id: '3-1', name: 'Romaine lettuce', amount: 2, unit: 'heads', notes: 'chopped' },
          { id: '3-2', name: 'Parmesan cheese', amount: 1, unit: 'cup', notes: 'grated' },
          { id: '3-3', name: 'Croutons', amount: 2, unit: 'cups' },
          { id: '3-4', name: 'Mayonnaise', amount: 0.5, unit: 'cup' },
          { id: '3-5', name: 'Anchovy paste', amount: 1, unit: 'tsp' },
          { id: '3-6', name: 'Garlic', amount: 2, unit: 'cloves', notes: 'minced' },
          { id: '3-7', name: 'Lemon juice', amount: 2, unit: 'tbsp', notes: 'fresh' },
          { id: '3-8', name: 'Worcestershire sauce', amount: 1, unit: 'tsp' }
        ],
        instructions: [
          { id: '3-1', step: 1, description: 'Wash and chop romaine lettuce into bite-sized pieces.' },
          { id: '3-2', step: 2, description: 'In a small bowl, whisk together mayonnaise, anchovy paste, minced garlic, lemon juice, and Worcestershire sauce.' },
          { id: '3-3', step: 3, description: 'Place lettuce in a large salad bowl and toss with dressing.' },
          { id: '3-4', step: 4, description: 'Add croutons and most of the Parmesan cheese, toss gently.' },
          { id: '3-5', step: 5, description: 'Garnish with remaining Parmesan and serve immediately.' }
        ],
        tags: ['Salad', 'Vegetarian', 'Classic', 'Quick']
      },
      {
        id: '4',
        title: 'Chocolate Chip Cookies',
        description: 'Soft and chewy homemade chocolate chip cookies',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
        prepTime: 15,
        cookTime: 12,
        servings: 24,
        difficulty: 'Easy',
        ingredients: [
          { id: '4-1', name: 'All-purpose flour', amount: 2.25, unit: 'cups' },
          { id: '4-2', name: 'Baking soda', amount: 1, unit: 'tsp' },
          { id: '4-3', name: 'Salt', amount: 1, unit: 'tsp' },
          { id: '4-4', name: 'Butter', amount: 1, unit: 'cup', notes: 'softened' },
          { id: '4-5', name: 'Brown sugar', amount: 0.75, unit: 'cup', notes: 'packed' },
          { id: '4-6', name: 'White sugar', amount: 0.75, unit: 'cup' },
          { id: '4-7', name: 'Eggs', amount: 2, unit: 'large' },
          { id: '4-8', name: 'Vanilla extract', amount: 2, unit: 'tsp' },
          { id: '4-9', name: 'Chocolate chips', amount: 2, unit: 'cups' }
        ],
        instructions: [
          { id: '4-1', step: 1, description: 'Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.' },
          { id: '4-2', step: 2, description: 'In a bowl, whisk together flour, baking soda, and salt.' },
          { id: '4-3', step: 3, description: 'In a large bowl, cream together butter and both sugars until light and fluffy.', duration: 3 },
          { id: '4-4', step: 4, description: 'Beat in eggs one at a time, then vanilla extract.' },
          { id: '4-5', step: 5, description: 'Gradually mix in flour mixture, then fold in chocolate chips.' },
          { id: '4-6', step: 6, description: 'Drop rounded tablespoons of dough onto prepared baking sheets.' },
          { id: '4-7', step: 7, description: 'Bake for 9-11 minutes until edges are golden brown.', duration: 10 }
        ],
        tags: ['Dessert', 'Cookies', 'Chocolate', 'Baking', 'Sweet']
      },
      {
        id: '5',
        title: 'Grilled Salmon with Lemon',
        description: 'Fresh salmon fillets grilled to perfection with lemon and herbs',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        difficulty: 'Easy',
        ingredients: [
          { id: '5-1', name: 'Salmon fillets', amount: 4, unit: 'pieces', notes: '6 oz each' },
          { id: '5-2', name: 'Lemon', amount: 2, unit: 'medium', notes: 'sliced' },
          { id: '5-3', name: 'Olive oil', amount: 3, unit: 'tbsp' },
          { id: '5-4', name: 'Garlic', amount: 3, unit: 'cloves', notes: 'minced' },
          { id: '5-5', name: 'Fresh dill', amount: 2, unit: 'tbsp', notes: 'chopped' },
          { id: '5-6', name: 'Salt', amount: 1, unit: 'tsp' },
          { id: '5-7', name: 'Black pepper', amount: 0.5, unit: 'tsp' }
        ],
        instructions: [
          { id: '5-1', step: 1, description: 'Preheat grill to medium-high heat and oil the grates.' },
          { id: '5-2', step: 2, description: 'Pat salmon fillets dry and season with salt and pepper.' },
          { id: '5-3', step: 3, description: 'Mix olive oil, minced garlic, and dill in a small bowl.' },
          { id: '5-4', step: 4, description: 'Brush salmon with herb oil mixture on both sides.' },
          { id: '5-5', step: 5, description: 'Grill salmon for 4-6 minutes per side, depending on thickness.', duration: 10 },
          { id: '5-6', step: 6, description: 'Serve immediately with lemon slices and additional fresh dill.' }
        ],
        tags: ['Seafood', 'Grilled', 'Healthy', 'Protein', 'Quick']
      },
      {
        id: '6',
        title: 'Vegetable Stir Fry',
        description: 'Colorful mixed vegetables stir-fried with garlic and ginger',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
        prepTime: 15,
        cookTime: 10,
        servings: 4,
        difficulty: 'Easy',
        ingredients: [
          { id: '6-1', name: 'Broccoli', amount: 2, unit: 'cups', notes: 'cut into florets' },
          { id: '6-2', name: 'Bell peppers', amount: 2, unit: 'medium', notes: 'sliced' },
          { id: '6-3', name: 'Carrots', amount: 2, unit: 'medium', notes: 'julienned' },
          { id: '6-4', name: 'Snap peas', amount: 1, unit: 'cup' },
          { id: '6-5', name: 'Garlic', amount: 3, unit: 'cloves', notes: 'minced' },
          { id: '6-6', name: 'Fresh ginger', amount: 1, unit: 'tbsp', notes: 'minced' },
          { id: '6-7', name: 'Soy sauce', amount: 3, unit: 'tbsp' },
          { id: '6-8', name: 'Sesame oil', amount: 1, unit: 'tbsp' },
          { id: '6-9', name: 'Vegetable oil', amount: 2, unit: 'tbsp' }
        ],
        instructions: [
          { id: '6-1', step: 1, description: 'Heat vegetable oil in a large wok or skillet over high heat.' },
          { id: '6-2', step: 2, description: 'Add garlic and ginger, stir-fry for 30 seconds until fragrant.' },
          { id: '6-3', step: 3, description: 'Add carrots and broccoli, stir-fry for 3 minutes.', duration: 3 },
          { id: '6-4', step: 4, description: 'Add bell peppers and snap peas, stir-fry for 2 more minutes.', duration: 2 },
          { id: '6-5', step: 5, description: 'Add soy sauce and sesame oil, toss everything together for 1 minute.' },
          { id: '6-6', step: 6, description: 'Serve immediately over steamed rice or noodles.' }
        ],
        tags: ['Vegetarian', 'Healthy', 'Asian', 'Quick', 'Vegan']
      }
    ];
  }
}
