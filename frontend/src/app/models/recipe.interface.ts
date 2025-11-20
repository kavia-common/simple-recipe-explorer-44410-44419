export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface Instruction {
  id: string;
  step: number;
  description: string;
  duration?: number; // optional duration for this step in minutes
}

export interface RecipeSearchFilters {
  query?: string;
  difficulty?: string;
  maxPrepTime?: number;
  tags?: string[];
}
