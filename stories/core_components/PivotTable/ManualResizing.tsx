// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { PivotTable } from "../../../src";
import { onErrorHandler } from "../../mocks";
import { ATTRIBUTE_1, ATTRIBUTE_2, MEASURE_1, MEASURE_2 } from "../../data/componentProps";
import { ScreenshotReadyWrapper, visualizationNotLoadingResolver } from "../../utils/ScreenshotReadyWrapper";

const wrapperStyle = { width: 1200, height: 300 };
const ATTRIBUTE_WIDTH = 400;
const MEASURE_WIDTH = 60;
const measureColumnWidthItemSimple = {
    measureColumnWidthItem: {
        width: MEASURE_WIDTH,
        locators: [
            {
                measureLocatorItem: {
                    measureIdentifier: MEASURE_1.measure.localIdentifier,
                },
            },
        ],
    },
};
const measureColumnWidthItemWithAttr = {
    measureColumnWidthItem: {
        width: MEASURE_WIDTH,
        locators: [
            {
                attributeLocatorItem: {
                    attributeIdentifier: ATTRIBUTE_2.visualizationAttribute.localIdentifier,
                    element: "/gdc/md/storybook/obj/5/elements?id=1",
                },
            },
            {
                measureLocatorItem: {
                    measureIdentifier: MEASURE_1.measure.localIdentifier,
                },
            },
        ],
    },
};
const attributeColumnWidthItem = {
    attributeColumnWidthItem: {
        width: ATTRIBUTE_WIDTH,
        attributeIdentifier: ATTRIBUTE_1.visualizationAttribute.localIdentifier,
    },
};

