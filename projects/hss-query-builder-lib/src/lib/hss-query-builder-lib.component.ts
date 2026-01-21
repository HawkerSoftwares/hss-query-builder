import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  ButtonGroupContext,
  Entity,
  Field,
  SwitchGroupContext,
  EntityContext,
  FieldContext,
  InputContext,
  LocalRuleMeta,
  OperatorContext,
  Option,
  QueryBuilderClassNames,
  QueryBuilderConfig,
  RemoveButtonContext,
  ArrowIconContext,
  Rule,
  RuleSet,
  EmptyWarningContext,
} from './components/query-builder.interfaces';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  forwardRef,
  inject,
  input,
  model,
  computed,
  effect,
  signal,
  contentChild,
  contentChildren,
  Input,
  TemplateRef,
  QueryList,
  viewChild
} from '@angular/core';
import {
  QueryInputDirective,
  QueryOperatorDirective,
  QueryFieldDirective,
  QueryEntityDirective,
  QueryButtonGroupDirective,
  QuerySwitchGroupDirective,
  QueryRemoveButtonDirective,
  QueryEmptyWarningDirective,
  QueryArrowIconDirective,
  QUERY_BUILDER_COMPONENTS
} from './components';
import { CommonModule } from '@angular/common';

export const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HssQueryBuilderLibComponent),
  multi: true
} as const;

export const VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => HssQueryBuilderLibComponent),
  multi: true
} as const;

@Component({
  selector: 'hss-query-builder',
  templateUrl: './hss-query-builder-lib.component.html',
  styleUrls: ['./hss-query-builder-lib.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QUERY_BUILDER_COMPONENTS
  ],
  providers: [CONTROL_VALUE_ACCESSOR, VALIDATOR]
})
export class HssQueryBuilderLibComponent implements ControlValueAccessor, Validator {
  // Signals
  public disabled = input(false);

  // Internal disable state for CVA
  private _disabledCVA = signal(false);
  public isDisabled = computed(() => this.disabled() || this._disabledCVA());

  public data = model<RuleSet>({ condition: 'and', rules: [] });
  public allowRuleset = input(true);
  public allowCollapse = input(false);
  public emptyMessage = input('A ruleset cannot be empty. Please add a rule or remove it all together.');
  public classNames = input<QueryBuilderClassNames>();
  public operatorMap = input<{ [key: string]: string[] }>();
  public parentValue = input<RuleSet>();
  public config = input<QueryBuilderConfig>({ fields: {} });

  public parentArrowIconTemplate = input<QueryArrowIconDirective>();
  public parentInputTemplates = input<Array<QueryInputDirective>>(); // QueryList usually passed as array or generic iterable
  public parentOperatorTemplate = input<QueryOperatorDirective>();
  public parentFieldTemplate = input<QueryFieldDirective>();
  public parentEntityTemplate = input<QueryEntityDirective>();
  public parentSwitchGroupTemplate = input<QuerySwitchGroupDirective>();
  public parentButtonGroupTemplate = input<QueryButtonGroupDirective>();
  public parentRemoveButtonTemplate = input<QueryRemoveButtonDirective>();
  public parentEmptyWarningTemplate = input<QueryEmptyWarningDirective>();

  public parentChangeCallback = input<() => void>();
  public parentTouchedCallback = input<() => void>();
  public persistValueOnFieldChange = input(false);

  // Content Queries using Signals
  buttonGroupTemplate = contentChild(QueryButtonGroupDirective);
  switchGroupTemplate = contentChild(QuerySwitchGroupDirective);
  fieldTemplate = contentChild(QueryFieldDirective);
  entityTemplate = contentChild(QueryEntityDirective);
  operatorTemplate = contentChild(QueryOperatorDirective);
  removeButtonTemplate = contentChild(QueryRemoveButtonDirective);
  emptyWarningTemplate = contentChild(QueryEmptyWarningDirective);
  arrowIconTemplate = contentChild(QueryArrowIconDirective);
  inputTemplates = contentChildren(QueryInputDirective);

  // Signal-based ViewChild
  treeContainer = viewChild<ElementRef>('treeContainer');

