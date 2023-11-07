'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var uuid = require('uuid');
var types = require('../../../types.js');

const addErrorsAndRunHooks = async (data, fields, rowHook, tableHook, changedRowIndexes) => {
    const errors = {};
    const addError = (source, rowIndex, fieldKey, error) => {
        errors[rowIndex] = {
            ...errors[rowIndex],
            [fieldKey]: { ...error, source },
        };
    };
    if (tableHook) {
        data = await tableHook(data, (...props) => addError(types.ErrorSources.Table, ...props));
    }
    if (rowHook) {
        if (changedRowIndexes) {
            for (const index of changedRowIndexes) {
                data[index] = await rowHook(data[index], (...props) => addError(types.ErrorSources.Row, index, ...props), data);
            }
        }
        else {
            data = await Promise.all(data.map(async (value, index) => rowHook(value, (...props) => addError(types.ErrorSources.Row, index, ...props), data)));
        }
    }
    fields.forEach((field) => {
        field.validations?.forEach((validation) => {
            switch (validation.rule) {
                case "unique": {
                    const values = data.map((entry) => entry[field.key]);
                    const taken = new Set(); // Set of items used at least once
                    const duplicates = new Set(); // Set of items used multiple times
                    values.forEach((value) => {
                        if (validation.allowEmpty && !value) {
                            // If allowEmpty is set, we will not validate falsy fields such as undefined or empty string.
                            return;
                        }
                        if (taken.has(value)) {
                            duplicates.add(value);
                        }
                        else {
                            taken.add(value);
                        }
                    });
                    values.forEach((value, index) => {
                        if (duplicates.has(value)) {
                            addError(types.ErrorSources.Table, index, field.key, {
                                level: validation.level || "error",
                                message: validation.errorMessage || "Field must be unique",
                            });
                        }
                    });
                    break;
                }
                case "required": {
                    const dataToValidate = changedRowIndexes ? changedRowIndexes.map((index) => data[index]) : data;
                    dataToValidate.forEach((entry, index) => {
                        const realIndex = changedRowIndexes ? changedRowIndexes[index] : index;
                        if (entry[field.key] === null || entry[field.key] === undefined || entry[field.key] === "") {
                            addError(types.ErrorSources.Row, realIndex, field.key, {
                                level: validation.level || "error",
                                message: validation.errorMessage || "Field is required",
                            });
                        }
                    });
                    break;
                }
                case "regex": {
                    const dataToValidate = changedRowIndexes ? changedRowIndexes.map((index) => data[index]) : data;
                    const regex = new RegExp(validation.value, validation.flags);
                    dataToValidate.forEach((entry, index) => {
                        const realIndex = changedRowIndexes ? changedRowIndexes[index] : index;
                        const value = entry[field.key]?.toString() ?? "";
                        if (!value.match(regex)) {
                            addError(types.ErrorSources.Row, realIndex, field.key, {
                                level: validation.level || "error",
                                message: validation.errorMessage || `Field did not match the regex /${validation.value}/${validation.flags} `,
                            });
                        }
                    });
                    break;
                }
            }
        });
    });
    return data.map((value, index) => {
        // This is required only for table. Mutates to prevent needless rerenders
        if (!("__index" in value)) {
            value.__index = uuid.v4();
        }
        const newValue = value;
        // If we are validating all indexes, or we did full validation on this row - apply all errors
        if (!changedRowIndexes || changedRowIndexes.includes(index)) {
            if (errors[index]) {
                return { ...newValue, __errors: errors[index] };
            }
            if (!errors[index] && value?.__errors) {
                return { ...newValue, __errors: null };
            }
        }
        // if we have not validated this row, keep it's row errors but apply global error changes
        else {
            // at this point errors[index] contains only table source errors, previous row and table errors are in value.__errors
            const hasRowErrors = value.__errors && Object.values(value.__errors).some((error) => error.source === types.ErrorSources.Row);
            if (!hasRowErrors) {
                if (errors[index]) {
                    return { ...newValue, __errors: errors[index] };
                }
                return newValue;
            }
            const errorsWithoutTableError = Object.entries(value.__errors).reduce((acc, [key, value]) => {
                if (value.source === types.ErrorSources.Row) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            const newErrors = { ...errorsWithoutTableError, ...errors[index] };
            return { ...newValue, __errors: newErrors };
        }
        return newValue;
    });
};

exports.addErrorsAndRunHooks = addErrorsAndRunHooks;
