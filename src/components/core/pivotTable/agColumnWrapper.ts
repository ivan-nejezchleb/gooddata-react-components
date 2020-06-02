// (C) 2007-2020 GoodData Corporation
import { ColumnApi, Column } from "ag-grid-community";

export const setColumnMaxWidth = (
    columnApi: ColumnApi,
    columnIds: string[],
    newMaxWidth: number | undefined,
) => {
    setColumnMaxWidthIf(columnApi, columnIds, newMaxWidth, () => true);
};

export const setColumnMaxWidthIf = (
    columnApi: ColumnApi,
    columnIds: string[],
    newMaxWidth: number | undefined,
    condition: (column: Column) => boolean,
) => {
    columnIds.forEach(colId => {
        const column = columnApi.getColumn(colId);

        if (column && condition(column)) {
            // We need set maxWidth dynamically before/after autoresize/growToFit.
            // Set this only on column.getColDef().maxWidth not working
            // so we need to set it also on column's private member
            (column as any).maxWidth = newMaxWidth;
            column.getColDef().maxWidth = newMaxWidth;
        }
    });
};