  // Derived State
  public fields = computed(() => {
    const config = this.config();
    if (typeof config === 'object' && config.fields) {
      return Object.keys(config.fields).map((value) => {
        const field = config.fields[value];
        field.value = field.value || value;
        return field;
      });
    }
    return [];
  });

  public entities = computed(() => {
    const config = this.config();
    if (typeof config === 'object' && config.entities) {
      return Object.keys(config.entities).map((value) => {
        const entity = (config.entities || {})[value];
        entity.value = entity.value || value;
        return entity;
      });
    }
    return null;
  });

  public defaultClassNames: QueryBuilderClassNames = {
    arrowIconButton: 'q-arrow-icon-button',
    arrowIcon: 'q-icon q-arrow-icon',
    removeIcon: 'q-icon q-remove-icon',
    addIcon: 'q-icon q-add-icon',
    button: 'q-button',
    buttonGroup: 'q-button-group',
    removeButton: 'q-remove-button',
    switchGroup: 'q-switch-group',
    switchLabel: 'q-switch-label',
    switchRadio: 'q-switch-radio',
    rightAlign: 'q-right-align',
    transition: 'q-transition',
    collapsed: 'q-collapsed',
    treeContainer: 'q-tree-container',
    tree: 'q-tree',
    row: 'q-row',
    connector: 'q-connector',
    rule: 'q-rule',
    ruleSet: 'q-ruleset',
    invalidRuleSet: 'q-invalid-ruleset',
    emptyWarning: 'q-empty-warning',
    fieldControl: 'q-field-control',
    fieldControlSize: 'q-control-size',
    entityControl: 'q-entity-control',
    entityControlSize: 'q-control-size',
    operatorControl: 'q-operator-control',
    operatorControlSize: 'q-control-size',
    inputControl: 'q-input-control',
    inputControlSize: 'q-control-size'
  };
  public defaultOperatorMap: { [key: string]: string[] } = {
    string: ['=', '!=', 'contains', 'like'],
    number: ['=', '!=', '>', '>=', '<', '<='],
    time: ['=', '!=', '>', '>=', '<', '<='],
    date: ['=', '!=', '>', '>=', '<', '<='],
    category: ['=', '!=', 'in', 'not in'],
    boolean: ['=']
  };

  public onChangeCallback: ((value: RuleSet) => void) | null = null;
  public onTouchedCallback: (() => void) | null = null;

  private readonly defaultTemplateTypes: string[] = ['string', 'number', 'time', 'date', 'category', 'boolean', 'multiselect'];
  private readonly defaultPersistValueTypes: string[] = ['string', 'number', 'time', 'date', 'boolean'];
  private readonly defaultEmptyList: any[] = [];

  private operatorsCache: { [key: string]: string[] } = {};

  // Use WeakMap for better memory optimization with objects
  private inputContextCache = new WeakMap<Rule, InputContext>();
  private operatorContextCache = new WeakMap<Rule, OperatorContext>();
  private fieldContextCache = new WeakMap<Rule, FieldContext>();
  private entityContextCache = new WeakMap<Rule, EntityContext>();
  private removeButtonContextCache = new WeakMap<Rule, RemoveButtonContext>();
  private buttonGroupContext!: ButtonGroupContext;

