// (C) 2020 GoodData Corporation
import { IExtendedReferencePoint } from "../interfaces/Visualization";
import omitBy = require("lodash/omitBy");
import isNil = require("lodash/isNil");

export function removeColumnWidths(referencePoint: Readonly<IExtendedReferencePoint>) {
    if (
        referencePoint.properties &&
        referencePoint.properties.controls &&
        referencePoint.properties.controls.columnWidths
    ) {
        const properties = omitBy(
            {
                ...referencePoint.properties.controls,
                columnWidths: null,
            },
            isNil,
        );
        return {
            ...referencePoint,
            properties,
        };
    }

    return referencePoint;
}
