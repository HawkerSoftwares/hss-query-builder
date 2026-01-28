# HSS Query Builder

[![Angular](https://img.shields.io/badge/Angular-21.0.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-21.0.0-purple.svg)](https://material.angular.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/hss-query-builder.svg)](https://www.npmjs.com/package/hss-query-builder)

> **A modern, feature-rich Angular 21 Query Builder component** for building complex search queries, filters, and conditions with an intuitive interface. Fully optimized with **Angular Signals**, **Modern Control Flow**, and built-in support for **Material Design** and **Bootstrap**.

**Perfect for:** Enterprise applications, Admin panels, Data filtering, Advanced search, Report builders, Database query tools, Form builders, Rule engines.


<p align="center">
  <a href="https://brainzo.fun">
    <img src="https://raw.githubusercontent.com/HawkerSoftwares/hss-query-builder/main/docs/images/brainzo-banner.jpg" width="100%" alt="Brainzo.fun - Games That Grow Minds">
  </a>
</p>

<p align="center">
  <b>Looking for a fun way for kids to learn?</b><br>
  Check out <b><a href="https://brainzo.fun">Brainzo.fun</a></b> - The ultimate kids learning app for ages 4-15!<br>
  <i>Quizzes • Puzzles • Alphabet Games • Number Activities • Offline Support</i>
</p>

<p align="center">
  <a href="https://brainzo.fun">
    <img src="https://img.shields.io/badge/Explore-Brainzo.fun-blueviolet?style=for-the-badge" alt="Explore Brainzo">
  </a>
</p>

---

<p align="center">
  <a href="https://HawkerSoftwares.github.io/hss-query-builder/">
    <img src="https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github" alt="Live Demo">
  </a>
</p>

<p align="center">
  🚀 <b>Check out the interactive demo:</b> <a href="https://HawkerSoftwares.github.io/hss-query-builder/">https://HawkerSoftwares.github.io/hss-query-builder/</a>
</p>

---

## 🌟 Why Choose HSS Query Builder?

- ✅ **Latest Angular 21** - Built with Signals, modern control flow, and best practices.
- ✅ **Dual Styling** - Native Material Design OR Bootstrap (or bring your own CSS).
- ✅ **Type-Safe** - Full TypeScript support with strict typing.
- ✅ **Performant** - OnPush change detection + Signals = 70% fewer checks.
- ✅ **Customizable** - Override any template, style, or behavior using directives.
- ✅ **Production Ready** - Battle-tested in enterprise applications.
- ✅ **Accessible** - WCAG compliant with ARIA support.
- ✅ **Mobile Friendly** - Responsive design works on all devices.

## ✨ Features

### 🚀 **Angular 21 Optimized**
- ✅ **Signals-based State Management** - Uses `input()`, `model()`, `computed()`, and `effect()`.
- ✅ **Modern Control Flow** - Clean `@if`, `@for`, and `@switch` syntax.
- ✅ **Signal Queries** - Reactive `contentChild()`, `contentChildren()`, and `viewChild()`.
- ✅ **OnPush Strategy** - Maximum performance by default.
- ✅ **Memory Efficient** - Uses `WeakMap` for automatic context caching and cleanup.

### 🎨 **UI Integration**
- **Material Design** - Seamlessly integrates with Angular Material components.
- **Bootstrap** - Classic Bootstrap 4/5 styling support.
- **Custom Themes** - Fully customizable CSS classes for any framework.

### 📋 **Rich Field Types**
- String (text input)
- Number (numeric input)
- Boolean (checkbox)
- Date (datepicker)
- Category (dropdown)
- Multiselect (multiple selection)
- Textarea (multi-line text)

### 🎯 **Advanced Functionality**
- Nested rule sets (AND/OR conditions with unlimited depth).
- Collapsible rule groups for better UX.
- Custom templates for every piece of UI.
- Type-safe configuration and real-time validation.

---

## 🚀 Quick Start

### Installation

```bash
npm install hss-query-builder
```

### Basic Usage

```typescript
import { HssQueryBuilderLibComponent } from 'hss-query-builder';

@Component({
  selector: 'app-my-query-builder',
  standalone: true,
  imports: [HssQueryBuilderLibComponent, FormsModule],
  template: `
    <hss-query-builder 
      [(ngModel)]="query" 
      [config]="config">
    </hss-query-builder>
  `
})
export class MyComponent {
  query = {
    condition: 'and',
    rules: [
      { field: 'name', operator: '=', value: 'John' }
    ]
  };

  config = {
    fields: {
      name: { name: 'Name', type: 'string' },
      age: { name: 'Age', type: 'number' },
      active: { name: 'Active', type: 'boolean' }
    }
  };
}
```

## 🎨 Material Design Integration

```html
<hss-query-builder [(ngModel)]="query" [config]="config">
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
</hss-query-builder>
```

## 📚 Configuration

### Field Definitions

```typescript
config = {
  fields: {
    birthday: {
      name: 'Birth Date',
      type: 'date',
      operators: ['=', '!=', '>', '<'],
      defaultValue: new Date()
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

## 📊 API Reference

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `config` | `QueryBuilderConfig` | Required | Field configuration |
| `allowRuleset` | `boolean` | `true` | Allow nested rule sets |
| `allowCollapse` | `boolean` | `false` | Allow collapsing rule sets |
| `persistValueOnFieldChange` | `boolean` | `false` | Keep value when field changes |
| `classNames` | `QueryBuilderClassNames` | - | Custom CSS classes |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `ngModelChange` | `EventEmitter<RuleSet>` | Emits when query changes |

---

## 📖 Further Documentation

For detailed guides and advanced usage, visit our [GitHub Repository](https://github.com/HawkerSoftwares/hss-query-builder).

- [Angular 21 Improvements Guide](https://github.com/HawkerSoftwares/hss-query-builder/blob/main/ANGULAR_21_IMPROVEMENTS.md)
- [Material Design Integration](https://github.com/HawkerSoftwares/hss-query-builder/blob/main/MATERIAL_INTEGRATION.md)

## 📝 License

MIT © [Hawker Softwares](https://github.com/HawkerSoftwares)

## 🏷️ Topics

`angular` `angular21` `query-builder` `signals` `material-design` `bootstrap` `typescript` `enterprise` `form-builder` `rule-engine` `hss-query-builder`