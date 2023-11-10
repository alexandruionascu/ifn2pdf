'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MatchColumnsStep = require('../MatchColumnsStep.js');
var uniqueEntries = require('./uniqueEntries.js');

const setColumn = (oldColumn, field, data, autoMapSelectValues) => {
    switch (field?.fieldType.type) {
        case "select":
            const fieldOptions = field.fieldType.options;
            const uniqueData = uniqueEntries.uniqueEntries(data || [], oldColumn.index);
            const matchedOptions = autoMapSelectValues
                ? uniqueData.map((record) => {
                    const value = fieldOptions.find((fieldOption) => fieldOption.value === record.entry || fieldOption.label === record.entry)?.value;
                    return value ? { ...record, value } : record;
                })
                : uniqueData;
            const allMatched = matchedOptions.filter((o) => o.value).length == uniqueData?.length;
            return {
                ...oldColumn,
                type: allMatched ? MatchColumnsStep.ColumnType.matchedSelectOptions : MatchColumnsStep.ColumnType.matchedSelect,
                value: field.key,
                matchedOptions,
            };
        case "checkbox":
            return { index: oldColumn.index, type: MatchColumnsStep.ColumnType.matchedCheckbox, value: field.key, header: oldColumn.header };
        case "input":
            return { index: oldColumn.index, type: MatchColumnsStep.ColumnType.matched, value: field.key, header: oldColumn.header };
        default:
            return { index: oldColumn.index, header: oldColumn.header, type: MatchColumnsStep.ColumnType.empty };
    }
};

exports.setColumn = setColumn;
