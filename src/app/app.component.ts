import { Component } from '@angular/core';
import { QueryBuilderConfig, QueryBuilderClassNames } from 'projects/hss-query-builder-lib/src/lib/components/query-builder.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  // Separate queries for each example to avoid conflicts
  public queryMaterial = {
    condition: 'and',
    rules: [
      { field: 'name', operator: '=', value: 'John' },
      { field: 'age', operator: '>=', value: 18 }
    ]
  };

  public queryBootstrap = {
    condition: 'and',
    rules: [
      { field: 'name', operator: '=', value: 'John' },
      { field: 'age', operator: '>=', value: 18 }
    ]
  };

  public allowRuleset = true;
  public allowCollapse = true;
  public persistValueOnFieldChange = false;

  // Sync queries when one changes
  onMaterialQueryChange() {
    // Deep clone to trigger change detection
    this.queryBootstrap = JSON.parse(JSON.stringify(this.queryMaterial));
  }

  onBootstrapQueryChange() {
    // Deep clone to trigger change detection
    this.queryMaterial = JSON.parse(JSON.stringify(this.queryBootstrap));
  }

  // Configuration with various field types
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
      email: {
        name: 'Email',
        type: 'string',
        operators: ['=', '!=', 'contains']
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
          { name: 'Female', value: 'F' },
          { name: 'Other', value: 'O' }
        ]
      },
      birthdate: {
        name: 'Birth Date',
        type: 'date'
      },
      skills: {
        name: 'Skills',
        type: 'category',
        options: [
          { name: 'Angular', value: 'angular' },
          { name: 'React', value: 'react' },
          { name: 'Vue', value: 'vue' },
          { name: 'Node.js', value: 'nodejs' },
          { name: 'Python', value: 'python' }
        ]
      },
      notes: {
        name: 'Notes',
        type: 'textarea'
      }
    }
  };

  // Bootstrap class names for second example
  public bootstrapClassNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'px-2',
    switchGroup: 'd-flex px-2',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border',
    ruleSet: 'border',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  };
}
