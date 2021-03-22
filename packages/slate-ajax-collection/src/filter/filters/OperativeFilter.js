import { Filter } from './Filter';

export const OPERATION_AND = "AND";
export const OPERATION_OR = "OR";

export class OperativeFilter extends Filter {
  constructor(template, handle, operation) {
    super(template, handle);

    this.operation = operation || OPERATION_AND;
  }

  setOperation(operation) {
    this.operation = operation;
    this.filters.onFilterUpdate();
  }

  filter(p,v) {
    if(this.operation === OPERATION_AND) return this.filterAnd(p,v);
    if(this.operation === OPERATION_OR) return this.filterOr(p,v);
    return false;
  }

  filterAnd(p,v) { return true; }
  filterOr(p,v) { return true; }
}
