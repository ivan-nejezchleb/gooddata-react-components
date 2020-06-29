// (C) 2007-2020 GoodData Corporation
import { Execution } from "@gooddata/typings";
import { ColDef, Column } from "ag-grid-community";
import omit = require("lodash/omit");

import {
    getColumnIdentifier,
    isMeasureColumn,
    getMappingHeaderMeasureItemLocalIdentifier,
} from "./agGridUtils";
import {
    getColumnWidthsFromMap,
    convertColumnWidthsToMap,
    defaultWidthValidator,
    getWeakColumnWidthsFromMap,
} from "./agGridColumnSizing";
import {
    ColumnWidthItem,
    isAllMeasureColumnWidthItem,
    IAllMeasureColumnWidthItem,
    ColumnWidth,
    IResizedColumnsItem,
    isAbsoluteColumnWidth,
    isColumnWidthAuto,
    IWeakMeasureColumnWidthItem,
    isAttributeColumnWidthItem,
    isMeasureColumnWidthItem,
    isWeakMeasureColumnWidthItem,
} from "../../../interfaces/PivotTable";

export interface IResizedColumnsCollection {
    [columnIdentifier: string]: IResizedColumnsCollectionItem;
}

export interface IResizedColumnsCollectionItem {
    width: ColumnWidth;
    measureIdentifier?: string;
}

export interface IWeakMeasureColumnWidthItemsMap {
    [measureIdentifier: string]: IWeakMeasureColumnWidthItem;
}
// TODO IMJ: unify private lists
export class ResizedColumnsStore {
    private manuallyResizedColumns: IResizedColumnsCollection;
    private allMeasureColumnWidth: number | null;
    private weakMeasuresColumnWidths: IWeakMeasureColumnWidthItemsMap;

    public constructor() {
        this.manuallyResizedColumns = {};
        this.allMeasureColumnWidth = null;
        this.weakMeasuresColumnWidths = {};
    }

    public getManuallyResizedColumn(item: Column | ColDef): IResizedColumnsItem {
        const colId = getColumnIdentifier(item);

        if (this.manuallyResizedColumns[colId]) {
            return this.convertItem(this.manuallyResizedColumns[colId]);
        }

        const weakColumnWidth = this.getMatchedWeakMeasuresColumnWidths(item);

        if (weakColumnWidth) {
            return this.getWeakMeasureColumMapItem(weakColumnWidth);
        }

        if (isMeasureColumn(item) && this.isAllMeasureColumWidthUsed()) {
            return this.getAllMeasureColumMapItem();
        }
    }

    public isColumnManuallyResized(item: Column | ColDef) {
        return !!this.getManuallyResizedColumn(item);
    }

    public addToManuallyResizedColumn(column: Column): void {
        this.manuallyResizedColumns[getColumnIdentifier(column)] = {
            width: column.getActualWidth(),
        };

        column.getColDef().suppressSizeToFit = true;
    }

    public addAllMeasureColumn(columnWidth: number, allColumns: Column[]) {
        this.allMeasureColumnWidth = columnWidth;
        allColumns.forEach(col => {
            if (isMeasureColumn(col)) {
                const colId = getColumnIdentifier(col);
                if (this.manuallyResizedColumns[colId]) {
                    this.manuallyResizedColumns = omit(this.manuallyResizedColumns, colId);
                }
                col.getColDef().suppressSizeToFit = true;
            }
        });
        this.weakMeasuresColumnWidths = {};
    }

    public addWeekMeasureColumn(column: Column, allColumns: Column[]) {
        const width = column.getActualWidth();
        const measureHeaderLocalIdentifier: string = getMappingHeaderMeasureItemLocalIdentifier(column);
        if (measureHeaderLocalIdentifier) {
            this.weakMeasuresColumnWidths[measureHeaderLocalIdentifier] = {
                measureColumnWidthItem: {
                    width,
                    locator: {
                        measureLocatorItem: {
                            measureIdentifier: measureHeaderLocalIdentifier,
                        },
                    },
                },
            };
            allColumns.forEach(col => {
                const weakColumnWidth = this.getMatchedWeakMeasuresColumnWidths(col);
                if (isMeasureColumn(col) && weakColumnWidth) {
                    const colId = getColumnIdentifier(col);
                    if (this.manuallyResizedColumns[colId]) {
                        this.manuallyResizedColumns = omit(this.manuallyResizedColumns, colId);
                    }
                    col.getColDef().suppressSizeToFit = true;
                }
            });
        }
    }

