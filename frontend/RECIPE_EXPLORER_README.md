# Recipe Explorer - Angular Frontend

A modern, responsive Angular application for browsing, searching, and viewing recipes with the Ocean Professional theme.

## 🚀 Features

### Core Functionality
- **Recipe Browsing**: Responsive grid layout with recipe cards
- **Advanced Search**: Search by recipe name and ingredients with debounced input
- **Smart Filtering**: Filter by difficulty level and prep time
- **Recipe Details**: Comprehensive view with ingredients, instructions, and timing
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Technical Features
- **Angular 19**: Latest Angular with standalone components
- **TypeScript**: Full type safety and modern JavaScript features
- **SCSS Styling**: Ocean Professional theme with CSS custom properties
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Lazy loading, optimized bundles, efficient change detection

## 🎨 Design System

### Ocean Professional Theme
- **Primary**: #2563EB (Blue)
- **Secondary**: #F59E0B (Amber)  
- **Success**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Background**: #f9fafb (Light Gray)
- **Surface**: #ffffff (White)
- **Text**: #111827 (Dark Gray)

### Design Principles
- Clean, modern aesthetic with subtle shadows
- Rounded corners and smooth transitions
- Minimalist design with strategic use of color
- Consistent spacing and typography using Inter font

## 📁 Project Structure

```
src/app/
├── components/
│   ├── header/                 # Navigation header
│   ├── recipe-card/           # Individual recipe cards
│   ├── recipe-detail/         # Full recipe view
│   ├── recipe-list/           # Recipe grid with states
│   └── recipe-search/         # Search and filter controls
├── pages/
│   └── home/                  # Main page combining search + list
├── services/
│   ├── environment.service.ts  # Environment variable handling
│   └── recipe.service.ts      # Recipe data management
├── models/
│   └── recipe.interface.ts    # TypeScript interfaces
└── app.component.*            # Root component
```

## 🔧 Configuration

### Environment Variables
The app supports environment-based configuration. Copy `.env.example` to `.env` and configure:

```bash
# API Integration (optional)
NG_APP_API_BASE=http://localhost:8080/api
NG_APP_BACKEND_URL=http://localhost:8080

# If neither API variable is set, the app uses rich mock data
```

### API Integration
- **With API**: Set `NG_APP_API_BASE` or `NG_APP_BACKEND_URL`
  - Expects endpoints: `GET /recipes` and `GET /recipes/:id`
- **Without API**: Uses comprehensive mock data (6 sample recipes)
- **Fallback**: Automatically falls back to mock data if API fails

## 🏃‍♂️ Getting Started

### Development Server
```bash
npm install
npm start
```
Runs on `http://localhost:3000` (or next available port)

### Build
```bash
npm run build
```
Outputs to `dist/angular/` with optimized bundles

### Testing
```bash
npm test
```

## 🧭 Routing

- `/` - Home page with search and recipe grid
- `/recipe/:id` - Individual recipe detail page
- `/**` - Redirects to home (404 handling)

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: 768px - 1024px
- **Large Desktop**: > 1024px

## ♿ Accessibility Features

- **ARIA Labels**: Comprehensive labeling for screen readers
- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Alt Text**: Descriptive image alt attributes

## 🎯 Performance Optimizations

- **Lazy Loading**: Route-based code splitting
- **OnPush Strategy**: Efficient change detection
- **Debounced Search**: 300ms debounce for search input
- **Image Optimization**: Lazy loading and error handling
- **Bundle Optimization**: Tree shaking and minification

## 📊 Mock Data

Includes 6 diverse recipes:
- Classic Spaghetti Carbonara (Italian, Medium)
- Thai Green Curry (Thai, Medium, Spicy)
- Classic Caesar Salad (Salad, Easy, Vegetarian)
- Chocolate Chip Cookies (Dessert, Easy)
- Grilled Salmon with Lemon (Seafood, Easy, Healthy)
- Vegetable Stir Fry (Asian, Easy, Vegan)

Each recipe includes:
- High-quality images, ingredients with measurements
- Step-by-step instructions with timing
- Difficulty level, prep/cook times, servings
- Tags for categorization

## 🔄 State Management

- **Recipe Service**: Central data management
- **Search Filters**: Reactive filtering with RxJS
- **Loading States**: Skeleton loaders and error handling
- **Router State**: URL-based navigation state

## 🎨 Component Highlights

### RecipeCard
- Hover effects with image scaling
- Difficulty badges with color coding
- Truncated text with CSS line clamping
- Accessible card navigation

### RecipeSearch  
- Debounced search input (300ms)
- Expandable advanced filters
- Responsive filter layout
- Clear filters functionality

### RecipeDetail
- Hero section with large image
- Organized ingredients and instructions
- Step numbering with optional timing
- Back navigation with browser history

### RecipeList
- CSS Grid with auto-fit columns
- Loading skeleton animation
- Empty state handling
- Error state with retry

## 🚀 Deployment Ready

- **SSR Support**: Angular Universal included
- **Production Build**: Optimized for deployment
- **Environment Handling**: Runtime environment variables
- **Security**: CSP-compatible, no unsafe practices

## 📈 Bundle Analysis

- **Initial Bundle**: ~93KB gzipped
- **Lazy Chunks**: Route-based splitting
- **CSS Budget**: Optimized component styles
- **Tree Shaking**: Unused code elimination

The Recipe Explorer is a production-ready Angular application that demonstrates modern web development best practices while providing an excellent user experience for recipe discovery and viewing.
