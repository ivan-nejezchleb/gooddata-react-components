// (C) 2020 GoodData Corporation;
import React, { Component } from "react";
import { Model, PivotTable } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    quarterDateIdentifier,
    locationStateDisplayFormIdentifier,
    franchiseFeesIdentifier,
    franchiseFeesAdRoyaltyIdentifier,
} from "../utils/fixtures";

const measures = [
    Model.measure(franchiseFeesIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseFees"),
    Model.measure(franchiseFeesAdRoyaltyIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseFeesAdRoyaltyIdentifier")
        .alias("Ad Royality"),
];

const attributes = [Model.attribute(locationStateDisplayFormIdentifier).localIdentifier("state")];

const columns = [Model.attribute(quarterDateIdentifier).localIdentifier("quarterDate")];

const attributeWidth = width => Model.attributeColumnWidthItem("state", width);

const allMeasureWidth = width => Model.allMeasureColumnWidthItem(width);

const weakMeasureWidth = width => Model.weakMeasureColumnWidthItemBuilder("franchiseFees", width);

const isAllMeasureColumnWidthItem = columnWidthItem => {
    return (
        columnWidthItem.measureColumnWidthItem !== undefined &&
        columnWidthItem.measureColumnWidthItem.locators === undefined
    );
};

const isAttributeColumnWidthItem = columnWidthItem => {
    return columnWidthItem && columnWidthItem.attributeColumnWidthItem !== undefined;
};

const isMeasureColumnWidthItem = columnWidthItem => {
    return (
        columnWidthItem &&
        columnWidthItem.measureColumnWidthItem !== undefined &&
        columnWidthItem.measureColumnWidthItem.locators !== undefined
    );
};

const isLocatorsEqual = (locator1, locator2) => {
    return (
        locator1[0].attributeLocatorItem.element === locator2[0].attributeLocatorItem.element &&
        locator1[1].measureLocatorItem.measureIdentifier === locator2[1].measureLocatorItem.measureIdentifier
    );
};

const isSameWidthItem = (item, newItem) => {
    if (isAttributeColumnWidthItem(item) && isAttributeColumnWidthItem(newItem)) {
        return (
            item.attributeColumnWidthItem.attributeIdentifier ===
            newItem.attributeColumnWidthItem.attributeIdentifier
        );
    }

    if (isMeasureColumnWidthItem(item) && isMeasureColumnWidthItem(newItem)) {
        return isLocatorsEqual(item.measureColumnWidthItem.locators, newItem.measureColumnWidthItem.locators);
    }

    if (isAllMeasureColumnWidthItem(item) && isAllMeasureColumnWidthItem(newItem)) {
        return true;
    }

    return false;
};

const measureWidth = width =>
    Model.measureColumnWidthItem("franchiseFees", width).attributeLocators({
        attributeIdentifier: "quarterDate",
        element: `/gdc/md/${projectId}/obj/2009/elements?id=1`,
    });

export class PivotTableSizingWithMultipleMeasuresExample extends Component {
    state = {
        columnWidths: [],
        autoResize: false,
        gridTableCount: 0,
    };

    onButtonClick = columnWidthItem => {
        const filteredColumnWidths = this.state.columnWidths.filter(
            item => !isSameWidthItem(item, columnWidthItem),
        );

        this.setState({
            columnWidths: [...filteredColumnWidths, columnWidthItem],
        });
    };

    onColumnResized = columnWidths => {
        this.setState({ columnWidths });
    };

    onAutoResizeChanged = () => {
        // change also PivotTable key so by this checkbox we simulate init render
        this.setState(prevState => ({
            autoResize: !prevState.autoResize,
            gridTableCount: prevState.gridTableCount + 1,
        }));
    };

    render() {
        return (
            <div>
                <div>
                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary s-change-width-button-attribute"
                        onClick={() => this.onButtonClick(attributeWidth(400))}
                    >
                        Change Location State column width to 400
                    </button>
                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary s-change-width-button-measure"
                        onClick={() => this.onButtonClick(measureWidth(60))}
                    >
                        Change Q1 column width to 60
                    </button>
                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary s-change-width-button-measure-all"
                        onClick={() => this.onButtonClick(allMeasureWidth(60))}
                    >
                        Change all measures width
                    </button>

                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary s-change-width-button-measure-all"
                        onClick={() => this.onButtonClick(weakMeasureWidth(60))}
                    >
                        Change Franchise Fees measure width
                    </button>

                    <label style={{ paddingLeft: 50 }}>
                        Auto resize:
                        <input
                            className="s-pivot-table-sizing-with-multiple-measures-autoresize"
                            name="autoresize-checkbox"
                            type="checkbox"
                            checked={this.state.autoResize}
                            onChange={this.onAutoResizeChanged}
                        />
                    </label>
                </div>
                <div
                    style={{ height: 300, marginTop: 20, resize: "both", overflow: "auto" }}
                    className="s-pivot-table-sizing-with-multiple-measures"
                >
                    <PivotTable
                        key={`PivotTableKey-${this.state.gridTableCount}`}
                        projectId={projectId}
                        measures={measures}
                        rows={attributes}
                        columns={columns}
                        config={{
                            columnSizing: {
                                columnWidths: [...this.state.columnWidths],
                                defaultWidth: this.state.autoResize ? "viewport" : "unset",
                                growToFit: false,
                            },
                        }}
                        pageSize={20}
                        onColumnResized={this.onColumnResized}
                    />
                </div>
                <div>columns state:</div>
                <div className="s-pivot-table-sizing-with-multiple-measures-callback">
                    {JSON.stringify(this.state.columnWidths)}
                </div>
            </div>
        );
    }
}

export default PivotTableSizingWithMultipleMeasuresExample;
