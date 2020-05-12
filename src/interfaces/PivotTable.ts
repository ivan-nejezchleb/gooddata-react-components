// (C) 2007-2020 GoodData Corporation
import { ISeparators } from "@gooddata/numberjs";
import { AFM } from "@gooddata/typings";

export interface IMenu {
    aggregations?: boolean;
    aggregationsSubMenu?: boolean;
}

export type DefaultColumnWidth = "viewport" | "unset"; // | "auto"  | number; can be added later see ONE-4276
export interface IColumnSizing {
    defaultWidth?: DefaultColumnWidth;
    growToFit?: boolean;
	columnWidths?: ColumnWidthItem[];
}

export interface IPivotTableConfig {
    columnSizing?: IColumnSizing;
    separators?: ISeparators;
    menu?: IMenu;
    maxHeight?: number;
}

export interface IMenuAggregationClickConfig {
    type: AFM.TotalType;
    measureIdentifiers: string[];
    attributeIdentifier: string;
    include: boolean;
}

export type ColumnWidthItem = IAttributeColumnWidthItem | IMeasureColumnWidthItem;
type ColumnWidth = number | "auto"; // auto to override weak locator during reset of particular column
interface IAttributeColumnWidthItem {
    attributeColumnWidthItem: {
        width: ColumnWidth;
        attributeIdentifier: AFM.Identifier;
        aggregation?: "sum"; // TODO INE do we need this?
    };
}

interface IMeasureColumnWidthItem {
    measureColumnWidthItem: {
        width: ColumnWidth;
        locators: LocatorItem[];
    };
}
type LocatorItem = IAttributeLocatorItem | AFM.IMeasureLocatorItem;
interface IAttributeLocatorItem {
    attributeLocatorItem: {
        attributeIdentifier: AFM.Identifier;
        element?: string; // this is difference from AFM.IAttributeLocatorItem
    };
}
