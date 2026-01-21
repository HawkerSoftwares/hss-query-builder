import { Component } from '@angular/core';
import { QueryBuilderConfig } from 'projects/hss-query-builder-lib/src/lib/components/query-builder.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  public query = {
    condition: 'and',
    rules: [
      { field: 'name', operator: 'like', value: '' }
    ]
  };

  public config: QueryBuilderConfig = {
    fields: {
      name: { name: 'Name', type: 'string' },
      age: { name: 'Age', type: 'number' },
      email: { name: 'Email', type: 'string' },
      active: { name: 'Active', type: 'boolean' }
    }
  };
}
