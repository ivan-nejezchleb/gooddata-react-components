// (C) 2007-2019 GoodData Corporation
import { AFM } from "@gooddata/typings";
import Highcharts from "../components/visualizations/chart/highcharts/highchartsEntryPoint";
import {
    ChartElementType,
    ChartType,
    HeadlineElementType,
    HeadlineType,
    TableElementType,
    TableType,
    VisElementType,
    VisType,
} from "../constants/visualizationTypes";
import { TableRowForDrilling } from "./Table";
import { OnFiredDrillEvent } from "./Events";
import { IMappingHeader } from "./MappingHeader";

export interface IDrillableItemUri {
    uri: string;
}

export interface IDrillableItemIdentifier {
    identifier: string;
}

export type IDrillableItem =
    | IDrillableItemUri
    | IDrillableItemIdentifier
    | (IDrillableItemUri & IDrillableItemIdentifier);

export function isDrillableItemUri(item: IDrillableItem): item is IDrillableItemUri {
    return (item as IDrillableItemUri).uri !== undefined;
}

export function isDrillableItemIdentifier(item: IDrillableItem): item is IDrillableItemIdentifier {
    return (item as IDrillableItemIdentifier).identifier !== undefined;
}

export type IDrillEventCallback = (event: IDrillEvent) => void | boolean;
export type IDrillEventExtendedCallback = (event: IDrillEventExtended) => void;

// Intersection element
export interface IDrillEventIntersectionElement {
    id: string;
    title: string;
    header?: {
        uri: string;
        identifier: string;
    };
}

export interface IDrillEventIntersectionElementExtended {
    header: IMappingHeader;
}

export interface IDrillEventContextTableBase {
    type: TableType;
    element: TableElementType;
    columnIndex: number;
    rowIndex: number;
    row: any[];
}

export interface IDrillEventIntersection {
    intersection: IDrillEventIntersectionElement[];
}

export interface IDrillEventIntersectionExtended {
    intersection: IDrillEventIntersectionElementExtended[];
}
// Drill context for tables
export interface IDrillEventContextTable extends IDrillEventContextTableBase, IDrillEventIntersection {}

export interface IDrillEventContextTableExtended
    extends IDrillEventContextTableBase,
        IDrillEventIntersectionExtended {}

// Drill context for headline
export interface IDrillEventContextHeadline {
    type: HeadlineType;
    element: HeadlineElementType;
    value: string;
    intersection: IDrillEventIntersectionElement[];
}

// Drill context for chart
export interface IDrillEventContextPoint {
    type: ChartType;
    element: ChartElementType;
    elementChartType?: ChartType;
    x?: number;
    y?: number;
    z?: number;
    value?: string;
    intersection: IDrillEventIntersectionElement[];
}

// Chart series point with intersection element
export interface IDrillPoint {
    x: number;
    y: number;
    intersection: IDrillEventIntersectionElement[];
    type?: ChartType;
}

// Drill context for chart element group (multiple series + click on axis value)
// where every point has own intersection
export interface IDrillEventContextGroup {
    type: ChartType;
    element: ChartElementType;
    points: IDrillPoint[];
}

// Drill context for all visualization types
export interface IDrillEventContextBase {
    type: VisType; // type of visualization
    element: VisElementType; // type of visualization element drilled
    x?: number; // chart x coordinate (if supported)
    y?: number; // chart y coordinate (if supported)
    z?: number; // chart z coordinate (if supported)
    columnIndex?: number;
    rowIndex?: number;
    row?: any[]; // table row data of the drilled row
    value?: string; // cell or element value drilled
    // A collection of chart series points (if available)
    points?: IDrillPoint[];
}

export interface IDrillEventContext extends IDrillEventContextBase {
    // some drill headers that are relevant for current drill element
    intersection?: IDrillEventIntersectionElement[];
}

export interface IDrillEventContextExtended extends IDrillEventContextBase {
    // some drill headers that are relevant for current drill element
    intersection?: IDrillEventIntersectionElementExtended[];
}

// IDrillEvent is a parameter of the onFiredDrillEvent is callback
export interface IDrillEvent {
    executionContext: AFM.IAfm;
    drillContext: IDrillEventContext;
}

export interface IDrillEventExtended {
    executionContext: AFM.IAfm;
    drillContext: IDrillEventContextExtended;
}

export interface IHighchartsParentTick {
    leaves: number;
    startAt: number;
    label: any;
}

export interface IHighchartsCategoriesTree {
    tick: IHighchartsParentTick;
}

export interface IHighchartsPointObject extends Highcharts.Point {
    drillIntersection: IDrillEventIntersectionElement[];
    z?: number; // is missing in HCH's interface
    value?: number; // is missing in HCH's interface
}

export function isGroupHighchartsDrillEvent(event: Highcharts.DrilldownEventObject) {
    return !!event.points;
}

export interface ICellDrillEvent {
    columnIndex: number;
    rowIndex: number;
    row: TableRowForDrilling;
    intersection: IDrillEventIntersectionElement[];
}

export interface IDrillConfig {
    afm: AFM.IAfm;
    onFiredDrillEvent: OnFiredDrillEvent;
}
