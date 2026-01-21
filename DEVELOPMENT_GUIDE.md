# Development Guide - Angular 21

## Environment Setup

### System Requirements
- **Node.js**: 18.19.0 or higher
- **npm**: 9.0.0 or higher
- **OS**: Windows, macOS, or Linux

### Verify Installation
```bash
node --version      # Should be v18+
npm --version       # Should be 9.0+
ng version         # Should show Angular 21
```

---

## Quick Start

### 1. First Time Setup
```bash
# Clone the repository
git clone <repository-url>
cd hss-query-builder

# Install dependencies
npm install

# Verify installation
npm run build:lib

# Start development
npm start
```

### 2. Common Development Tasks

#### Build Library
```bash
npm run build:lib
# Output: dist/hss-query-builder-lib/
```

#### Development Server
```bash
npm start
# Opens http://localhost:4200
```

#### Format Code
```bash
npm run format
# Formats all TypeScript files with Prettier
```

#### Run Tests
```bash
npm test
# Watches for changes and re-runs tests
```

#### Production Build
```bash
ng build --configuration production
```

---

## Project Structure

```
hss-query-builder/
├── src/                               # Application
│   ├── main.ts                       # Bootstrap file
│   ├── index.html                    # Entry point
│   ├── styles.scss                   # Global styles
│   └── app/
│       ├── app.component.*           # Root component (standalone)
│       ├── app.routes.ts             # Route configuration
│       └── ...other app components
│
├── projects/hss-query-builder-lib/   # Library package
│   ├── ng-package.json               # ng-packagr config
│   ├── tsconfig.lib.json             # Library TypeScript config
│   └── src/
│       ├── public-api.ts             # Exports
│       └── lib/
│           ├── hss-query-builder-lib.component.ts
│           ├── hss-query-builder-lib.module.ts
│           ├── hss-query-builder-lib.service.ts
│           └── components/           # UI Components
│
├── dist/                              # Build output
├── angular.json                       # Angular CLI config
├── tsconfig.json                      # TypeScript config
├── package.json                       # Dependencies
└── karma.conf.js                      # Test configuration
```

---

## Writing Components

### Modern Standalone Component (Recommended)

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-feature',
  template: `
    <div>
      <h2>{{ title() }}</h2>
      <button mat-raised-button (click)="increment()">
        Count: {{ count() }}
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class FeatureComponent {
  private fb = inject(FormBuilder);
  
  // State management with Signals
  count = signal(0);
  title = signal('My Feature');
  
  // Computed values
  countText = computed(() => `Count: ${this.count()}`);
  
  increment(): void {
    this.count.update(v => v + 1);
  }
}
```

### Traditional NgModule Component (Legacy)

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MyComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [MyComponent]
})
export class MyModule {}
```

---

## Form Handling

### Reactive Forms (Recommended)

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name">
      @if (form.get('name')?.hasError('required')) {
        <span>Name is required</span>
      }
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FormComponent {
  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

### Template Driven Forms (Simple Cases)

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-simple-form',
  template: `
    <input [(ngModel)]="name" placeholder="Enter name">
    <p>{{ name }}</p>
  `,
  standalone: true,
  imports: [FormsModule]
})
export class SimpleFormComponent {
  name = '';
}
```

---

## Routing

### Setup in main.ts
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
```

### Define Routes (app.routes.ts)
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => 
      import('./pages/home/home.component')
        .then(m => m.HomeComponent)
  },
  {
    path: 'builder',
    loadComponent: () =>
      import('./pages/builder/builder.component')
        .then(m => m.BuilderComponent)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
```

### Navigation in Components
```typescript
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  template: `
    <button (click)="navigate('/home')">Home</button>
    <button [routerLink]="['/builder']">Builder</button>
  `,
  standalone: true,
  imports: [RouterLink]
})
export class NavComponent {
  private router = inject(Router);
  
  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
```

---

## Dependency Injection

### Inject Pattern (Recommended)

