// (C) 2007-2019 GoodData Corporation

import React, { Component } from "react";
import { Visualization, Model } from "@gooddata/react-components";

import "@gooddata/react-components/styles/css/main.css";

// import { totalSalesIdentifier, monthDateIdentifier, projectId } from "../utils/fixtures";

const filters = [
    Model.positiveAttributeFilter("label.customer.cid.name", [
        "/gdc/md/mk6vrbw9jyr9tn8nqcmwfzkxscnh1tqy/obj/417/elements?id=338",
    ]),
    Model.positiveAttributeFilter("label.acquirerbenchmarking.acquirerica.icaname", [
        "/gdc/md/mk6vrbw9jyr9tn8nqcmwfzkxscnh1tqy/obj/420/elements?id=3119",
    ]),
];

export class ColumnChartExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        return console.log("ColumnChartExample onLoadingChanged", ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        return console.log("ColumnChartExample onError", ...params);
    }

    render() {
        const projectId = "mk6vrbw9jyr9tn8nqcmwfzkxscnh1tqy";

        return (
            <div className="App">
                <header className="App-header">
                    <div style={{ width: 600, height: 800 }}>
                        <Visualization
                            projectId={projectId}
                            uri="/gdc/md/mk6vrbw9jyr9tn8nqcmwfzkxscnh1tqy/obj/751"
                            filters={filters}
                        />
                    </div>
                </header>
            </div>
        );
    }
}

export default ColumnChartExample;
