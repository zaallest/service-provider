import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import { createOrUpdateServiceProvider } from "../actions";
import {RIGHT_SERVICE_PROVIDER_ADD, RIGHT_SERVICE_PROVIDER_EDIT } from "../constants";
import ServiceProviderForm from "../components/SPForm";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = theme => ({
    page: theme.page,
});


class HealthFacilityEditPage extends Component {

    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "serviceProvider.route.service_providers")
    }

    //This section creates or update service provider when inovked...
    save = (sp) => {
        this.props.createOrUpdateServiceProvider(
            sp,
            formatMessageWithValues(
                this.props.intl,
                "serviceProvider",
                !sp.uuid ? "CreateServiceProvider.mutationLabel" : "UpdateServiceProvider.mutationLabel",
                { code: sp.code }
            ),
            toast.success(<strong><em><h2> {this.formatMessageWithValues} Successfully...</h2></em></strong>, {
                position: toast.POSITION.TOP_RIGHT,
                className: 'toast-notify',
                progressClassName: 'notify-progress-bar',
                autoClose: 60000
              })
            
        );
        <ToastContainer />
    }

    render() {
        const { modulesManager, history, classes, rights, serviceprovider_uuid } = this.props;
        return (
            <div className={classes.page}>
                <ServiceProviderForm
                    serviceprovider_uuid={serviceprovider_uuid}
                    back={e => historyPush(modulesManager, history, "serviceProvider.route.service_providers")}
                    add={rights.includes(RIGHT_SERVICE_PROVIDER_ADD) ? this.add : null}
                    save={rights.includes(RIGHT_SERVICE_PROVIDER_EDIT) ? this.save : null}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    serviceprovider_uuid: props.match.params.serviceprovider_uuid,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createOrUpdateServiceProvider }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(HealthFacilityEditPage))
    ))));