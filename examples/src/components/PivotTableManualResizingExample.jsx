// (C) 2020 GoodData Corporation
import React, { Component } from "react";
import { Model, PivotTable } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

import {
    projectId,
    quarterDateIdentifier,
    locationStateDisplayFormIdentifier,
    franchiseFeesIdentifier,
} from "../utils/fixtures";

const measures = [
    Model.measure(franchiseFeesIdentifier)
        .format("#,##0")
        .localIdentifier("franchiseFees"),
];

const attributes = [Model.attribute(locationStateDisplayFormIdentifier).localIdentifier("state")];

const columns = [Model.attribute(quarterDateIdentifier).localIdentifier("quarterDate")];

const attributeWidth = width => ({
    attributeColumnWidthItem: {
        width,
        attributeIdentifier: "state",
    },
});

const measureWidth = width => ({
    measureColumnWidthItem: {
        width,
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: "quarterDate",
                    element: `/gdc/md/${projectId}/obj/2009/elements?id=1`,
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: "franchiseFees",
                },
            },
        ],
    },
});

export class PivotTableManualResizingExample extends Component {
    state = {
        columnWidths: [measureWidth(200), attributeWidth(200)],
    };

    onButtonClick = columnWidth => {
        const filteredColumnWidths = [...this.state.columnWidths].filter(
            item => Object.keys(item)[0] !== Object.keys(columnWidth)[0],
        );

        this.setState({
            columnWidths: [...filteredColumnWidths, columnWidth],
        });
    };

    onColumnResized = columnWidths => {
        this.setState({ columnWidths });
    };

    render() {
        return (
            <>
                <div>
                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary"
                        onClick={() => this.onButtonClick(attributeWidth(400))}
                    >
                        Change "Location State" column width to 400
                    </button>
                    <button
                        className="gd-button gd-button-secondary gd-button gd-button-secondary"
                        onClick={() => this.onButtonClick(measureWidth(60))}
                    >
                        Change "Q1" column width to 60
                    </button>
                </div>
                <div
                    style={{ height: 300, marginTop: 20, resize: "both", overflow: "auto" }}
                    className="s-pivot-table-manual-resizing"
                >
                    <PivotTable
                        projectId={projectId}
                        measures={measures}
                        rows={attributes}
                        columns={columns}
                        config={{
                            columnSizing: {
                                columnWidths: [...this.state.columnWidths],
                            },
                        }}
                        pageSize={20}
                        onColumnResized={this.onColumnResized}
                    />
                </div>
            </>
        );
    }
}

export default PivotTableManualResizingExample;