```typescript
import { Component, inject } from '@angular/core';
import { MyService } from './my.service';

@Component({
  selector: 'app-example',
  standalone: true
})
export class ExampleComponent {
  // New inject() approach
  private service = inject(MyService);
  private route = inject(ActivatedRoute);
  
  data$ = this.service.getData();
}
```

### Constructor Injection (Traditional)

```typescript
export class ExampleComponent {
  constructor(
    private service: MyService,
    private route: ActivatedRoute
  ) {}
}
```

---

## HTTP Requests

### Setup in main.ts
```typescript
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
});
```

### Service Example
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

interface User {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/users';
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }
  
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }
  
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }
}
```

### Using in Component with Signals
```typescript
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule]
})
export class UsersComponent {
  private userService = inject(UserService);
  
  // Convert Observable to Signal
  users = toSignal(this.userService.getUsers());
  
  // Handle loading and error states
  isLoading = computed(() => this.users.loading);
  error = computed(() => this.users.error);
}
```

---

## RxJS & Observables

### Common Patterns

```typescript
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-example'
})
export class ExampleComponent {
  private service = inject(MyService);
  private destroyRef = inject(DestroyRef);
  
  ngOnInit(): void {
    // Auto unsubscribe on destroy
    this.service.data$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        console.log(data);
      });
  }
}
```

---

## Testing

### Component Test Example

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should update count when increment is called', () => {
    component.increment();
    expect(component.count()).toBe(1);
  });
});
```

### Service Test Example

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'John' }];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
    
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

---

## Performance Optimization

### 1. OnPush Change Detection
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class OptimizedComponent {}
```

### 2. Lazy Loading
```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => 
      import('./admin/admin.routes')
        .then(m => m.ADMIN_ROUTES)
  }
];
```

### 3. TrackBy in *ngFor
```typescript
@Component({
  template: `
    @for (item of items(); track trackBy($index, item)) {
      <div>{{ item.name }}</div>
    }
  `
})
export class ListComponent {
  items = signal([...]);
  
  trackBy(index: number, item: any): any {
    return item.id;
  }
}
```

---

## Debugging

### Browser DevTools

1. **Open Developer Tools**: F12 or Right-click > Inspect
2. **Angular DevTools Extension**: Recommended for production debugging
3. **Console Tab**: Check for errors and warnings
4. **Network Tab**: Monitor API calls

### VS Code Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMap": true
    }
  ]
}
```

---

## Common Issues & Solutions

### Issue: Module not found errors
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 4200 already in use
```bash
# Solution: Use different port
ng serve --port 4300
```

### Issue: Tests failing
```bash
# Solution: Clear cache and rebuild
ng test --browsers=Chrome --watch=false
```

### Issue: Build fails with type errors
```bash
# Solution: Check strict mode is valid
# Review tsconfig.json, fix type annotations
npm run format
```

---

## Git Workflow

### Feature Development
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request
```

### Code Review Checklist
- [ ] Follows ESLint/Prettier rules
- [ ] Tests are added/updated
- [ ] Type errors resolved
- [ ] No console warnings
- [ ] Documentation updated

---

## Useful Commands Reference

```bash
# Development
npm start                          # Start dev server
npm run build:lib                  # Build library
npm test                           # Run tests
npm run format                     # Format code

# Building
ng build --configuration=production
ng build --stats-json              # Generate stats

# Analysis
npm ls                             # List dependencies
npm outdated                       # Check for updates
npm audit                          # Security audit

# Cleanup
npm cache clean --force
rm -rf dist node_modules
npm install

# Version Management
npm version patch                  # Bump patch version
npm version minor                  # Bump minor version
npm version major                  # Bump major version
```

---

## Resources

- [Angular Documentation](https://angular.io)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [RxJS Documentation](https://rxjs.dev)
- [Material Components](https://material.angular.io)
- [Angular Best Practices](https://angular.io/guide/styleguide)

---

**Last Updated**: January 21, 2026  
**Angular Version**: 21.0.0  
**TypeScript Version**: 5.5.0
