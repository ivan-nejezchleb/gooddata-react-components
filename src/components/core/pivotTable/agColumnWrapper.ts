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
            // we need set maxWidth dynamically before autoresize
            // set this by column.getColDef().maxWidth not working
            (column as any).maxWidth = newMaxWidth;
            column.getColDef().maxWidth = newMaxWidth;
        }
    });
};
