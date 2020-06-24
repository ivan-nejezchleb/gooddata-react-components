// (C) 2020 GoodData Corporation
import {
    AbsoluteColumnWidth,
    IAttributeColumnWidthItem,
    IMeasureColumnWidthItem,
    IAllMeasureColumnWidthItem,
    ColumnWidth,
} from "../../interfaces/PivotTable";
import { AFM } from "@gooddata/typings";
import { getIsAutoProp } from "../../components/core/pivotTable/agGridColumnSizing";

export class AttributeColumnWidthItemBuilder implements IAttributeColumnWidthItem {
    public attributeColumnWidthItem: IAttributeColumnWidthItem["attributeColumnWidthItem"];

    constructor(attributeIdentifier: string, width: AbsoluteColumnWidth, isAuto: boolean = false) {
        this.attributeColumnWidthItem = {
            attributeIdentifier,
            width,
            ...getIsAutoProp(isAuto),
        };
    }

    public aggregation = (aggregation: "sum") => {
        this.attributeColumnWidthItem.aggregation = aggregation;
        return this;
    };
}

export class MeasureColumnWidthItemBuilder implements IMeasureColumnWidthItem {
    public measureColumnWidthItem: IMeasureColumnWidthItem["measureColumnWidthItem"];

    constructor(measureIdentifier: AFM.Identifier, width: ColumnWidth, isAuto: boolean = false) {
        this.measureColumnWidthItem = {
            width,
            locators: [
                {
                    measureLocatorItem: {
                        measureIdentifier,
                    },
                },
            ],
            ...getIsAutoProp(isAuto),
        };
    }

    public attributeLocators = (
        ...attributeLocators: Array<AFM.IAttributeLocatorItem["attributeLocatorItem"]>
    ) => {
        this.measureColumnWidthItem.locators.splice(
            -2,
            0,
            ...attributeLocators.map(attributeLocatorItem => ({
                attributeLocatorItem,
            })),
        );
        return this;
    };
}

export class AllMeasureColumnWidthItemBuilder implements IAllMeasureColumnWidthItem {
    public measureColumnWidthItem: IAllMeasureColumnWidthItem["measureColumnWidthItem"];

    constructor(width: AbsoluteColumnWidth) {
        this.measureColumnWidthItem = {
            width,
        };
    }
}

export const attributeColumnWidthItem = (attributeIdentifier: string, width: AbsoluteColumnWidth) =>
    new AttributeColumnWidthItemBuilder(attributeIdentifier, width);

export const measureColumnWidthItem = (measureIdentifier: AFM.Identifier, width: ColumnWidth) =>
    new MeasureColumnWidthItemBuilder(measureIdentifier, width);

export const allMeasureColumnWidthItem = (width: AbsoluteColumnWidth) =>
    new AllMeasureColumnWidthItemBuilder(width);
