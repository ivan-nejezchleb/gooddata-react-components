// (C) 2007-2020 GoodData Corporation
import { /*AFM,*/ Execution } from "@gooddata/typings";
import { getIdsFromUri, getParsedFields /*getParsedFields*/ } from "./agGridUtils";
import { FIELD_SEPARATOR, FIELD_TYPE_ATTRIBUTE, FIELD_TYPE_MEASURE, ID_SEPARATOR } from "./agGridConst";
import { assortDimensionHeaders, identifyResponseHeader } from "./agGridHeaders";
import invariant = require("invariant");
// import { ColDef } from "ag-grid-community";
import {
    IAttributeColumnWidthItem,
    ColumnWidth,
    IMeasureColumnWidthItem,
    isMeasureLocatorItem,
    isAttributeColumnWidthItem,
    ColumnWidthItem,
    isMeasureColumnWidthItem,
    ColumnEventSourceType,
    IResizedColumns,
} from "../../../interfaces/PivotTable";
import { Column } from "ag-grid-community";

/*
 * All code related to column resizing the ag-grid backed Pivot Table is concentrated here
 */

export const convertColumnWidthsToMap = (
    columnWidths: ColumnWidthItem[],
    executionResponse: Execution.IExecutionResponse,
): IResizedColumns => {
    if (!executionResponse) {
        return {};
    }
    const { dimensions } = executionResponse;

    const columnWidthsMap = {};
    const { attributeHeaders, measureHeaderItems } = assortDimensionHeaders(dimensions);
    columnWidths.forEach((columnWidth: ColumnWidthItem) => {
        if (isAttributeColumnWidthItem(columnWidth)) {
            const [field, width] = getAttributeColumnWidthItemFieldAndWidth(columnWidth, attributeHeaders);
            columnWidthsMap[field] = { width, source: ColumnEventSourceType.UI_DRAGGED };
        }
        if (isMeasureColumnWidthItem(columnWidth)) {
            const [field, width] = getMeasureColumnWidthItemFieldAndWidth(columnWidth, measureHeaderItems);
            columnWidthsMap[field] = { width, source: ColumnEventSourceType.UI_DRAGGED };
        }
    });
    return columnWidthsMap;
};

export const getAttributeColumnWidthItemFieldAndWidth = (
    columnWidthItem: IAttributeColumnWidthItem,
    attributeHeaders: Execution.IAttributeHeader[],
): [string, ColumnWidth] => {
    const localIdentifier = columnWidthItem.attributeColumnWidthItem.attributeIdentifier;

    const attributeHeader = attributeHeaders.find(
        header => header.attributeHeader.localIdentifier === localIdentifier,
    );
    invariant(attributeHeaders, `Could not find attributeHeaders with localIdentifier ${localIdentifier}`);

    const field = identifyResponseHeader(attributeHeader);
    return [field, columnWidthItem.attributeColumnWidthItem.width];
};

export const getMeasureColumnWidthItemFieldAndWidth = (
    columnWidthItem: IMeasureColumnWidthItem,
    measureHeaderItems: Execution.IMeasureHeaderItem[],
): [string, ColumnWidth] => {
    const keys: string[] = [];
    columnWidthItem.measureColumnWidthItem.locators.forEach(locator => {
        if (isMeasureLocatorItem(locator)) {
            const measureColumnWidthHeaderIndex = measureHeaderItems.findIndex(
                measureHeaderItem =>
                    measureHeaderItem.measureHeaderItem.localIdentifier ===
                    locator.measureLocatorItem.measureIdentifier,
            );
            keys.push(`m${ID_SEPARATOR}${measureColumnWidthHeaderIndex}`);
        } else {
            const key = `a${ID_SEPARATOR}${getIdsFromUri(locator.attributeLocatorItem.element).join(
                ID_SEPARATOR,
            )}`;
            keys.push(key);
        }
    });
    const field = keys.join(FIELD_SEPARATOR);
    return [field, columnWidthItem.measureColumnWidthItem.width];
};

// export const getSortItemByColId = (
//     execution: Execution.IExecutionResponses,
//     colId: string,
//     direction: AFM.SortDirection,
//     originalSortItems: AFM.SortItem[],
// ): AFM.IMeasureSortItem | AFM.IAttributeSortItem => {
//     const { dimensions } = execution.executionResponse;

//     const fields = getParsedFields(colId);
//     const [lastFieldType, lastFieldId] = fields[fields.length - 1];

//     // search columns first when sorting in columns to use the proper header
//     // in case the same attribute is in both rows and columns
//     const searchDimensionIndex = lastFieldType === FIELD_TYPE_MEASURE ? 1 : 0;
//     const { attributeHeaders, measureHeaderItems } = assortDimensionHeaders([
//         dimensions[searchDimensionIndex],
//     ]);

//     if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
//         for (const header of attributeHeaders) {
//             if (getIdsFromUri(header.attributeHeader.uri)[0] === lastFieldId) {
//                 const attributeIdentifier = header.attributeHeader.localIdentifier;

//                 // try to find the original sort item in case it had an aggregation set so we can keep it in (RAIL-1992)
//                 // we intentionally ignore the direction to make sure the UX is predictable
//                 const matchingOriginalSortItem = originalSortItems.find(
//                     s =>
//                         AFM.isAttributeSortItem(s) &&
//                         s.attributeSortItem.attributeIdentifier === attributeIdentifier,
//                 ) as AFM.IAttributeSortItem;

