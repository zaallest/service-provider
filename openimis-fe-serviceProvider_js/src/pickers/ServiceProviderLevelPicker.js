import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { SERVICE_PROVIDER_LEVELS_TYPE } from "../constants";

class ServiceProviderLevelPicker extends Component {

    render() {
        return <ConstantBasedPicker
            module="serviceProvider"
            label="serviceProviderLevelType"
            constants={SERVICE_PROVIDER_LEVELS_TYPE}
            {...this.props}
        />
    }
}

export default ServiceProviderLevelPicker;