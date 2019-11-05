// (C) 2019 GoodData Corporation
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { screenshotWrap } from "@gooddata/test-storybook";
import { wrap } from "../utils/wrap";
import { Headline } from "../../src/components/Headline";
import "../../styles/scss/headline.scss";
import { MEASURE_1_WITH_ALIAS } from "../data/componentProps";

const pushData = (event: any) => {
    action("possibleDrillableItems")(event);
    // tslint:disable-next-line: no-console
    console.log("possibleDrillableItems");
};

storiesOf("Internal/PossibleDrillableItems", module).add("Headline", () =>
    screenshotWrap(
        wrap(
            <Headline
                projectId="storybook"
                primaryMeasure={MEASURE_1_WITH_ALIAS}
                LoadingComponent={null}
                ErrorComponent={null}
                pushData={pushData}
            />,
            "auto",
            300,
        ),
    ),
);
