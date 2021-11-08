import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { SERVICE_PROVIDER_SUB_LEVELS_TYPE } from "../constants";

class ServiceProviderSubLevelPicker extends Component {

    render() {
        return <ConstantBasedPicker
            module="serviceProvider"
            label="serviceProviderSubLevel"
            constants={SERVICE_PROVIDER_SUB_LEVELS_TYPE}
            {...this.props}
        />
    }
}

export default ServiceProviderSubLevelPicker;