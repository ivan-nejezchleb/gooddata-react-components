// (C) 2007-2020 GoodData Corporation
// tslint:disable:prefer-conditional-expression
import { Execution } from "@gooddata/typings";
import { ColDef, Column } from "ag-grid-community";
import omit = require("lodash/omit");

import { getColumnIdentifier, isMeasureColumn, isColumn } from "./agGridUtils";
import {
    getColumnWidthsFromMap,
    convertColumnWidthsToMap,
    defaultWidthValidator,
} from "./agGridColumnSizing";
import {
    ColumnEventSourceType,
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
import { isMappingHeaderMeasureItem, IMappingHeader } from "../../../interfaces/MappingHeader";
import { IGridHeader } from "./agGridTypes";

export interface IResizedColumnsCollection {
    [columnIdentifier: string]: IResizedColumnsCollectionItem;
}

export interface IResizedColumnsCollectionItem {
    width: ColumnWidth;
    source: ColumnEventSourceType;
}

// todo unify private lists
// IResizedColumnsCollection remove source
export class ResizedColumnsStore {
    private manuallyResizedColumns: IResizedColumnsCollection;
    private allMeasureColumnWidth: number | null;
    // should be map per locator
    private weakMeasuresColumnWidths: IWeakMeasureColumnWidthItem[];

    public constructor() {
        this.manuallyResizedColumns = {};
        this.allMeasureColumnWidth = null;
        this.weakMeasuresColumnWidths = [];
    }

    public getManuallyResizedColumn(item: Column | ColDef): IResizedColumnsItem {
        const colId = getColumnIdentifier(item);

        if (this.manuallyResizedColumns[colId]) {
            return this.convertItem(this.manuallyResizedColumns[colId]);
        }

        const weakColumnWidth = this.getMatchedWeakMeasuresColumnWidths(item);

        if (weakColumnWidth) {
            return this.convertFromWeakDef(weakColumnWidth);
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
            source: ColumnEventSourceType.UI_DRAGGED,
        };

        column.getColDef().suppressSizeToFit = true;
    }

    public addAllMeasureColumns(columnWidth: number, allColumns: Column[]) {
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
    }

    public addWeekMeasureColumns(columnWidth: number, allColumns: Column[]) {
        // this should add week measure
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

        if (this.isAllMeasureColumWidthUsed() && isMeasureColumn(column)) {
            this.manuallyResizedColumns[colId] = this.getAutoSizeItem();
            column.getColDef().suppressSizeToFit = false;
        }
    }

    public getColumnWidthsFromMap(execution: Execution.IExecutionResponses): ColumnWidthItem[] {
        const result = getColumnWidthsFromMap(this.manuallyResizedColumns, execution);
        if (this.isAllMeasureColumWidthUsed()) {
            result.push(this.getAllMeasureColumnWidth());
        }

        // push all weak items
        return result;
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

    private filterWeakColumnWidthItems(columnWidths: ColumnWidthItem[]): IWeakMeasureColumnWidthItem[] {
        if (columnWidths) {
            return columnWidths.filter(item =>
                isWeakMeasureColumnWidthItem(item),
            ) as IWeakMeasureColumnWidthItem[];
        }
        return [];
    }

    private convertItem(item: IResizedColumnsCollectionItem): IResizedColumnsItem {
        // columns with width = auto are hidden
        if (isAbsoluteColumnWidth(item.width)) {
            return {
                width: item.width,
                source: item.source,
            };
        }
    }

    private convertFromWeakDef(item: IWeakMeasureColumnWidthItem): IResizedColumnsItem {
        return {
            width: item.measureColumnWidthItem.width,
            source: ColumnEventSourceType.UI_DRAGGED,
        };
    }

    private isAllMeasureColumWidthUsed() {
        return this.allMeasureColumnWidth !== null;
    }

    private getAutoSizeItem(): IResizedColumnsCollectionItem {
        return { width: "auto", source: ColumnEventSourceType.UI_DRAGGED };
    }

    private getAllMeasureColumMapItem(): IResizedColumnsItem {
        return { width: this.allMeasureColumnWidth, source: ColumnEventSourceType.UI_DRAGGED };
    }

    private getAllMeasureColumnWidth(): IAllMeasureColumnWidthItem {
        return {
            measureColumnWidthItem: {
                width: this.allMeasureColumnWidth,
            },
        };
    }

    private getMatchedWeakMeasuresColumnWidths(item: Column | ColDef): IWeakMeasureColumnWidthItem {
        const measureHeader: Execution.IMeasureHeaderItem = this.getMappingHeaderMeasureItem(item);

        if (measureHeader) {
            return this.weakMeasuresColumnWidths.filter(
                colWidth =>
                    colWidth.measureColumnWidthItem.locator.measureLocatorItem.measureIdentifier ===
                    measureHeader.measureHeaderItem.localIdentifier,
            )[0];
        }
    }

    private getMappingHeaderMeasureItem(item: Column | ColDef): Execution.IMeasureHeaderItem | undefined {
        let headers: IMappingHeader[] = [];
        if (!isMeasureColumn(item)) {
            return;
        }

        if (isColumn(item)) {
            headers = (item.getColDef() as IGridHeader).drillItems;
        } else {
            headers = (item as IGridHeader).drillItems;
        }

        if (headers) {
            return headers.filter(isMappingHeaderMeasureItem)[0];
        }
    }
}