storiesOf("Core components/PivotTable/ManualResizing/Simple table", module)
    .add("autoResize=off, growToFit=off", () => {
        const PivotTableWrapper = () => {
            const [attributeColumnWidth, setAttributeColumnWidth] = React.useState<number>(ATTRIBUTE_WIDTH);
            const [measureColumnWidth, setMeasureColumnWidth] = React.useState<number>(MEASURE_WIDTH);
            const handleAttributeButtonClick = (event: any) => {
                setAttributeColumnWidth(event.target.value);
            };
            const handleMeasureButtonClick = (event: any) => {
                setMeasureColumnWidth(event.target.value);
            };

            return (
                <React.Fragment>
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                defaultWidth: "unset",
                                growToFit: false,
                                columnWidths: [
                                    {
                                        measureColumnWidthItem: {
                                            width: measureColumnWidth,
                                            locators: [
                                                {
                                                    measureLocatorItem: {
                                                        measureIdentifier: MEASURE_1.measure.localIdentifier,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        attributeColumnWidthItem: {
                                            width: attributeColumnWidth,
                                            attributeIdentifier:
                                                ATTRIBUTE_1.visualizationAttribute.localIdentifier,
                                        },
                                    },
                                ],
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                    <button onClick={handleAttributeButtonClick} value={400}>
                        Set attributes column to width 400
                    </button>
                    <button onClick={handleAttributeButtonClick} value={150}>
                        Set attributes column to width 150
                    </button>
                    <button onClick={handleMeasureButtonClick} value={200}>
                        Set measure columns to width 200
                    </button>
                    <button onClick={handleMeasureButtonClick} value={50}>
                        Set measure columns to width 50
                    </button>
                </React.Fragment>
            );
        };
        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTableWrapper />
                </div>
            </ScreenshotReadyWrapper>,
        );
    })
    .add("autoResize=off, growToFit=on", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                defaultWidth: "unset",
                                growToFit: true,
                                columnWidths: [measureColumnWidthItemSimple, attributeColumnWidthItem],
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("autoResize=on, growToFit=off", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                defaultWidth: "viewport",
                                growToFit: false,
                                columnWidths: [measureColumnWidthItemSimple, attributeColumnWidthItem],
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("autoResize=on, growToFit=on", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                defaultWidth: "viewport",
                                growToFit: true,
                                columnWidths: [measureColumnWidthItemSimple, attributeColumnWidthItem],
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("manual size limits", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                defaultWidth: "viewport",
                                growToFit: true,
                                columnWidths: [
                                    {
                                        measureColumnWidthItem: {
                                            ...measureColumnWidthItemSimple.measureColumnWidthItem,
                                            width: 30, // Will be ignored and replaced by MIN_WIDTH limit
                                        },
                                    },
                                    {
                                        attributeColumnWidthItem: {
                                            ...attributeColumnWidthItem.attributeColumnWidthItem,
                                            width: 3000, // Will be ignored and replaced by MAX_WIDTH limit
                                        },
                                    },
                                ],
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("'auto' value in width definition", () =>
        screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        config={{
                            columnSizing: {
                                defaultWidth: "viewport",
                                growToFit: true,
                                columnWidths: [
                                    {
                                        measureColumnWidthItem: {
                                            ...measureColumnWidthItemSimple.measureColumnWidthItem,
                                            width: "auto",
                                        },
                                    },
                                    {
                                        attributeColumnWidthItem: {
                                            ...attributeColumnWidthItem.attributeColumnWidthItem,
                                            width: "auto",
                                        },
                                    },
                                ],
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        ),
    );
storiesOf("Core components/PivotTable/ManualResizing/Table with column attr", module)
    .add("autoResize=on, growToFit=on", () => {
        const PivotTableWrapper = () => {
            const [attributeColumnWidth, setAttributeColumnWidth] = React.useState<number>(400);
            const [measureColumnWidth, setMeasureColumnWidth] = React.useState<number>(60);
            const handleAttributeButtonClick = (event: any) => {
                setAttributeColumnWidth(event.target.value);
            };
            const handleMeasureButtonClick = (event: any) => {
                setMeasureColumnWidth(event.target.value);
            };

            const attributeWidth = attributeColumnWidth
                ? {
                      attributeColumnWidthItem: {
                          width: attributeColumnWidth,
                          attributeIdentifier: ATTRIBUTE_1.visualizationAttribute.localIdentifier,
                      },
                  }
                : undefined;

            const measureWidth = measureColumnWidth
                ? {
                      measureColumnWidthItem: {
                          width: measureColumnWidth,
                          locators: [
                              {
                                  attributeLocatorItem: {
                                      attributeIdentifier: "a2",
                                      element: "/gdc/md/storybook/obj/5/elements?id=1",
                                  },
                              },
                              {
                                  measureLocatorItem: {
                                      measureIdentifier: "m1",
                                  },
                              },
                          ],
                      },
                  }
                : undefined;

            const columnWidths = [measureWidth, attributeWidth].filter(Boolean);

            return (
                <React.Fragment>
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        columns={[ATTRIBUTE_2]}
                        config={{
                            columnSizing: {
                                defaultWidth: "viewport",
                                growToFit: true,
                                columnWidths,
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                    <button onClick={handleAttributeButtonClick} value={400}>
                        Set attributes column to width 400
                    </button>
                    <button onClick={handleAttributeButtonClick} value={50}>
                        Set attributes column to width 50
                    </button>
                    <button onClick={handleAttributeButtonClick} value={0}>
                        Remove width from attributes column
                    </button>
                    <button onClick={handleMeasureButtonClick} value={200}>
                        Set measure columns to width 200
                    </button>
                    <button onClick={handleMeasureButtonClick} value={50}>
                        Set measure columns to width 50
                    </button>
                    <button onClick={handleMeasureButtonClick} value={0}>
                        Remove width from measure columns
                    </button>
                </React.Fragment>
            );
        };
        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTableWrapper />
                </div>
            </ScreenshotReadyWrapper>,
        );
    })

    .add("autoResize=off, growToFit=off", () => {
        const columnWidths = [measureColumnWidthItemWithAttr, attributeColumnWidthItem];

        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        columns={[ATTRIBUTE_2]}
                        config={{
                            columnSizing: {
                                defaultWidth: "unset",
                                growToFit: false,
                                columnWidths,
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    })
    .add("autoResize=on, growToFit=off", () => {
        const columnWidths = [measureColumnWidthItemWithAttr, attributeColumnWidthItem];

        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        columns={[ATTRIBUTE_2]}
                        config={{
                            columnSizing: {
                                defaultWidth: "viewport",
                                growToFit: false,
                                columnWidths,
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    })
    .add("autoResize=off, growToFit=on", () => {
        const columnWidths = [measureColumnWidthItemWithAttr, attributeColumnWidthItem];

        return screenshotWrap(
            <ScreenshotReadyWrapper resolver={visualizationNotLoadingResolver()}>
                <div style={wrapperStyle} className="s-table">
                    <PivotTable
                        projectId="storybook"
                        measures={[MEASURE_1, MEASURE_2]}
                        rows={[ATTRIBUTE_1]}
                        columns={[ATTRIBUTE_2]}
                        config={{
                            columnSizing: {
                                defaultWidth: "unset",
                                growToFit: true,
                                columnWidths,
                            },
                        }}
                        onError={onErrorHandler}
                        LoadingComponent={null}
                        ErrorComponent={null}
                    />
                </div>
            </ScreenshotReadyWrapper>,
        );
    });
