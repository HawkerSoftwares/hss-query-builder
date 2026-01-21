# Angular 16 to 21 Migration Guide

## Overview
This document outlines the migration of hss-query-builder from Angular 16 to Angular 21 with modern best practices.

## Changes Made

### 1. **Dependencies Update** (package.json)
- ✅ Angular Core: 16.2.0 → 21.0.0
- ✅ Angular Material: 16.2.0 → 21.0.0
- ✅ Angular CDK: 16.2.0 → 21.0.0
- ✅ TypeScript: 5.1.3 → 5.5.0
- ✅ RxJS: 7.8.0 (maintained)
- ✅ zone.js: 0.13.0 → 0.15.0
- ✅ tslib: 2.3.0 → 2.6.0
- ✅ Jasmine: 4.6.0 → 5.2.0

### 2. **TypeScript Configuration** (tsconfig.json)
**Key improvements:**
- ✅ Strict mode enabled (`"strict": true`)
- ✅ Module resolution: "node" → "bundler" (modern standard)
- ✅ Module output: "es2020" → "ES2022"
- ✅ Target: "ES2022" (maintained)
- ✅ Added strict compiler options:
  - `strictNullChecks`
  - `strictFunctionTypes`
  - `strictBindCallApply`
  - `strictDomainProperties`
  - `strictDomainReturns`
- ✅ Removed `downlevelIteration` (no longer needed)
- ✅ Template strict mode enabled in Angular compiler options
- ✅ Declaration maps enabled for better IDE support

### 3. **Bootstrap Configuration** (main.ts)
**Standalone API adoption:**
```typescript
// Before (Angular 16)
platformBrowserDynamic().bootstrapModule(AppModule)

// After (Angular 21)
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes)
  ]
})
```

### 4. **Application Component** (app.component.ts)
**Modernized with latest features:**
- ✅ Standalone component (`standalone: true`)
- ✅ Signals API usage for state management (`signal()`)
- ✅ Direct imports instead of module-based
- ✅ Improved type safety with strict types
- ✅ Modern property binding patterns

### 5. **Library Module** (hss-query-builder-lib.module.ts)
- ✅ Added deprecation notice for module usage
- ✅ Recommended migration path documented
- ✅ Can be used in standalone context via `provideHssQueryBuilder()`
- ✅ Added ReactiveFormsModule for reactive patterns

### 6. **Build Configuration** (angular.json)
**Optimizations:**
- ✅ Added explicit optimization flags
- ✅ Improved production build settings
- ✅ Better development vs. production configurations
- ✅ Updated builder strategies for Angular 21

### 7. **Library tsconfig** (tsconfig.lib.json)
- ✅ Strict mode enabled
- ✅ Compilation mode: "partial" → "full" (production)
- ✅ Declaration maps enabled
- ✅ Better tree-shaking support
- ✅ Template strict checking enabled

### 8. **Code Quality Configuration**
- ✅ Added .prettierrc for consistent formatting
- ✅ Added EditorConfig support
- ✅ Added prettier script to package.json

## Installation & Build

### Install Dependencies
```bash
npm install
```

### Build Library
```bash
npm run build:lib
```

### Run Development Server
```bash
npm start
```

### Format Code
```bash
npm run format
```

## Breaking Changes & Migration Notes

### 1. **Standalone Components**
The main application now uses standalone components. If you have other components:
```typescript
// Old way (NgModule)
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule]
})

// New way (Standalone)
@Component({
  selector: 'app-my',
  standalone: true,
  imports: [CommonModule]
})
```

### 2. **Router Setup**
Routes are now configured in `app.routes.ts`:
```typescript
export const routes: Routes = [
  // Define your routes here
];
```

### 3. **Dependency Injection**
Use functional providers in `bootstrapApplication`:
```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    // Add other providers here
  ]
})
```

### 4. **Strict Mode**
Strict TypeScript mode is now enabled. You may need to:
- Add proper type annotations to functions
- Handle potential null/undefined values
- Use non-null assertion (!) sparingly

### 5. **Signals API** (Optional but Recommended)
For state management, consider using Signals:
```typescript
import { signal, computed, effect } from '@angular/core';

export class MyComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);
  
  constructor() {
    effect(() => console.log(`Count: ${this.count()}`));
  }
}
```

### 6. **Control Flow** (Angular 21 Feature)
Replace *ngIf with new control flow:
```html
<!-- Old -->
<div *ngIf="condition">Content</div>

<!-- New -->
@if (condition) {
  <div>Content</div>
}
```

## Testing
Run tests to ensure everything works:
```bash
npm test
```

## Performance Improvements

1. **Better Tree-Shaking**: ES2022 modules + bundler resolution
2. **Improved Change Detection**: Modern Angular 21 optimizations
3. **Smaller Bundle Size**: Modern transpilation targets
4. **Better IDE Support**: Declaration maps enabled
5. **Faster Builds**: Updated compilation strategies

## Resources

- [Angular 21 Release Notes](https://angular.io/guide/update-to-latest-version)
- [Standalone Components](https://angular.io/guide/standalone-components)
- [Signals API](https://angular.io/guide/signals)
- [Angular Router Guide](https://angular.io/guide/router)

## Next Steps

1. Test the application thoroughly
2. Update any custom components to use standalone API
3. Consider migrating to Signals for state management
4. Update e2e tests if applicable
5. Run lighthouse audit for performance metrics
