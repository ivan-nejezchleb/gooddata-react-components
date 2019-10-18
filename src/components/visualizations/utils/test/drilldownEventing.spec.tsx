// (C) 2007-2019 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import { AFM } from "@gooddata/typings";
import Highcharts from "../../chart/highcharts/highchartsEntryPoint";
import {
    getClickableElementNameByChartType,
    chartClick,
    cellClick,
    createDrillIntersectionElement,
    convertHeadlineDrillIntersectionToLegacy,
    getDrillIntersection,
} from "../drilldownEventing";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { SeriesChartTypes } from "../../../../constants/series";
import * as fixtures from "../../../../../stories/test_data/fixtures";
import {
    IDrillConfig,
    IHighchartsPointObject,
    IDrillEventIntersectionElementExtended,
} from "../../../../interfaces/DrillEvents";
import { getMVS } from "../../chart/test/helper";

describe("Drilldown Eventing", () => {
    jest.useFakeTimers();
    const ADHOC_MEASURE_LOCAL_IDENTIFIER = "m1";
    const ADHOC_MEASURE_URI = "/gdc/md/projectId/obj/2";
    const afm: AFM.IAfm = {
        measures: [
            {
                localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                definition: {
                    measure: {
                        item: {
                            uri: ADHOC_MEASURE_URI,
                        },
                    },
                },
            },
        ],
    };
    const point: Partial<IHighchartsPointObject> = {
        x: 1,
        y: 2,
        value: 678.0,
        drillIntersection: [
            {
                header: {
                    measureHeaderItem: {
                        uri: "uri1",
                        identifier: "identifier1",
                        localIdentifier: "id",
                        name: "title",
                        format: "",
                    },
                },
            },
            {
                header: {
                    measureHeaderItem: {
                        uri: "uri2",
                        identifier: "identifier2",
                        localIdentifier: "id",
                        name: "title",
                        format: "",
                    },
                },
            },
            {
                header: {
                    measureHeaderItem: {
                        uri: "uri3",
                        identifier: "identifier3",
                        localIdentifier: "id",
                        name: "title",
                        format: "",
                    },
                },
            },
        ],
    };
    const pointClickEventData = ({ point } as any) as Highcharts.DrilldownEventObject;

    it("should get clickable chart element name", () => {
        const fn = getClickableElementNameByChartType;
        expect(fn(VisualizationTypes.LINE)).toBe("point");
        expect(fn(VisualizationTypes.COLUMN)).toBe("bar");
        expect(fn(VisualizationTypes.BAR)).toBe("bar");
        expect(fn(VisualizationTypes.PIE)).toBe("slice");
        expect(fn(VisualizationTypes.TREEMAP)).toBe("slice");
        expect(fn(VisualizationTypes.HEATMAP)).toBe("cell");
        expect(() => {
            fn("headline"); // headline is not defined
        }).toThrowError();
    });

    it("should call point drill context (non-group) when event.points given but null", () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const pointClickEventDataWithNullPoints: Highcharts.DrilldownEventObject = {
            ...pointClickEventData,
            points: null,
        };

        chartClick(
            drillConfig,
            pointClickEventDataWithNullPoints,
            (target as any) as EventTarget,
            VisualizationTypes.LINE,
        );

        jest.runAllTimers();

        const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;
        expect(drillContext.element).toEqual("point");
    });

    it("should call default fire event on point click and fire correct data", () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(drillConfig, pointClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI,
                                },
                            },
                        },
                    },
                ],
            },
            drillContext: {
                type: "line",
                element: "point",
                x: 1,
                y: 2,
                intersection: [
                    {
                        id: "id",
                        title: "title",
                        header: {
                            identifier: "identifier1",
                            uri: "uri1",
                        },
                    },
                    {
                        id: "id",
                        title: "title",
                        header: {
                            identifier: "identifier2",
                            uri: "uri2",
                        },
                    },
                    {
                        id: "id",
                        title: "title",
                        header: {
                            identifier: "identifier3",
                            uri: "uri3",
                        },
                    },
                ],
            },
        });
    });

    it('should fire correct data with property "value" for treemap and heatmap', () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            pointClickEventData,
            (target as any) as EventTarget,
            VisualizationTypes.TREEMAP,
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail.drillContext.value).toBe("678");

        chartClick(
            drillConfig,
            pointClickEventData,
            (target as any) as EventTarget,
            VisualizationTypes.HEATMAP,
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail.drillContext.value).toBe("678");
    });

    it("should remove duplicated values for heatmap", () => {
        const drillIntersections: IDrillEventIntersectionElementExtended[] = [
            {
                header: {
                    attributeHeaderItem: {
                        uri:
                            "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/1281/elements?id=1deea80aa5a54d1bbbc2e2de63989eef",
                        name: "Best Case",
                    },
                    attributeHeader: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/1282",
                        identifier: "ac3EwmqvbxcX",
                        localIdentifier: "a1",
                        name: "Case",
                        formOf: {
                            uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/1281",
                            identifier: "identifier1",
                            name: "Case",
                        },
                    },
                },
            },
            {
                header: {
                    attributeHeaderItem: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/951/elements?id=168279",
                        name: "CompuSci",
                    },
                    attributeHeader: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/952",
                        identifier: "label.product.id.name",
                        localIdentifier: "a2",
                        name: "Product",
                        formOf: {
                            uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/951",
                            identifier: "label.product.id",
                            name: "Product",
                        },
                    },
                },
            },
            {
                header: {
                    attributeHeaderItem: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/323/elements?id=2010",
                        name: "2010",
                    },
                    attributeHeader: {
                        uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/324",
                        identifier: "closed.aag81lMifn6q",
                        localIdentifier: "a3",
                        name: "Closed",
                        formOf: {
                            uri: "/gdc/md/dfnkvzqa683mz1c29ijdkydrsodm8wjw/obj/323",
                            identifier: "closed",
                            name: "Closed",
                        },
                    },
                },
            },
        ];
        const pointsWithEmptyValues: Array<Partial<IHighchartsPointObject>> = [
            { x: 0, y: 0, value: 268.8, drillIntersection: drillIntersections },
            { x: 0, y: 1, value: null, drillIntersection: drillIntersections },
            {
                x: 0,
                y: 1,
                value: null,
                drillIntersection: drillIntersections,
                ignoredInDrillEventContext: true,
            },
            { x: 0, y: 2, value: null, drillIntersection: drillIntersections },
            {
                x: 0,
                y: 2,
                value: null,
                drillIntersection: drillIntersections,
                ignoredInDrillEventContext: true,
            },
            { x: 0, y: 3, value: 3644, drillIntersection: drillIntersections },
        ];
        const pointClickWithEmptyEventData: Highcharts.DrilldownEventObject = {
            points: pointsWithEmptyValues,
        } as any;

        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };

        chartClick(
            drillConfig,
            pointClickWithEmptyEventData,
            (target as any) as EventTarget,
            VisualizationTypes.HEATMAP,
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail.drillContext.points).toEqual([
            {
                intersection: drillIntersections,
                x: 0,
                y: 0,
            },
            {
                intersection: drillIntersections,
                x: 0,
                y: 1,
            },
            {
                intersection: drillIntersections,
                x: 0,
                y: 2,
            },
            {
                intersection: drillIntersections,
                x: 0,
                y: 3,
            },
        ]);
    });

    it("should correctly handle z coordinate of point", () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const pointClickWitZEventData = cloneDeep(pointClickEventData);

        pointClickWitZEventData.point.z = 12000;

        chartClick(
            drillConfig,
            pointClickWitZEventData,
            (target as any) as EventTarget,
            VisualizationTypes.BUBBLE,
        );

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI,
                                },
                            },
                        },
                    },
                ],
            },
            drillContext: {
                type: "bubble",
                element: "point",
                x: 1,
                y: 2,
                z: 12000,
                intersection: [
                    {
                        id: "id",
                        title: "title",
                        header: {
                            identifier: "identifier1",
                            uri: "uri1",
                        },
                    },
                    {
                        id: "id",
                        title: "title",
                        header: {
                            identifier: "identifier2",
                            uri: "uri2",
                        },
                    },
                    {
                        id: "id",
                        title: "title",
                        header: {
                            identifier: "identifier3",
                            uri: "uri3",
                        },
                    },
                ],
            },
        });
    });

    it("should call user defined callback on point click", () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn() };
        const target = { dispatchEvent: () => true };

        chartClick(drillConfig, pointClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
    });

    it("should call both default fire event and user defined callback on point click", () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn() };
        const target = { dispatchEvent: jest.fn() };

        chartClick(drillConfig, pointClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();
        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
    });

    it("should only call user defined callback on point click", () => {
        const drillConfig = { afm, onFiredDrillEvent: jest.fn().mockReturnValue(false) };
        const target = { dispatchEvent: jest.fn() };

        chartClick(drillConfig, pointClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(target.dispatchEvent).not.toHaveBeenCalled();
        expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
    });

    it("should call fire event on label click", () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const clickedPoint: Partial<IHighchartsPointObject> = {
            x: 1,
            y: 2,
            drillIntersection: [
                {
                    header: {
                        measureHeaderItem: {
                            uri: "uri1",
                            identifier: "identifier1",
                            localIdentifier: "id",
                            name: "title",
                            format: "",
                        },
                    },
                },
            ],
        };
        const labelClickEventData = ({
            points: [clickedPoint],
        } as any) as Highcharts.DrilldownEventObject;

        chartClick(drillConfig, labelClickEventData, (target as any) as EventTarget, VisualizationTypes.LINE);

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI,
                                },
                            },
                        },
                    },
                ],
            },
            drillContext: {
                type: "line",
                element: "label",
                points: [
                    {
                        x: 1,
                        y: 2,
                        intersection: [
                            {
                                id: "id",
                                title: "title",
                                header: {
                                    identifier: "identifier1",
                                    uri: "uri1",
                                },
                            },
                        ],
                    },
                ],
            },
        });
    });

    it("should call fire event on cell click", () => {
        const drillConfig = { afm, onFiredDrillEvent: () => true };
        const target = { dispatchEvent: jest.fn() };
        const cellClickEventData = {
            columnIndex: 1,
            rowIndex: 2,
            row: ["3"],
            intersection: [
                {
                    id: "id1",
                    title: "title1",
                    header: {
                        identifier: "identifier1",
                        uri: "uri1",
                    },
                },
            ],
        };

        cellClick(drillConfig, cellClickEventData, (target as any) as EventTarget);

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: {
                measures: [
                    {
                        localIdentifier: ADHOC_MEASURE_LOCAL_IDENTIFIER,
                        definition: {
                            measure: {
                                item: {
                                    uri: ADHOC_MEASURE_URI,
                                },
                            },
                        },
                    },
                ],
            },
            drillContext: {
                type: "table",
                element: "cell",
                columnIndex: 1,
                rowIndex: 2,
                row: ["3"],
                intersection: [
                    {
                        id: "id1",
                        title: "title1",
                        header: {
                            identifier: "identifier1",
                            uri: "uri1",
                        },
                    },
                ],
            },
        });
    });

    describe("createDrillIntersectionElement", () => {
        it("should return empty id when id not provided", () => {
            const element = createDrillIntersectionElement(undefined, "title");

            expect(element).toEqual({
                id: "",
                title: "title",
            });
        });

        it("should return empty title when title not provided", () => {
            const element = createDrillIntersectionElement("id", undefined);

            expect(element).toEqual({
                id: "id",
                title: "",
            });
        });

        it("should return intersection element with only id and title when no uri and identifier provided", () => {
            const element = createDrillIntersectionElement("id", "title");

            expect(element).toEqual({
                id: "id",
                title: "title",
            });
        });

        it("should return intersection element with header", () => {
            const element = createDrillIntersectionElement("id", "title", "uri", "identifier");

            expect(element).toEqual({
                id: "id",
                title: "title",
                header: {
                    uri: "uri",
                    identifier: "identifier",
                },
            });
        });

        // tslint:disable-next-line:max-line-length
        it("should return intersection element with header with uri and empty identifier when only uri provided", () => {
            const element = createDrillIntersectionElement("id", "title", "uri");

            expect(element).toEqual({
                id: "id",
                title: "title",
                header: {
                    uri: "uri",
                    identifier: "",
                },
            });
        });

        // tslint:disable-next-line:max-line-length
        it("should return intersection element with header with identifier and empty uri when only identifier provided", () => {
            const element = createDrillIntersectionElement("id", "title", undefined, "identifier");

            expect(element).toEqual({
                id: "id",
                title: "title",
                header: {
                    uri: "",
                    identifier: "identifier",
                },
            });
        });

        it("should fire drill event (non-group) when point value is null and return empty string for value", () => {
            const drillConfig = { afm, onFiredDrillEvent: jest.fn() };
            const target = { dispatchEvent: jest.fn() };
            const pointClickEventDataWithPointNullValue: Highcharts.DrilldownEventObject = {
                ...pointClickEventData,
                points: null,
            };

            pointClickEventDataWithPointNullValue.point.value = null;

            chartClick(
                drillConfig,
                pointClickEventDataWithPointNullValue,
                (target as any) as EventTarget,
                VisualizationTypes.HEATMAP,
            );

            jest.runAllTimers();

            const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;
            expect(drillContext.value).toEqual("");
            expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
        });
    });

    describe("Drilling in Combo chart", () => {
        const columnPoint: IHighchartsPointObject = {
            ...point,
            series: { type: SeriesChartTypes.COLUMN },
        } as any;

        const linePoint: IHighchartsPointObject = {
            ...point,
            x: 2,
            y: 3,
            series: { type: SeriesChartTypes.LINE },
            drillIntersection: [
                {
                    id: "id4",
                    title: "title4",
                    header: {
                        identifier: "identifier4",
                        uri: "uri4",
                    },
                },
                {
                    id: "id5",
                    title: "title5",
                    header: {
                        identifier: "identifier5",
                        uri: "uri5",
                    },
                },
                {
                    id: "id6",
                    title: "title6",
                    header: {
                        identifier: "identifier6",
                        uri: "uri6",
                    },
                },
            ],
        } as any;

        it("should return chart type for each point", () => {
            const drillConfig: IDrillConfig = { afm, onFiredDrillEvent: jest.fn() };
            const target: any = { dispatchEvent: jest.fn() };
            const pointClickEventData: Highcharts.DrilldownEventObject = {
                point: columnPoint,
                points: [columnPoint, linePoint],
            } as any;

            chartClick(drillConfig, pointClickEventData, target as EventTarget, VisualizationTypes.COMBO2);

            jest.runAllTimers();

            const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;

            expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
            expect(drillContext).toEqual({
                type: VisualizationTypes.COMBO,
                element: "label",
                points: [
                    {
                        x: columnPoint.x,
                        y: columnPoint.y,
                        intersection: columnPoint.drillIntersection,
                        type: SeriesChartTypes.COLUMN,
                    },
                    {
                        x: linePoint.x,
                        y: linePoint.y,
                        intersection: linePoint.drillIntersection,
                        type: SeriesChartTypes.LINE,
                    },
                ],
            });
        });

        it("should fire event on cell click and fire correct data", () => {
            const drillConfig: IDrillConfig = { afm, onFiredDrillEvent: () => true };
            const target: any = { dispatchEvent: jest.fn() };
            const pointClickEventData: Highcharts.DrilldownEventObject = {
                point: linePoint,
                points: null,
            } as any;

            chartClick(drillConfig, pointClickEventData, target as EventTarget, VisualizationTypes.COMBO2);

            jest.runAllTimers();

            expect(target.dispatchEvent).toHaveBeenCalled();
            expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
                executionContext: afm,
                drillContext: {
                    type: VisualizationTypes.COMBO,
                    element: "point",
                    elementChartType: SeriesChartTypes.LINE,
                    x: linePoint.x,
                    y: linePoint.y,
                    intersection: linePoint.drillIntersection,
                },
            });
        });

        it("should NOT add chart type for each point if it is not Combo chart", () => {
            const drillConfig: IDrillConfig = { afm, onFiredDrillEvent: jest.fn() };
            const target: any = { dispatchEvent: jest.fn() };
            const pointClickEventData: Highcharts.DrilldownEventObject = {
                point: columnPoint,
                points: [columnPoint],
            } as any;

            chartClick(drillConfig, pointClickEventData, target as EventTarget, VisualizationTypes.COLUMN);

            jest.runAllTimers();

            const drillContext = target.dispatchEvent.mock.calls[0][0].detail.drillContext;

            expect(drillConfig.onFiredDrillEvent).toHaveBeenCalled();
            expect(drillContext).toEqual({
                type: VisualizationTypes.COLUMN,
                element: "label",
                points: [
                    {
                        x: columnPoint.x,
                        y: columnPoint.y,
                        intersection: columnPoint.drillIntersection,
                    },
                ],
            });
        });

        it("should NOT add elementChartType on cell click if it is not Combo chart", () => {
            const drillConfig: IDrillConfig = { afm, onFiredDrillEvent: () => true };
            const target: any = { dispatchEvent: jest.fn() };
            const pointClickEventData: Highcharts.DrilldownEventObject = {
                point: linePoint,
                points: null,
            } as any;

            chartClick(drillConfig, pointClickEventData, target as EventTarget, VisualizationTypes.LINE);

            jest.runAllTimers();

            expect(target.dispatchEvent).toHaveBeenCalled();
            expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
                executionContext: afm,
                drillContext: {
                    type: VisualizationTypes.LINE,
                    element: "point",
                    x: linePoint.x,
                    y: linePoint.y,
                    intersection: linePoint.drillIntersection,
                },
            });
        });
    });

    describe("convertHeadlineDrillIntersectionToLegacy", () => {
        it("should handle empty intersection", () => {
            expect(convertHeadlineDrillIntersectionToLegacy([], afm)).toEqual([]);
        });

        it("should convert IMeasureHeaderItem in extended selection", () => {
            const afm: AFM.IAfm = {
                measures: [
                    {
                        localIdentifier: "m1",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/project_id/obj/1",
                                },
                            },
                        },
                    },
                ],
            };
            const drillIntersectionExteded: IDrillEventIntersectionElementExtended = {
                header: {
                    measureHeaderItem: {
                        name: "Lost",
                        format: "$#,##0.00",
                        localIdentifier: "m1",
                        uri: "/gdc/md/project_id/obj/1",
                        identifier: "metric.lost",
                    },
                },
            };
            const expectedIntersection = [
                {
                    id: "m1",
                    title: "Lost",
                    header: {
                        uri: "/gdc/md/project_id/obj/1",
                        identifier: "",
                    },
                },
            ];
            expect(convertHeadlineDrillIntersectionToLegacy([drillIntersectionExteded], afm)).toEqual(
                expectedIntersection,
            );
        });
    });

    describe("getDrillIntersection", () => {
        it("should return correct intersection for bar chart with stack by and view by attributes", () => {
            const dataSet = fixtures.barChartWithStackByAndViewByAttributes;
            const { measureGroup, viewByAttribute, stackByAttribute } = getMVS(dataSet);
            /*
            "measureHeaderItem": {
                "name": "Amount",
                "format": "#,##0.00",
                "localIdentifier": "amountMetric",
                "uri": "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1279",
                "identifier": "ah1EuQxwaCqs"
            }
            */
            const measures = [measureGroup.items[0].measureHeaderItem];

            const viewByItem = {
                ...viewByAttribute.items[0].attributeHeaderItem,
                attribute: viewByAttribute,
            };

            const stackByItem = {
                ...stackByAttribute.items[0].attributeHeaderItem,
                attribute: stackByAttribute,
            };

            const { afm } = dataSet.executionRequest;
            const drillIntersection = getDrillIntersection(stackByItem, [viewByItem], measures, afm);
            expect(drillIntersection).toEqual([
                {
                    id: "amountMetric",
                    title: "Amount",
                    header: {
                        identifier: "ah1EuQxwaCqs",
                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1279",
                    },
                },
                {
                    id: "1226",
                    title: "Direct Sales",
                    header: {
                        identifier: "label.owner.department",
                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1027",
                    },
                },
                {
                    id: "1225",
                    title: "East Coast",
                    header: {
                        identifier: "label.owner.region",
                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1024",
                    },
                },
            ]);
        });

        it("should return correct intersection for pie chart measures only", () => {
            const dataSet = fixtures.pieChartWithMetricsOnly;
            const { measureGroup } = getMVS(dataSet);
            const measures = [measureGroup.items[0].measureHeaderItem];

            const viewByItem: any = null;
            const stackByItem: any = null;

            const { afm } = dataSet.executionRequest;
            const drillIntersection = getDrillIntersection(stackByItem, [viewByItem], measures, afm);
            expect(drillIntersection).toEqual([
                {
                    id: "lostMetric",
                    title: "Lost",
                    header: {
                        identifier: "af2Ewj9Re2vK",
                        uri: "/gdc/md/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/obj/1283",
                    },
                },
            ]);
        });
    });
});
