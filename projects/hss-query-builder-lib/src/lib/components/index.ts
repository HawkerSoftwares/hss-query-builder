import { QueryArrowIconDirective } from "./query-arrow-icon.directive";
import { QueryButtonGroupDirective } from "./query-button-group.directive";
import { QueryEmptyWarningDirective } from "./query-empty-warning.directive";
import { QueryEntityDirective } from "./query-entity.directive";
import { QueryFieldDirective } from "./query-field.directive";
import { QueryInputDirective } from "./query-input.directive";
import { QueryOperatorDirective } from "./query-operator.directive";
import { QueryRemoveButtonDirective } from "./query-remove-button.directive";
import { QuerySwitchGroupDirective } from "./query-switch-group.directive";

export const QUERY_BUILDER_COMPONENTS = [
    QueryInputDirective,
    QueryOperatorDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    QueryArrowIconDirective
];

export {
    QueryInputDirective,
    QueryOperatorDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    QueryArrowIconDirective
}