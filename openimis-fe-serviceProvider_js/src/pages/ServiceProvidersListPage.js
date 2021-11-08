import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { withHistory, historyPush, formatMessage, withTooltip } from "@openimis/fe-core";
import ServiceProvidersSearcher from "../components/SPsSearcher";

import { RIGHT_SERVICE_PROVIDER_ADD } from "../constants";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
});

class ServiceProvidersListPage extends Component {

    componentDidMount() {
        document.title = formatMessage(this.props.intl, "serviceProvider", "serviceProviders.page.title")
    }

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "serviceProvider.route.service_provider");
    }

    onDoubleClick = (sp) => {
        historyPush(this.props.modulesManager, this.props.history, "serviceProvider.route.service_provider", [sp.uuid])
    }

    render() {
        const { intl, classes, rights } = this.props;
        return (
            <div className={classes.page}>
                <ServiceProvidersSearcher
                    onDoubleClick={this.onDoubleClick}
                />
                {rights.includes(RIGHT_SERVICE_PROVIDER_ADD) &&
                withTooltip(
                    <div className={classes.fab}>
                        <Fab color="primary"
                            onClick={this.onAdd}>
                            <AddIcon />
                        </Fab>
                    </div>,
                formatMessage(intl, "serviceProvider", "addNewServiceProviderTooltip")
                )
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})

export default injectIntl(withTheme(withStyles(styles)
    (withHistory(connect(mapStateToProps)(ServiceProvidersListPage)))));