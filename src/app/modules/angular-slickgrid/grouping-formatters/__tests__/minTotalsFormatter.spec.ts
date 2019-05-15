import { Column } from '../../models';
import { minTotalsFormatter } from '../minTotalsFormatter';

describe('minTotalsFormatter', () => {
  it('should display an empty string when no value is provided', () => {
    const output = minTotalsFormatter({}, {} as Column);
    expect(output).toBe('');
  });

  it('should display an empty string when the "min" does not find the field property in its object', () => {
    const columnDef = { id: 'column3', field: 'column3' } as Column;
    const totals = { min: { column1: 123, column2: 345 } };
    const output = minTotalsFormatter(totals, columnDef, {});
    expect(output).toBe('');
  });

  it('should display an empty string when the minimum number is null', () => {
    const columnDef = { id: 'column1', field: 'column1' } as Column;
    const totals = { min: { column1: null } };
    const output = minTotalsFormatter(totals, columnDef, {});
    expect(output).toBe('');
  });

  it('should display an empty string when the average input is not a number', () => {
    const columnDef = { id: 'column1', field: 'column1' } as Column;
    const totals = { min: { column1: 'abc' } };
    const output = minTotalsFormatter(totals, columnDef, {});
    expect(output).toBe('');
  });

  it('should display a negative minimum when its input is negative', () => {
    const totals = { min: { column1: -123, column2: -34.5678, column3: -2.4 } };

    const output1 = minTotalsFormatter(totals, { id: 'column1', field: 'column1' } as Column, {});
    const output2 = minTotalsFormatter(totals, { id: 'column2', field: 'column2', params: { maxDecimal: 2 } } as Column, {});

    expect(output1).toBe('-123');
    expect(output2).toBe('-34.57');
  });

  it('should display a negative number with parentheses instead of the negative sign when its input is negative', () => {
    const totals = { min: { column1: -123, column2: -34.5678, column3: -2.4 } };

    const output1 = minTotalsFormatter(totals, { id: 'column1', field: 'column1', params: { displayNegativeWithParentheses: true } } as Column, {});
    const output2 = minTotalsFormatter(totals, { id: 'column2', field: 'column2', params: { maxDecimal: 2, displayNegativeWithParentheses: true } } as Column, {});

    expect(output1).toBe('(123)');
    expect(output2).toBe('(34.57)');
  });

  it('should display a positive minimum number even when displayNegativeWithParentheses is enabled', () => {
    const totals = { min: { column1: 123, column2: 34.5678, column3: 2.4 } };

    const output1 = minTotalsFormatter(totals, { id: 'column1', field: 'column1', params: { displayNegativeWithParentheses: true } } as Column, {});
    const output2 = minTotalsFormatter(totals, { id: 'column2', field: 'column2', params: { maxDecimal: 2, displayNegativeWithParentheses: true } } as Column, {});

    expect(output1).toBe('123');
    expect(output2).toBe('34.57');
  });

  it('should display the same minimum value when a number with decimals is provided', () => {
    const totals = { min: { column1: 123.55678, column2: 345.2, column3: -2.45 } };

    const output1 = minTotalsFormatter(totals, { id: 'column1', field: 'column1' } as Column, {});
    const output2 = minTotalsFormatter(totals, { id: 'column2', field: 'column2' } as Column, {});

    expect(output1).toBe('123.55678');
    expect(output2).toBe('345.2');
  });

  it('should display a minimum number with user defined minimum & maximum decimal count', () => {
    const totals = { min: { column1: 123.45678, column2: 345.2, column3: -2.45 } };

    const output1 = minTotalsFormatter(totals, { id: 'column1', field: 'column1', params: { maxDecimal: 2 } } as Column, {});
    const output2 = minTotalsFormatter(totals, { id: 'column2', field: 'column2', params: { minDecimal: 0 } } as Column, {});
    const output3 = minTotalsFormatter(totals, { id: 'column3', field: 'column3', params: { minDecimal: 3, displayNegativeWithParentheses: true } } as Column, {});

    expect(output1).toBe('123.46');
    expect(output2).toBe('345.2');
    expect(output3).toBe('(2.450)');
  });

  it('should display a minimum number a prefix and suffix', () => {
    const totals = { min: { column1: 123.45678, column2: 345.2, column3: -2.45 } };

    const output1 = minTotalsFormatter(totals, { id: 'column1', field: 'column1', params: { maxDecimal: 2, groupFormatterPrefix: 'min: ' } } as Column, {});
    const output2 = minTotalsFormatter(totals, { id: 'column2', field: 'column2', params: { minDecimal: 0, groupFormatterSuffix: ' (max)' } } as Column, {});
    const output3 = minTotalsFormatter(
      totals, {
        id: 'column3',
        field: 'column3',
        params: { minDecimal: 3, displayNegativeWithParentheses: true, groupFormatterPrefix: 'min: ', groupFormatterSuffix: '/item' }
      } as Column
    );

    expect(output1).toBe('min: 123.46');
    expect(output2).toBe('345.2 (max)');
    expect(output3).toBe('min: (2.450)/item');
  });
});