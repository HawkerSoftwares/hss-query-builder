# Angular 21 Best Practices for hss-query-builder

## Modern Patterns & Features

### 1. Using Signals for State Management

Instead of traditional RxJS observables for all state, use Signals for simpler state:

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-my',
  standalone: true
})
export class MyComponent {
  // Simple state with Signals
  count = signal(0);
  name = signal('');
  
  // Computed values (auto memoized)
  displayText = computed(() => `Count: ${this.count()}, Name: ${this.name()}`);
  
  // Side effects
  constructor() {
    effect(() => {
      console.log('Count changed to:', this.count());
    });
  }
  
  increment(): void {
    this.count.update(v => v + 1);
  }
}
```

### 2. New Control Flow Syntax (Angular 21)

```html
<!-- If-Then-Else -->
@if (isLoggedIn()) {
  <p>Welcome {{ userName() }}!</p>
} @else {
  <p>Please log in</p>
}

<!-- For Loop -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items</p>
}

<!-- Switch -->
@switch (status()) {
  @case ('active') {
    <span class="badge-success">Active</span>
  }
  @case ('inactive') {
    <span class="badge-danger">Inactive</span>
  }
  @default {
    <span class="badge-secondary">Unknown</span>
  }
}
```

### 3. Standalone Components Best Practices

```typescript
@Component({
  selector: 'app-feature',
  template: `...`,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Only import what's needed
    MatButtonModule,
    MatInputModule
  ],
  providers: [
    // Component-level providers
    FeatureService
  ]
})
export class FeatureComponent {}
```

### 4. Dependency Injection Improvements

```typescript
import { inject } from '@angular/core';

@Component({...})
export class MyComponent {
  // New inject() approach - more concise
  private service = inject(MyService);
  private route = inject(ActivatedRoute);
  
  constructor() {
    // Old way (still valid but less concise)
    // constructor(private service: MyService) {}
  }
}
```

### 5. Type-Safe Reactive Forms

```typescript
import { FormControl, FormGroup } from '@angular/forms';

interface UserForm {
  name: string;
  email: string;
  age: number;
}

export class UserComponent {
  form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    email: new FormControl<string>(''),
    age: new FormControl<number | null>(null)
  });
}
```

### 6. Async Pipe with Signals

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-data',
  template: `{{ data() }}`,
  standalone: true
})
export class DataComponent {
  data = toSignal(this.http.get('/api/data'));
}
```

### 7. Router with Route-Level Code Splitting

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
  }
];
```

### 8. Unsubscribe Patterns (No More teardown)

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class MyComponent {
  private destroyRef = inject(DestroyRef);
  
  constructor(private service: MyService) {
    this.service.data$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => console.log(data));
    // No need for ngOnDestroy!
  }
}
```

## Query Builder Specific Updates

### Using Signals in Query Builder Component

```typescript
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-query-builder-modern',
  standalone: true
})
export class ModernQueryBuilderComponent {
  // Use signals instead of plain properties
  rules = signal<Rule[]>([]);
  config = signal<QueryBuilderConfig>(defaultConfig);
  isValid = computed(() => this.validateRules(this.rules()));
  
  addRule(rule: Rule): void {
    this.rules.update(existing => [...existing, rule]);
  }
  
  removeRule(index: number): void {
    this.rules.update(existing => existing.filter((_, i) => i !== index));
  }
}
```

## Performance Optimization

### 1. Change Detection Strategy

```typescript
@Component({
  selector: 'app-my',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class OptimizedComponent {
  // Better performance with OnPush strategy
}
```

### 2. Lazy Loading Routes

```typescript
const routes: Routes = [
  {
    path: 'builder',
    loadComponent: () => 
      import('./query-builder/query-builder.component')
        .then(m => m.QueryBuilderComponent)
  }
];
```

### 3. Preloading Strategy

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
});
```

## Testing Improvements

### Component Testing with TestBed

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('QueryBuilderComponent', () => {
  let component: QueryBuilderComponent;
  let fixture: ComponentFixture<QueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryBuilderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QueryBuilderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Signal Testing

```typescript
it('should update count when increment is called', () => {
  const component = TestBed.createComponent(CounterComponent).componentInstance;
  
  expect(component.count()).toBe(0);
  component.increment();
  expect(component.count()).toBe(1);
});
```

## Dependency Tree Analysis

```bash
npm ls
```

This helps identify if any package has peer dependency conflicts or outdated versions.

## Bundle Analysis

```bash
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/hss-query-builder/stats.json
```

## Security Best Practices

1. **DomSanitizer for dynamic HTML**:
```typescript
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

2. **Environment Security**:
- Never commit sensitive data
- Use environment files properly
- Validate user inputs on server-side

## Accessibility (a11y)

```html
<button 
  [attr.aria-label]="'Remove rule ' + index"
  (click)="removeRule(index)">
  Remove
</button>
```

## Documentation Best Practices

1. Add JSDoc comments:
```typescript
/**
 * Validates the query rules
 * @param rules - Array of query rules
 * @returns true if rules are valid
 */
validateRules(rules: Rule[]): boolean {
  // implementation
}
```

2. Keep README updated with migration notes
3. Document breaking changes
4. Provide examples for common use cases
