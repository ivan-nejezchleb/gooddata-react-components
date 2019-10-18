// (C) 2007-2018 GoodData Corporation
import React from "react";

import ExampleWithSource from "../components/utils/ExampleWithSource";

import VisualizationColumnChartExample from "../components/VisualizationColumnChartByUriExample";
import VisualizationTableExample from "../components/VisualizationTableByUriExample";
import VisualizationBarExample from "../components/VisualizationBarByUriExample";
import VisualizationLineExample from "../components/VisualizationLineByUriExample";
import VisualizationAreaExample from "../components/VisualizationAreaByUriExample";
import VisualizationHeadlineExample from "../components/VisualizationHeadlineByUriExample";
import VisualizationScatterExample from "../components/VisualizationScatterByUriExample";
import VisualizationBubbleExample from "../components/VisualizationBubbleByUriExample";
import VisualizationPieExample from "../components/VisualizationPieByUriExample";
import VisualizationDonutExample from "../components/VisualizationDonutByUriExample";
import VisualizationTreemapExample from "../components/VisualizationTreemapByUriExample";
import VisualizationHeatmapExample from "../components/VisualizationHeatmapByUriExample";
import VisualizationComboExample from "../components/VisualizationComboByUriExample";

import VisualizationColumnChartByUriExampleSRC from "!raw-loader!../components/VisualizationColumnChartByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationTableExampleSRC from "!raw-loader!../components/VisualizationTableByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationBarExampleSRC from "!raw-loader!../components/VisualizationBarByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationLineExampleSRC from "!raw-loader!../components/VisualizationLineByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationAreaExampleSRC from "!raw-loader!../components/VisualizationAreaByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationHeadlineExampleSRC from "!raw-loader!../components/VisualizationHeadlineByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationScatterExampleSRC from "!raw-loader!../components/VisualizationScatterByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationBubbleExampleSRC from "!raw-loader!../components/VisualizationBubbleByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationPieExampleSRC from "!raw-loader!../components/VisualizationPieByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationDonutExampleSRC from "!raw-loader!../components/VisualizationDonutByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationTreemapExampleSRC from "!raw-loader!../components/VisualizationTreemapByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationHeatmapExampleSRC from "!raw-loader!../components/VisualizationHeatmapByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first
import VisualizationComboExampleSRC from "!raw-loader!../components/VisualizationComboByUriExample"; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions, import/first

export const VisualizationByUri = () => (
    <div>
        <h1>Visualization by URI</h1>

        <h2 id="area">Stacked Area Chart</h2>
        <ExampleWithSource for={VisualizationAreaExample} source={VisualizationAreaExampleSRC} />
    </div>
);

export default VisualizationByUri;
