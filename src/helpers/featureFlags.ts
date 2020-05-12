// (C) 2007-2020 GoodData Corporation
import { IFeatureFlags, SDK } from "@gooddata/gooddata-js";
import { getCachedOrLoad } from "./sdkCache";
import { IChartConfig } from "../interfaces/Config";
import isNil = require("lodash/isNil");
import merge = require("lodash/merge");
import { IColumnSizing, IPivotTableConfig } from "../interfaces/PivotTable";

export async function getFeatureFlags(sdk: SDK, projectId: string): Promise<IFeatureFlags> {
    const apiCallIdentifier = `getFeatureFlags.${projectId}`;
    const loader = () => sdk.project.getFeatureFlags(projectId);
    try {
        return getCachedOrLoad(apiCallIdentifier, loader);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(`unable to retrieve featureFlags for project ${projectId}`, error);
        throw Error(error);
    }
}

export function setConfigFromFeatureFlags(config: IChartConfig, featureFlags: IFeatureFlags): IChartConfig {
    if (!featureFlags) {
        return config;
    }

    let result = config;
    if (
        featureFlags.disableKpiDashboardHeadlineUnderline === true &&
        (!config || isNil(config.disableDrillUnderline))
    ) {
        result = { ...result, disableDrillUnderline: true };
    }
    return result;
}

// export function getTableConfigFromFeatureFlags(featureFlags: IFeatureFlags): IPivotTableConfig {
//     let columnSizing: IColumnSizing = {};

//     if (featureFlags.enableTableColumnsAutoResizing) {
//         columnSizing = merge(columnSizing, {
//             defaultWidth: "viewport",
//         });
//     }

//     if (featureFlags.enableTableColumnsGrowToFit) {
//         columnSizing = merge(columnSizing, {
//             growToFit: true,
//         });
//     }

//     return {
//         columnSizing,
//     };
// }
// TODO: ONE-4407 refactor - here should be only feature flag logic
export function getTableConfigFromFeatureFlags(
    config: IPivotTableConfig,
    featureFlags: IFeatureFlags,
    predicateEnvironment: boolean = true,
    widthDefs?: any,
): IPivotTableConfig {
    let result: IPivotTableConfig = {
        ...config,
    };
    let columnSizing: IColumnSizing = { defaultWidth: "unset" };

    if (featureFlags.enableTableColumnsAutoResizing) {
        columnSizing = { defaultWidth: "viewport" };
        result = merge(result, { columnSizing });
    }

    if (featureFlags.enableTableColumnsManualResizing && widthDefs) {
        columnSizing = {
            ...columnSizing,
            columnWidths: widthDefs,
        };
        result = merge(result, { columnSizing });
    }

    if (featureFlags.enableTableColumnsGrowToFit && predicateEnvironment) {
        result = merge(result, { growToFit: true });
    }

    return result;
}
