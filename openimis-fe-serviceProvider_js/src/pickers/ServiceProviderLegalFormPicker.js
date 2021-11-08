import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { SERVICE_PROVIDER_LEGAL_FORMS_TYPE } from "../constants";

class ServiceProviderLegalFormPicker extends Component {

    render() {
        return <ConstantBasedPicker
            module="serviceProvider"
            label="serviceProviderLegalForm"
            constants={SERVICE_PROVIDER_LEGAL_FORMS_TYPE}
            {...this.props}
        />
    }
}

export default ServiceProviderLegalFormPicker;