    public removeAllMeasureColumns() {
        this.allMeasureColumnWidth = null;
        const colIds = Object.keys(this.manuallyResizedColumns);
        colIds.forEach(colId => {
            const item = this.manuallyResizedColumns[colId];
            if (isColumnWidthAuto(item.width)) {
                this.manuallyResizedColumns = omit(this.manuallyResizedColumns, colId);
            }
        });
        this.weakMeasuresColumnWidths = {};
    }

    public removeWeakMeasureColumn(column: Column) {
        const weakColumnWidth = this.getMatchedWeakMeasuresColumnWidths(column);
        if (weakColumnWidth) {
            this.weakMeasuresColumnWidths = omit(
                this.weakMeasuresColumnWidths,
                weakColumnWidth.measureColumnWidthItem.locator.measureLocatorItem.measureIdentifier,
            );
            const colIds = Object.keys(this.manuallyResizedColumns);
            colIds.forEach(colId => {
                const item = this.manuallyResizedColumns[colId];
                if (
                    isColumnWidthAuto(item.width) &&
                    this.isMatchingWeakWidth(item, weakColumnWidth) &&
                    !this.isAllMeasureColumWidthUsed()
                ) {
                    this.manuallyResizedColumns = omit(this.manuallyResizedColumns, colId);
                }
            });
        }
    }

    public removeFromManuallyResizedColumn(column: Column): void {
        const colId = getColumnIdentifier(column);
        const item = this.manuallyResizedColumns[colId];

        if (item) {
            this.manuallyResizedColumns = omit(this.manuallyResizedColumns, colId);

            if (!this.isAllMeasureColumWidthUsed() || !isMeasureColumn(column)) {
                column.getColDef().suppressSizeToFit = false;
            }
        }

        if (
            isMeasureColumn(column) &&
            (this.isAllMeasureColumWidthUsed() || this.getMatchedWeakMeasuresColumnWidths(column))
        ) {
            // TODO INE: consider creating weakItem with width: "auto" when alt+DC over allMeasure
            this.manuallyResizedColumns[colId] = this.getAutoSizeItem(column);
            column.getColDef().suppressSizeToFit = false;
        }
    }

    public getColumnWidthsFromMap(execution: Execution.IExecutionResponses): ColumnWidthItem[] {
        const result = getColumnWidthsFromMap(this.manuallyResizedColumns, execution);
        if (this.isAllMeasureColumWidthUsed()) {
            result.push(this.getAllMeasureColumnWidth());
        }
        const weakColumnWidthItems: ColumnWidthItem[] = getWeakColumnWidthsFromMap(
            this.weakMeasuresColumnWidths,
        );

        return result.concat(weakColumnWidthItems);
    }

    public updateColumnWidths(
        columnWidths: ColumnWidthItem[],
        executionResponse: Execution.IExecutionResponse,
    ) {
        const allMeasureWidthItem = this.filterAllMeasureColumnWidthItem(columnWidths);

        if (isAllMeasureColumnWidthItem(allMeasureWidthItem)) {
            const validatedWidth = defaultWidthValidator(allMeasureWidthItem.measureColumnWidthItem.width);
            this.allMeasureColumnWidth = isAbsoluteColumnWidth(validatedWidth) ? validatedWidth : null;
        } else {
            this.allMeasureColumnWidth = null;
        }

        this.weakMeasuresColumnWidths = this.filterWeakColumnWidthItems(columnWidths);

        const columnWidthItems = this.filterStrongColumnWidthItems(columnWidths);
        const columnWidthsByField = convertColumnWidthsToMap(columnWidthItems, executionResponse);
        this.manuallyResizedColumns = columnWidthsByField;
    }

