# HSS Query Builder - Material Design Demo

### 🌐 [Live Online Demo](https://HawkerSoftwares.github.io/hss-query-builder/)

## 🎨 Features Demonstrated

This demo application showcases the HSS Query Builder library with:

### ✅ Angular 21 Best Practices
- **Signals-based state management** (`input()`, `model()`, `computed()`)
- **Modern Control Flow** (`@if`, `@for`, `@switch`)
- **Signal Queries** (`contentChild()`, `contentChildren()`, `viewChild()`)
- **OnPush Change Detection** for optimal performance
- **inject()** function for dependency injection

### 🎨 Material Design Integration
- Full Angular Material theme integration
- Custom Material components for all input types:
  - `mat-select` for dropdowns
  - `mat-input` for text fields
  - `mat-checkbox` for booleans
  - `mat-datepicker` for dates
  - `mat-radio-group` for AND/OR conditions
  - `mat-icon-button` for actions
  - `mat-card` for layout

### 📋 Supported Field Types
1. **String** - Text input with Material styling
2. **Number** - Numeric input
3. **Boolean** - Checkbox
4. **Date** - Material Datepicker
5. **Category** - Single select dropdown
6. **Multiselect** - Multiple selection dropdown
7. **Textarea** - Multi-line text input

### 🎯 Custom Templates
The demo shows how to customize every part of the query builder:
- **Button Group** - Add/Remove rules and rulesets
- **Arrow Icon** - Collapse/expand indicator
- **Remove Button** - Delete individual rules
- **Switch Group** - AND/OR condition selector
- **Entity Selector** - Entity dropdown (if using entities)
- **Field Selector** - Field dropdown
- **Operator Selector** - Operator dropdown
- **Input Templates** - Custom inputs for each field type

## 🚀 Running the Demo

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser at http://localhost:4200
```

## 📝 Code Examples

### Basic Usage (Default Styling)
```html
<hss-query-builder 
  [(ngModel)]="query" 
  [config]="config">
</hss-query-builder>
```

### Material Design Custom Templates
```html
<hss-query-builder 
  [(ngModel)]="query" 
  [config]="config"
  [allowRuleset]="true"
  [allowCollapse]="true">
  
  <!-- Custom Material Button Group -->
  <ng-container *queryButtonGroup="let ruleset; let addRule=addRule">
    <button mat-icon-button color="primary" (click)="addRule()">
      <mat-icon>add</mat-icon>
    </button>
  </ng-container>

  <!-- Custom Material Field Selector -->
  <ng-container *queryField="let rule; let fields=fields; let onChange=onChange">
    <mat-form-field appearance="outline">
      <mat-label>Field</mat-label>
      <mat-select [(ngModel)]="rule.field" (ngModelChange)="onChange($event, rule)">
        @for (field of fields; track field.value) {
          <mat-option [value]="field.value">{{ field.name }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  </ng-container>

  <!-- More custom templates... -->
</hss-query-builder>
```

### Bootstrap Styling
```html
<hss-query-builder 
  [(ngModel)]="query" 
  [classNames]="bootstrapClassNames" 
  [config]="config">
</hss-query-builder>
```

## 🎨 Theming

The demo includes a custom Material theme in `src/styles.scss`:

```scss
@use '@angular/material' as mat;

$my-primary: mat.define-palette(mat.$indigo-palette);
$my-accent: mat.define-palette(mat.$pink-palette);
$my-theme: mat.define-light-theme((
  color: (primary: $my-primary, accent: $my-accent)
));

@include mat.all-component-themes($my-theme);
```

## 📦 Configuration Example

```typescript
public config: QueryBuilderConfig = {
  fields: {
    name: { 
      name: 'Name', 
      type: 'string',
      operators: ['=', '!=', 'contains', 'like']
    },
    age: { 
      name: 'Age', 
      type: 'number',
      operators: ['=', '!=', '>', '>=', '<', '<=']
    },
    active: { 
      name: 'Active', 
      type: 'boolean'
    },
    gender: {
      name: 'Gender',
      type: 'category',
      options: [
        { name: 'Male', value: 'M' },
        { name: 'Female', value: 'F' }
      ]
    }
  }
};
```

## 🔧 TypeScript Configuration

For Angular 21 with Material, ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ES2022"
  }
}
```

## 📚 Learn More

- [Angular 21 Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [HSS Query Builder Best Practices](../ANGULAR_21_IMPROVEMENTS.md)

## 🎯 Key Takeaways

1. **Fully customizable** - Override any template with your own
2. **Framework agnostic styling** - Works with Material, Bootstrap, or custom CSS
3. **Type-safe** - Full TypeScript support
4. **Modern Angular** - Uses latest Angular 21 features
5. **Performance optimized** - OnPush change detection + Signals
6. **Accessible** - Material components are ARIA compliant

---

**Built with ❤️ using Angular 21 and Angular Material**
