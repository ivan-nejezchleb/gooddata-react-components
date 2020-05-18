// (C) 2007-2020 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { screenshotWrap } from "@gooddata/test-storybook";
import { PivotTable } from "../../src";
import { onErrorHandler } from "../mocks";
import { ATTRIBUTE_1, ATTRIBUTE_2, MEASURE_1, MEASURE_2 } from "../data/componentProps";
import { ScreenshotReadyWrapper, visualizationNotLoadingResolver } from "../utils/ScreenshotReadyWrapper";

const wrapperStyle = { width: 1200, height: 300 };

storiesOf("Core components/PivotTableManualResizing", module)
    .add("manually resized simple table without auto resize and grow to fit", () => {
        const PivotTableWrapper = () => {
            const [attributeColumnWidth, setAttributeColumnWidth] = React.useState<number>(400);
            const [measureColumnWidth, setMeasureColumnWidth] = React.useState<number>(60);

            return (
                <>
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
                                                        measureIdentifier: "m1",
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
                    <button onClick={() => setAttributeColumnWidth(400)}>
                        Set attributes column to width 400
                    </button>
                    <button onClick={() => setAttributeColumnWidth(150)}>
                        Set attributes column to width 150
                    </button>
                    <button onClick={() => setMeasureColumnWidth(200)}>
                        Set measure columns to width 200
                    </button>
                    <button onClick={() => setMeasureColumnWidth(50)}>Set measure columns to width 50</button>
                </>
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
    .add("manually resized table with column attr and with auto resize and grow to fit", () => {
        const PivotTableWrapper = () => {
            const [attributeColumnWidth, setAttributeColumnWidth] = React.useState<number>(400);
            const [measureColumnWidth, setMeasureColumnWidth] = React.useState<number>(60);

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
                <>
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
                    <button onClick={() => setAttributeColumnWidth(400)}>
                        Set attributes column to width 400
                    </button>
                    <button onClick={() => setAttributeColumnWidth(50)}>
                        Set attributes column to width 50
                    </button>
                    <button onClick={() => setAttributeColumnWidth(0)}>
                        Remove width from attributes column
                    </button>
                    <button onClick={() => setMeasureColumnWidth(200)}>
                        Set measure columns to width 200
                    </button>
                    <button onClick={() => setMeasureColumnWidth(50)}>Set measure columns to width 50</button>
                    <button onClick={() => setMeasureColumnWidth(0)}>
                        Remove width from measure columns
                    </button>
                </>
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
    .add("manually resized simple table with grow to fit and without auto resize", () =>
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
                                columnWidths: [
                                    {
                                        measureColumnWidthItem: {
                                            width: 100,
                                            locators: [
                                                {
                                                    measureLocatorItem: {
                                                        measureIdentifier: "m1",
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        attributeColumnWidthItem: {
                                            width: 400,
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
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("manually resized simple table without grow to fit and with auto resize", () =>
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
                                columnWidths: [
                                    {
                                        measureColumnWidthItem: {
                                            width: 100,
                                            locators: [
                                                {
                                                    measureLocatorItem: {
                                                        measureIdentifier: "m1",
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        attributeColumnWidthItem: {
                                            width: 400,
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
                </div>
            </ScreenshotReadyWrapper>,
        ),
    )
    .add("manually resized table with column attr without auto resize and grow to fit", () => {
        const attributeWidth = {
            attributeColumnWidthItem: {
                width: 100,
                attributeIdentifier: ATTRIBUTE_1.visualizationAttribute.localIdentifier,
            },
        };
        const measureWidth = {
            measureColumnWidthItem: {
                width: 60,
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
        };
        const columnWidths = [measureWidth, attributeWidth];

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
    .add("manually resized table with column attr with auto resize and without grow to fit", () => {
        const attributeWidth = {
            attributeColumnWidthItem: {
                width: 400,
                attributeIdentifier: ATTRIBUTE_1.visualizationAttribute.localIdentifier,
            },
        };
        const measureWidth = {
            measureColumnWidthItem: {
                width: 60,
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
        };
        const columnWidths = [measureWidth, attributeWidth];

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
    .add("manually resized table with column attr without auto resize and with grow to fit", () => {
        const attributeWidth = {
            attributeColumnWidthItem: {
                width: 60,
                attributeIdentifier: ATTRIBUTE_1.visualizationAttribute.localIdentifier,
            },
        };
        const measureWidth = {
            measureColumnWidthItem: {
                width: 60,
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
        };
        const columnWidths = [measureWidth, attributeWidth];

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
