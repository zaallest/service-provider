import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import ServiceProviderForm from "../components/SProviderForm";
import {createPayPoint, updatePayPoint } from "../actions";
import {  RIGHT_PAY_POINT_ADD, RIGHT_PAY_POINT_EDIT,  } from "../constants";
import {PayPointLabel } from "../utils/utils";

const styles = theme => ({
    page: theme.page,
});

class PayPointPage extends Component {

    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "serviceProvider.route.serviceprovider")
    }

    save = (paypoint) => {
        if (!paypoint.uuid) {
            this.props.createPayPoint(
                this.props.modulesManager,
                paypoint,
                formatMessageWithValues(
                    this.props.intl,
                    "serviceProvider",
                    "CreatePayPoint.mutationLabel",
                    { label: PayPointLabel(paypoint) }
                )
            );
        } else {
            this.props.updatePayPoint(
                this.props.modulesManager,
                paypoint,
                formatMessageWithValues(
                    this.props.intl,
                    "serviceProvider",
                    "UpdatePayPointr.mutationLabel",
                    { label: PayPointLabel(paypoint) }
                )
            );

        }
    }

    //This section renders service rights and return the ServiceProviderForm page.....
    render() {
        const { classes, modulesManager, history, rights, paypoint_uuid, overview } = this.props;
        if (!rights.includes(RIGHT_PAY_POINT_EDIT)) return null;

        //Returns ServiceProviderForm page and inculde add and edit rights...
        return (
            <div className={classes.page}>
                <ServiceProviderForm
                    overview={overview}
                    paypoint_uuid={paypoint_uuid}
                    back={e => historyPush(modulesManager, history, "serviceProvider.route.serviceproviders")}
                    add={rights.includes(RIGHT_PAY_POINT_ADD) ? this.add : null}
                    save={rights.includes(RIGHT_PAY_POINT_EDIT) ? this.save : null}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    paypoint_uuid: props.match.params.paypoint_uuid,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createPayPoint, updatePayPoint }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(PayPointPage))
    ))));