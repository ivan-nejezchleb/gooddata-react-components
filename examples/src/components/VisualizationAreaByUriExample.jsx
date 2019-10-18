// (C) 2007-2018 GoodData Corporation
import React, { Component } from "react";
import "@gooddata/react-components/styles/css/main.css";
import { Visualization } from "@gooddata/react-components";

// import { projectId, areaVisualizationUri } from "../utils/fixtures";
const projectId = "onao6i5mwezrprltatd6lpihelbeuzxa";

export class VisualizationTable extends Component {
    render() {
        return (
            <header className="App-header">
                <div style={{ width: 600, height: 300 }}>
                    <Visualization
                        projectId={projectId}
                        uri="/gdc/md/onao6i5mwezrprltatd6lpihelbeuzxa/obj/76243"
                        drillableItems={[{ uri: "/gdc/md/onao6i5mwezrprltatd6lpihelbeuzxa/obj/14636" }]}
                        onFiredDrillEvent={console.log}
                        onDrill={console.log}
                    />
                </div>
                <div style={{ width: 600, height: 400 }}>
                    <Visualization
                        projectId={projectId}
                        uri="/gdc/md/onao6i5mwezrprltatd6lpihelbeuzxa/obj/76244"
                        drillableItems={[{ uri: "/gdc/md/onao6i5mwezrprltatd6lpihelbeuzxa/obj/14636" }]}
                        onFiredDrillEvent={console.log}
                        onDrill={console.log}
                    />
                </div>
                <div style={{ width: 800, height: 400 }}>
                    <Visualization
                        projectId={projectId}
                        uri="/gdc/md/onao6i5mwezrprltatd6lpihelbeuzxa/obj/76245"
                        drillableItems={[{ uri: "/gdc/md/onao6i5mwezrprltatd6lpihelbeuzxa/obj/14636" }]}
                        onFiredDrillEvent={console.log}
                        onDrill={console.log}
                    />
                </div>
            </header>
        );
    }
}

export default VisualizationTable;