  private changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    // Effect to clear cache when config changes
    effect(() => {
      this.config();
      this.operatorsCache = {};
    });
  }

  // ----------Validator Implementation----------

  validate(control: AbstractControl): ValidationErrors | null {
    const errors: ValidationErrors = {};
    const ruleErrorStore: any[] = [];
    const config = this.config();
    const data = this.data();

    if (!config.allowEmptyRulesets && this.checkEmptyRuleInRuleset(data)) {
      errors['empty'] = this.emptyMessage();
    }

    this.validateRulesInRuleset(data, ruleErrorStore);

    if (ruleErrorStore.length > 0) {
      errors['rules'] = ruleErrorStore;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // ----------ControlValueAccessor Implementation----------

  @Input()
  get value(): RuleSet {
    return this.data();
  }
  set value(value: RuleSet) {
    this.data.set(value || { condition: 'and', rules: [] });
    this.handleDataChange();
  }

  writeValue(obj: RuleSet | null): void {
    this.data.set(obj || { condition: 'and', rules: [] });
  }
  registerOnChange(fn: (value: RuleSet) => void): void {
    this.onChangeCallback = () => fn(this.data());
  }
  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this._disabledCVA.set(isDisabled);
    this.changeDetectorRef.markForCheck();
  }

  // ----------Methods----------

  getDisabledState = (): boolean => {
    return this.isDisabled();
  }

  findTemplateForRule(rule: Rule): any {
    const type = this.getInputType(rule.field, (rule.operator || ''));
    if (type) {
      const queryInput = this.findQueryInput(type);
      if (queryInput) {
        return queryInput.template;
      } else {
        if (this.defaultTemplateTypes.indexOf(type) === -1) {
          console.warn(`Could not find template for field with type: ${type}`);
        }
        return null;
      }
    }
  }

  findQueryInput(type: string): QueryInputDirective | undefined {
    const templates = this.parentInputTemplates() || this.inputTemplates();
    return (templates as any).find((item: QueryInputDirective) => item.queryInputType === type);
  }

  getOperators(field: string): string[] {
    if (this.operatorsCache[field]) {
      return this.operatorsCache[field];
    }
    let operators = this.defaultEmptyList;
    const config = this.config();
    const fieldObject = config.fields[field];

    if (config.getOperators && fieldObject) {
      return config.getOperators(field, fieldObject);
    }

    const type = fieldObject.type;

    if (fieldObject && fieldObject.operators) {
      operators = fieldObject.operators;
    } else if (type) {
      const operatorMap = this.operatorMap() || this.defaultOperatorMap;
      operators = (operatorMap && operatorMap[type]) || this.defaultEmptyList;
      if (operators.length === 0) {
        console.warn(
          `No operators found for field '${field}' with type ${fieldObject.type}. ` +
          `Please define an 'operators' property on the field or use the 'operatorMap' binding to fix this.`);
      }
      if (fieldObject.nullable) {
        operators = operators.concat(['is null', 'is not null']);
      }
    } else {
      console.warn(`No 'type' property found on field: '${field}'`);
    }

    this.operatorsCache[field] = operators;
    return operators;
  }

  getFields(entity: string): Field[] {
    const entities = this.entities();
    const fields = this.fields();
    if (entities && entity) {
      return fields.filter((field) => {
        return field && field.entity === entity;
      });
    } else {
      return fields;
    }
  }

  getInputType(field: string, operator: string): string {
    const config = this.config();
    if (config.getInputType) {
      return config.getInputType(field, operator);
    }

    if (!config.fields[field]) {
      throw new Error(`No configuration for field '${field}' could be found! Please add it to config.fields.`);
    }

    const type = config.fields[field].type;
    switch (operator) {
      case 'is null':
      case 'is not null':
        return '';  // No displayed component
      case 'in':
      case 'not in':
        return type === 'category' || type === 'boolean' ? 'multiselect' : type;
      default:
        return type;
    }
  }

  getOptions(field: string): Option[] {
    const config = this.config();
    if (config.getOptions) {
      return config.getOptions(field);
    }
    return config.fields[field].options || this.defaultEmptyList;
  }

  getClassNames(...args: string[]): string {
    const defaultClassNames: any = this.defaultClassNames;
    const clsLookup: any = this.classNames() ? this.classNames()! : defaultClassNames;
    const classNames = args.map((id: string) => clsLookup[id] || defaultClassNames[id]).filter((c) => !!c);
    return classNames.length ? classNames.join(' ') : '';
  }

  getDefaultField(entity: Entity): Field | null {
    if (!entity) {
      return null;
    } else if (entity.defaultField !== undefined) {
      return this.getDefaultValue(entity.defaultField);
    } else {
      const entityFields = this.fields().filter((field) => {
        return field && field.entity === entity.value;
      });
      if (entityFields && entityFields.length) {
        return entityFields[0];
      } else {
        console.warn(`No fields found for entity '${entity.name}'. ` +
          `A 'defaultOperator' is also not specified on the field config. Operator value will default to null.`);
        return null;
      }
    }
  }

  getDefaultOperator(field: Field): string {
    if (field && field.defaultOperator !== undefined) {
      return this.getDefaultValue(field.defaultOperator);
    } else {
      const operators = this.getOperators(field.value || '');
      if (operators && operators.length) {
        return operators[0];
      } else {
        console.warn(`No operators found for field '${field.value}'. ` +
          `A 'defaultOperator' is also not specified on the field config. Operator value will default to null.`);
        return '';
      }
    }
  }

  addRule(parent?: RuleSet): void {
    if (this.isDisabled()) {
      return;
    }

    const config = this.config();
    parent = parent || this.data();
    if (config.addRule) {
      config.addRule(parent);
    } else {
      const field = this.fields()[0];
      parent.rules = parent.rules.concat([{
        field: field.value || '',
        operator: this.getDefaultOperator(field),
        value: this.getDefaultValue(field.defaultValue),
        entity: field.entity
      }]);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  removeRule(rule: Rule, parent?: RuleSet): void {
    if (this.isDisabled()) {
      return;
    }

    const config = this.config();
    parent = parent || this.data();
    if (config.removeRule) {
      config.removeRule(rule, parent);
    } else {
      parent.rules = parent.rules.filter((r) => r !== rule);
    }

    // Clear caches
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.removeButtonContextCache.delete(rule);

    this.handleTouched();
    this.handleDataChange();
  }

  addRuleSet(parent?: RuleSet): void {
    if (this.isDisabled()) {
      return;
    }

    const config = this.config();
    parent = parent || this.data();
    if (config.addRuleSet) {
      config.addRuleSet(parent);
    } else {
      parent.rules = parent.rules.concat([{ condition: 'and', rules: [] }]);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  removeRuleSet(ruleset?: RuleSet, parent?: RuleSet): void {
    if (this.isDisabled()) {
      return;
    }

    const config = this.config();
    ruleset = ruleset || this.data();
    parent = parent || this.parentValue();
    if (config.removeRuleSet && parent) {
      config.removeRuleSet(ruleset, parent);
    } else if (parent) {
      parent.rules = parent.rules.filter((r) => r !== ruleset);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  transitionEnd(e: Event): void {
    const treeContainer = this.treeContainer();
    if (treeContainer && treeContainer.nativeElement) {
      treeContainer.nativeElement.style.maxHeight = null;
    }
  }

  toggleCollapse(): void {
    this.computedTreeContainerHeight();
    setTimeout(() => {
      const data = this.data();
      data.collapsed = !data.collapsed;
      // Mutating data in place, triggering change detection due to OnPush
      this.changeDetectorRef.markForCheck();
    }, 100);
  }

  computedTreeContainerHeight(): void {
    const treeContainer = this.treeContainer();
    if (treeContainer) {
      const nativeElement: HTMLElement = treeContainer.nativeElement;
      if (nativeElement && nativeElement.firstElementChild) {
        nativeElement.style.maxHeight = (nativeElement.firstElementChild.clientHeight + 8) + 'px';
      }
    }
  }

  changeCondition(value: string): void {
    if (this.isDisabled()) {
      return;
    }

    this.data().condition = value;
    this.handleTouched();
    this.handleDataChange();
  }

  changeOperator(rule: Rule): void {
    if (this.isDisabled()) {
      return;
    }

    const config = this.config();
    if (config.coerceValueForOperator) {
      rule.value = config.coerceValueForOperator(rule.operator || '', rule.value, rule);
    } else {
      rule.value = this.coerceValueForOperator(rule.operator || '', rule.value, rule);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  coerceValueForOperator(operator: string, value: any, rule: Rule): any {
    const inputType: string = this.getInputType(rule.field, operator);
    if (inputType === 'multiselect' && !Array.isArray(value) && value) {
      return [value];
    }
    return value;
  }

  changeInput(): void {
    if (this.isDisabled()) {
      return;
    }

    this.handleTouched();
    this.handleDataChange();
  }

  changeField(fieldValue: string, rule: Rule): void {
    if (this.isDisabled()) {
      return;
    }

    const inputContext = this.inputContextCache.get(rule);
    const currentField: any = inputContext && inputContext.field;

    const config = this.config();
    const nextField: Field = config.fields[fieldValue];

    const nextValue = this.calculateFieldChangeValue(
      currentField, nextField, rule.value);

    if (nextValue !== undefined) {
      rule.value = nextValue;
    } else {
      delete rule.value;
    }

    rule.operator = this.getDefaultOperator(nextField);

    // Create new context objects so templates will automatically update
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.getInputContext(rule);
    this.getFieldContext(rule);
    this.getOperatorContext(rule);
    this.getEntityContext(rule);

    this.handleTouched();
    this.handleDataChange();
  }

  changeEntity(entityValue: string, rule: Rule, index: number, data: RuleSet): void {
    if (this.isDisabled()) {
      return;
    }
    let i = index;
    let rs = data;
    const entity = (this.entities() || []).find((e) => e.value === entityValue);
    if (entity) {
      const defaultField = this.getDefaultField(entity);
      if (!rs) {
        rs = this.data();
        i = rs.rules.findIndex((x) => x === rule);
      }
      if (defaultField) {
        rule.field = defaultField.value || '';
        rs.rules[i] = rule;
        this.changeField(defaultField.value || '', rule);
      } else {
        this.handleTouched();
        this.handleDataChange();
      }
    }
  }

  getDefaultValue(defaultValue: any): any {
    switch (typeof defaultValue) {
      case 'function':
        return defaultValue();
      default:
        return defaultValue;
    }
  }

  getOperatorTemplate(): TemplateRef<any> | null {
    const t = this.parentOperatorTemplate() || this.operatorTemplate();
    return t ? t.template : null;
  }

  getFieldTemplate(): TemplateRef<any> | null {
    const t = this.parentFieldTemplate() || this.fieldTemplate();
    return t ? t.template : null;
  }

  getEntityTemplate(): TemplateRef<any> | null {
    const t = this.parentEntityTemplate() || this.entityTemplate();
    return t ? t.template : null;
  }

  getArrowIconTemplate(): TemplateRef<any> | null {
    const t = this.parentArrowIconTemplate() || this.arrowIconTemplate();
    return t ? t.template : null;
  }

  getButtonGroupTemplate(): TemplateRef<any> | null {
    const t = this.parentButtonGroupTemplate() || this.buttonGroupTemplate();
    return t ? t.template : null;
  }

  getSwitchGroupTemplate(): TemplateRef<any> | null {
    const t = this.parentSwitchGroupTemplate() || this.switchGroupTemplate();
    return t ? t.template : null;
  }

  getRemoveButtonTemplate(): TemplateRef<any> | null {
    const t = this.parentRemoveButtonTemplate() || this.removeButtonTemplate();
    return t ? t.template : null;
  }

  getEmptyWarningTemplate(): TemplateRef<any> | null {
    const t = this.parentEmptyWarningTemplate() || this.emptyWarningTemplate();
    return t ? t.template : null;
  }

  getQueryItemClassName(local: LocalRuleMeta): string {
    let cls = this.getClassNames('row', 'connector', 'transition');
    cls += ' ' + this.getClassNames(local.ruleset ? 'ruleSet' : 'rule');
    if (local.invalid) {
      cls += ' ' + this.getClassNames('invalidRuleSet');
    }
    return cls;
  }

  getButtonGroupContext(): ButtonGroupContext {
    if (!this.buttonGroupContext) {
      this.buttonGroupContext = {
        addRule: this.addRule.bind(this),
        addRuleSet: this.addRuleSet.bind(this),
        removeRuleSet: this.removeRuleSet.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: this.data()
      };
    }
    return this.buttonGroupContext;
  }

  getRemoveButtonContext(rule: Rule): RemoveButtonContext {
    if (!this.removeButtonContextCache.has(rule)) {
      this.removeButtonContextCache.set(rule, {
        removeRule: this.removeRule.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: rule
      });
    }
    return this.removeButtonContextCache.get(rule)!;
  }

  getFieldContext(rule: Rule): FieldContext {
    if (!this.fieldContextCache.has(rule)) {
      this.fieldContextCache.set(rule, {
        onChange: this.changeField.bind(this),
        getFields: this.getFields.bind(this),
        getDisabledState: this.getDisabledState,
        fields: this.fields(),
        $implicit: rule
      });
    }
    return this.fieldContextCache.get(rule)!;
  }

  getEntityContext(rule: Rule): EntityContext {
    if (!this.entityContextCache.has(rule)) {
      this.entityContextCache.set(rule, {
        onChange: this.changeEntity.bind(this),
        getDisabledState: this.getDisabledState,
        entities: this.entities() || [],
        $implicit: rule
      });
    }
    return this.entityContextCache.get(rule)!;
  }

  getSwitchGroupContext(): SwitchGroupContext {
    return {
      onChange: this.changeCondition.bind(this),
      getDisabledState: this.getDisabledState,
      $implicit: this.data()
    };
  }

  getArrowIconContext(): ArrowIconContext {
    return {
      getDisabledState: this.getDisabledState,
      $implicit: this.data()
    };
  }

  getEmptyWarningContext(): EmptyWarningContext {
    return {
      getDisabledState: this.getDisabledState,
      message: this.emptyMessage(),
      $implicit: this.data()
    };
  }

  getOperatorContext(rule: Rule): OperatorContext {
    if (!this.operatorContextCache.has(rule)) {
      this.operatorContextCache.set(rule, {
        onChange: this.changeOperator.bind(this),
        getDisabledState: this.getDisabledState,
        operators: this.getOperators(rule.field),
        $implicit: rule
      });
    }
    return this.operatorContextCache.get(rule)!;
  }

  getInputContext(rule: Rule): InputContext {
    if (!this.inputContextCache.has(rule)) {
      this.inputContextCache.set(rule, {
        onChange: this.changeInput.bind(this),
        getDisabledState: this.getDisabledState,
        options: this.getOptions(rule.field),
        field: this.config().fields[rule.field],
        $implicit: rule
      });
    }
    return this.inputContextCache.get(rule)!;
  }

  private calculateFieldChangeValue(
    currentField: Field,
    nextField: Field,
    currentValue: any
  ): any {

    const config = this.config();
    if (config.calculateFieldChangeValue != null) {
      return config.calculateFieldChangeValue(
        currentField, nextField, currentValue);
    }

    const canKeepValue = () => {
      if (currentField == null || nextField == null) {
        return false;
      }
      return currentField.type === nextField.type
        && this.defaultPersistValueTypes.indexOf(currentField.type) !== -1;
    };

    if (this.persistValueOnFieldChange() && canKeepValue()) {
      return currentValue;
    }

    if (nextField && nextField.defaultValue !== undefined) {
      return this.getDefaultValue(nextField.defaultValue);
    }

    return undefined;
  }

  private checkEmptyRuleInRuleset(ruleset: RuleSet): boolean {
    if (!ruleset || !ruleset.rules || ruleset.rules.length === 0) {
      return true;
    } else {
      return ruleset.rules.some((item: RuleSet | Rule) => {
        if ((item as RuleSet).rules) {
          return this.checkEmptyRuleInRuleset(item as RuleSet);
        } else {
          return false;
        }
      });
    }
  }

  private validateRulesInRuleset(ruleset: RuleSet, errorStore: any[]) {
    if (ruleset && ruleset.rules && ruleset.rules.length > 0) {
      ruleset.rules.forEach((item) => {
        if ((item as RuleSet).rules) {
          return this.validateRulesInRuleset(item as RuleSet, errorStore);
        } else if ((item as Rule).field) {
          const config = this.config();
          const field = config.fields[(item as Rule).field];
          if (field && field.validator) {
            const error = field.validator((item as Rule), ruleset);
            if (error != null) {
              errorStore.push(error);
            }
          }
        }
      });
    }
  }

  handleDataChange(): void {
    const data = this.data();
    this.changeDetectorRef.markForCheck();
    if (this.onChangeCallback) {
      this.onChangeCallback(data);
    }
    const parentChange = this.parentChangeCallback();
    if (parentChange) {
      parentChange();
    }
  }

  handleTouched(): void {
    if (this.onTouchedCallback) {
      this.onTouchedCallback();
    }
    const parentTouched = this.parentTouchedCallback();
    if (parentTouched) {
      parentTouched();
    }
  }
}