    public getMatchingColumnsByMeasure(targetColumn: Column, allColumns: Column[]): Column[] {
        const targetMeasureLocalIdentifier: string = getMappingHeaderMeasureItemLocalIdentifier(targetColumn);

        if (targetMeasureLocalIdentifier) {
            return allColumns.filter((col: Column) => {
                const measureLocalIdentifier = getMappingHeaderMeasureItemLocalIdentifier(col);
                return targetMeasureLocalIdentifier === measureLocalIdentifier;
            });
        }
        return [];
    }

    public getMatchedWeakMeasuresColumnWidths(item: Column | ColDef): IWeakMeasureColumnWidthItem {
        const measureHeaderLocalIdentifier: string = getMappingHeaderMeasureItemLocalIdentifier(item);

        if (measureHeaderLocalIdentifier) {
            return this.weakMeasuresColumnWidths[measureHeaderLocalIdentifier];
        }
    }

    private filterAllMeasureColumnWidthItem(columnWidths: ColumnWidthItem[]): IAllMeasureColumnWidthItem {
        if (columnWidths) {
            return columnWidths.filter(isAllMeasureColumnWidthItem)[0];
        }
    }

    private filterStrongColumnWidthItems(columnWidths: ColumnWidthItem[]) {
        if (columnWidths) {
            return columnWidths.filter(
                item => isAttributeColumnWidthItem(item) || isMeasureColumnWidthItem(item),
            );
        }
        return [];
    }

    private filterWeakColumnWidthItems(columnWidths: ColumnWidthItem[]): IWeakMeasureColumnWidthItemsMap {
        if (columnWidths) {
            const onlyWeakWidthItems: IWeakMeasureColumnWidthItem[] = columnWidths.reduce(
                (result: IWeakMeasureColumnWidthItem[], item: ColumnWidthItem) => {
                    if (isWeakMeasureColumnWidthItem(item)) {
                        result.push(item);
                    }
                    return result;
                },
                [],
            );
            return onlyWeakWidthItems.reduce(
                (map: IWeakMeasureColumnWidthItemsMap, weakWidthItem: IWeakMeasureColumnWidthItem) => {
                    map[
                        weakWidthItem.measureColumnWidthItem.locator.measureLocatorItem.measureIdentifier
                    ] = weakWidthItem;
                    return map;
                },
                {},
            );
        }
        return {};
    }

    private convertItem(item: IResizedColumnsCollectionItem): IResizedColumnsItem {
        // columns with width = auto are hidden
        if (isAbsoluteColumnWidth(item.width)) {
            return { width: item.width };
        }
    }

    private getWeakMeasureColumMapItem(item: IWeakMeasureColumnWidthItem): IResizedColumnsItem {
        return {
            width: item.measureColumnWidthItem.width,
        };
    }

    private isAllMeasureColumWidthUsed() {
        return this.allMeasureColumnWidth !== null;
    }

    private getAutoSizeItem(column: Column): IResizedColumnsCollectionItem {
        const measureHeaderLocalIdentifier: string = getMappingHeaderMeasureItemLocalIdentifier(column);
        const result: IResizedColumnsCollectionItem = { width: "auto" };
        if (measureHeaderLocalIdentifier) {
            result.measureIdentifier = measureHeaderLocalIdentifier;
        }
        return result;
    }

    private getAllMeasureColumMapItem(): IResizedColumnsItem {
        return { width: this.allMeasureColumnWidth };
    }

    private getAllMeasureColumnWidth(): IAllMeasureColumnWidthItem {
        return {
            measureColumnWidthItem: {
                width: this.allMeasureColumnWidth,
            },
        };
    }

    private isMatchingWeakWidth(
        item: IResizedColumnsCollectionItem,
        weakColumnWidth: IWeakMeasureColumnWidthItem,
    ) {
        return (
            item.measureIdentifier ===
            weakColumnWidth.measureColumnWidthItem.locator.measureLocatorItem.measureIdentifier
        );
    }
}