//                 const aggregationProp =
//                     matchingOriginalSortItem && matchingOriginalSortItem.attributeSortItem.aggregation
//                         ? { aggregation: matchingOriginalSortItem.attributeSortItem.aggregation }
//                         : {};

//                 return {
//                     attributeSortItem: {
//                         direction,
//                         attributeIdentifier,
//                         ...aggregationProp,
//                     },
//                 };
//             }
//         }
//         invariant(false, `could not find attribute header matching ${colId}`);
//     } else if (lastFieldType === FIELD_TYPE_MEASURE) {
//         const headerItem = measureHeaderItems[parseInt(lastFieldId, 10)];
//         const attributeLocators = fields.slice(0, -1).map((field: string[]) => {
//             // first item is type which should be always 'a'
//             const [, fieldId, fieldValueId] = field;
//             const attributeHeaderMatch = attributeHeaders.find(
//                 (attributeHeader: Execution.IAttributeHeader) => {
//                     return getIdsFromUri(attributeHeader.attributeHeader.formOf.uri)[0] === fieldId;
//                 },
//             );
//             invariant(
//                 attributeHeaderMatch,
//                 `Could not find matching attribute header to field ${field.join(ID_SEPARATOR)}`,
//             );
//             return {
//                 attributeLocatorItem: {
//                     attributeIdentifier: attributeHeaderMatch.attributeHeader.localIdentifier,
//                     element: `${attributeHeaderMatch.attributeHeader.formOf.uri}/elements?id=${fieldValueId}`,
//                 },
//             };
//         });
//         return {
//             measureSortItem: {
//                 direction,
//                 locators: [
//                     ...attributeLocators,
//                     {
//                         measureLocatorItem: {
//                             measureIdentifier: headerItem.measureHeaderItem.localIdentifier,
//                         },
//                     },
//                 ],
//             },
//         };
//     }
//     invariant(false, `could not find header matching ${colId}`);
// };

// export const getSortsFromModel = (
//     sortModel: ISortModelItem[], // AgGrid has any, but we can do better
//     execution: Execution.IExecutionResponses,
//     originalSortItems: AFM.SortItem[] = [],
// ) => {
//     return sortModel.map((sortModelItem: ISortModelItem) => {
//         const { colId, sort } = sortModelItem;
//         const sortHeader = getSortItemByColId(execution, colId, sort, originalSortItems);
//         invariant(sortHeader, `unable to find sort item by field ${colId}`);
//         return sortHeader;
//     });
// };

// export const assignColumnWidth = (colDef: ColDef, sortingMap: { [key: string]: string }): void => {
//     const direction = sortingMap[colDef.field];
//     if (direction) {
//         colDef.sort = direction;
//     }
// };

export const getSizeItemByColId = (
    execution: Execution.IExecutionResponses,
    colId: string,
    width: number,
) => {
    const { dimensions } = execution.executionResponse;

    // TODO ONE-4404 same code is also in getSortItemByColId function
    const fields = getParsedFields(colId);
    const [lastFieldType, lastFieldId] = fields[fields.length - 1];

    // TODO ONE-4404 same code is also in getSortItemByColId function
    const searchDimensionIndex = lastFieldType === FIELD_TYPE_MEASURE ? 1 : 0;
    const { attributeHeaders, measureHeaderItems } = assortDimensionHeaders([
        dimensions[searchDimensionIndex],
    ]);

    if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
        for (const header of attributeHeaders) {
            if (getIdsFromUri(header.attributeHeader.uri)[0] === lastFieldId) {
                const attributeIdentifier = header.attributeHeader.localIdentifier;

                return {
                    attributeSizeItem: {
                        width,
                        attributeIdentifier,
                    },
                };
            }
        }
        invariant(false, `could not find attribute header matching ${colId}`);
    } else if (lastFieldType === FIELD_TYPE_MEASURE) {
        const headerItem = measureHeaderItems[parseInt(lastFieldId, 10)];
        const attributeLocators = fields.slice(0, -1).map((field: string[]) => {
            // first item is type which should be always 'a'
            const [, fieldId, fieldValueId] = field;
            const attributeHeaderMatch = attributeHeaders.find(
                (attributeHeader: Execution.IAttributeHeader) => {
                    return getIdsFromUri(attributeHeader.attributeHeader.formOf.uri)[0] === fieldId;
                },
            );
            invariant(
                attributeHeaderMatch,
                `Could not find matching attribute header to field ${field.join(ID_SEPARATOR)}`,
            );
            return {
                attributeLocatorItem: {
                    attributeIdentifier: attributeHeaderMatch.attributeHeader.localIdentifier,
                    element: `${attributeHeaderMatch.attributeHeader.formOf.uri}/elements?id=${fieldValueId}`,
                },
            };
        });
        return {
            measureSizeItem: {
                width,
                locators: [
                    ...attributeLocators,
                    {
                        measureLocatorItem: {
                            measureIdentifier: headerItem.measureHeaderItem.localIdentifier,
                        },
                    },
                ],
            },
        };
    }
    invariant(false, `could not find header matching ${colId}`);
};

export const getColumnFromModel = (columns: Column[], execution: Execution.IExecutionResponses) => {
    return columns.map((column: Column) => {
        const colId = column.getColId();
        const width = column.getActualWidth();
        const sizeItem = getSizeItemByColId(execution, colId, width);
        invariant(sizeItem, `unable to find size item by filed ${colId}`);
        return sizeItem;
    });
};
