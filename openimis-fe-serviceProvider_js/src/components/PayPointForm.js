import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay"
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
    Form, ProgressOrError, journalize, coreConfirm, parseData
} from "@openimis/fe-core";
import { RIGHT_FAMILY, RIGHT_FAMILY_EDIT, RIGHT_PAY_POINT } from "../constants";
// import FamilyMasterPanel from "./FamilyMasterPanel";
// import ServiceProviderMasterPanel from "./ServiceProviderMasterPanel1";

import { fetchPayPoint, createPayPoint,fetchPayPointMutation, newPayPoint,fetchServiceProvider, newServiceProvider, createServiceProvider, fetchServiceProviderMutation } from "../actions";
// import FamilyInsureesOverview from "./FamilyInsureesOverview";
// import HeadInsureeMasterPanel from "./HeadInsureeMasterPanel";
import AddServiceProvider from "../pages/AddServiceProvider";
import AddPayPoint from "../pages/AddPayPoint";
import { PayPointLabel } from "../utils/utils";

const styles = theme => ({
    lockedPage: theme.page.locked
});


const PAYPOINT_PANELS_CONTRIBUTION_KEY = "serviceProvider.payPoint.panels"
const PAYPOINT_OVERVIEW_PANELS_CONTRIBUTION_KEY = "serviceProvider.ServiceProviderOverview.panels"
const SERVICEPROVIDER_OVERVIEW_CONTRIBUTED_MUTATIONS_KEY = "serviceProvider.ServiceProviderOverview.mutations"

class ServiceProviderForm extends Component {

    state = {
        lockNew: false,
        reset: 0,
        paypoint: this._newPayPoint(),
        newPayPoint: true,
        confirmedAction: null,
    }

    //Call for new paypoint
    _newPayPoint() {
        let paypoint = {};
        paypoint.jsonExt = {};
        return paypoint;
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "serviceProvider", !!this.props.overview ? "PayPointOverview.title" : "pay_point.title", { label: "" })
        if (this.props.paypoint_uuid) {
            this.setState(
                (state, props) => ({ paypoint_uuid: props.paypoint_uuid }),
                e => this.props.fetchPayPoint(
                    this.props.modulesManager,
                    this.props.paypoint_uuid
                )
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.paypoint && prevState.paypoint.paypointName)
            !== (this.state.paypoint && this.state.paypoint.paypointName)) {
            document.title = formatMessageWithValues(this.props.intl, "serviceProvider", !!this.props.overview ? "PayPointOverview.title" : "pay_point.title", { label: PayPointLabel(this.state.paypoint.paypointName) })
        }
        if (!prevProps.fetchPayPoint && !!this.props.fetchPayPoints) {
            var paypoint = this.props.paypoint;
            if (paypoint) {
                paypoint.ext = !!paypoint.jsonExt ? JSON.parse(paypoint.jsonExt) : {};
                this.setState(
                    { paypoint, paypoint_uuid: paypoint.uuid, lockNew: false, newPayPoint: false });
            }
        } else if (prevProps.paypoint_uuid && !this.props.paypoint_uuid) {
            document.title = formatMessageWithValues(this.props.intl, "serviceProvider", !!this.props.overview ? "PayPointrOverview.title" : "pay_point.title", { label: PayPointLabel(this.state.paypoint.paypointName) })
            this.setState({ paypoint: this._newPayPoint(), newPayPoint: true, lockNew: false, paypoint_uuid: null });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState((state, props) => ({
                paypoint: { ...state.paypoint, clientMutationId: props.mutation.clientMutationId }
            }));
        } else if (prevProps.confirmed !== this.props.confirmed && !!this.props.confirmed && !!this.state.confirmedAction) {
            this.state.confirmedAction();
        }
    }

    _add = () => {
        this.setState((state) => ({
            paypoint: this._newServiceProvider(),
            newPayPoint: true,
            lockNew: false,
            reset: state.reset + 1,
        }),
            e => {
                this.props.add();
                this.forceUpdate();
            }
        )
    }

    //This allows the page to reloade
    reload = () => {
        const { paypoint } = this.state;
        const { clientMutationId, paypoint } = this.props.mutation;

        if (clientMutationId && !paypointUuid) { 
            // creation, we need to fetch the new serviceprovider uuid from mutations logs and redirect to serviceprovider overview
            this.props.fetchServiceProviderMutation(
                this.props.modulesManager,
                clientMutationId
            ).then(res => {
                const mutationLogs = parseData(res.payload.data.mutationLogs)
                if (mutationLogs
                    && mutationLogs[0]
                    && mutationLogs[0].families
                    && mutationLogs[0].families[0]
                    && mutationLogs[0].families[0].serviceprovider) {
                        const uuid = parseData(res.payload.data.mutationLogs)[0].families[0].serviceprovider.uuid;
                        if (uuid) {
                            historyPush(this.props.modulesManager, this.props.history, "serviceProvider.route.serviceProviderlOverview", [uuid]);
                        }
                }
            });
        } else {
            
            this.props.fetchServiceProvider(
                this.props.modulesManager,
                serviceproviderUuid,
                !!serviceprovider.name ? serviceprovider.name : null,
                serviceprovider.clientMutationId
            );
        }
    }

    //This section determins the fields required to be entered for the data to save...
    canSave = () => {
        if (!this.state.serviceprovider.name) return false;
        if (!this.state.serviceprovider.code) return false;
        if (!this.state.serviceprovider.legalForm) return false;
        if (!this.state.serviceprovider.level) return false;
        if (!this.state.serviceprovider.subLevel) return false;
        if (!this.state.serviceprovider.accountCode) return false;
        if (!this.state.serviceprovider.phoneNumber) return false;
        if (!this.state.serviceprovider.email) return false;
        if (!this.state.serviceprovider.address) return false;
        if (!this.state.serviceprovider.fax) return false;
        return true;
    }

    //This triggers the save action...
    _save = (serviceprovider) => {
        this.setState(
            { lockNew: !serviceprovider.uuid }, // avoid duplicates
            e => this.props.save(serviceprovider))
    }

    //This gets the data to edit the changes...
    onEditedChanged = serviceprovider => {
        this.setState({ serviceprovider, newServiceProvider: false })
    }

    //Action to confirm operation on updating data or deleting data
    onActionToConfirm = (title, message, confirmedAction) => {
        this.setState(
            { confirmedAction },
            this.props.coreConfirm(
                title,
                message
            )
        )
    }

    render() {
        //Initializing constats veriables...
        const { modulesManager, classes, state, rights,
            paypoint_uuid, fetchingServiceProviders, fetchedServiceProviders, errorServiceProviders,ServiceProviders,PayPoints,
            overview = false, openFamilyButton, readOnly = false,
            add, save, back, mutation } = this.props;
        const { serviceprovider, newServiceProvider } = this.state;

        if (!rights.includes(RIGHT_PAY_POINT)) return null;
        let runningMutation = !!serviceprovider && !!serviceprovider.clientMutationId
        let contributedMutations = modulesManager.getContribs(SERVICEPROVIDER_OVERVIEW_CONTRIBUTED_MUTATIONS_KEY);
        for (let i = 0; i < contributedMutations.length && !runningMutation; i++) {
            runningMutation = contributedMutations[i](state)
        }
        let actions = [];
        if (paypoint_uuid || !!serviceprovider.clientMutationId) {
            actions.push({
                doIt: this.reload,
                icon: <ReplayIcon />,
                onlyIfDirty: !readOnly && !runningMutation
            });
        }
        return (
            <div className={!!runningMutation ? classes.lockedPage : null}>
                <ProgressOrError progress={fetchingServiceProviders} error={errorServiceProviders} />
                {((!!fetchedServiceProviders && !!serviceprovider && serviceprovider.uuid === paypoint_uuid) || !paypoint_uuid) && (
                    <Form
                        module="serviceProvider"
                        title="service_provider.title"
                        titleParams={{ label: PayPointLabel(this.state.serviceprovider.name) }}
                        edited_id={paypoint_uuid}
                        edited={ServiceProviders}
                        reset={this.state.reset}
                        back={back}
                        add={!!add && !newServiceProvider ? this._add : null}
                        readOnly={readOnly || runningMutation || !!serviceprovider.validityTo}
                        actions={actions}
                        openFamilyButton={openFamilyButton}
                        overview={overview}
                        //HeadPanel={ServiceProviderMasterPanel}
                        HeadPanel={AddPayPoint}
                        // Panels={overview ? [AddServiceProvider] : [ServiceProviderMasterPanel]}
                        contributedPanelsKey={overview ? PAYPOINT_OVERVIEW_PANELS_CONTRIBUTION_KEY : PAYPOINT_PANELS_CONTRIBUTION_KEY}
                        serviceprovider={serviceprovider}
                        // payPoint={PayPoints}
                        onEditedChanged={this.onEditedChanged}
                        canSave={this.canSave}
                        save={!!save ? this._save : null}
                        onActionToConfirm={this.onActionToConfirm}
                    />
                )}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingServiceProviders: state.serviceProvider.fetchingServiceProviders,
    errorServiceProviders: state.serviceProvider.errorServiceProviders,
    fetchedServiceProviders: state.serviceProvider.fetchedServiceProviders,
    ServiceProviders: state.serviceProvider.ServiceProviders,
    submittingMutation: state.serviceProvider.submittingMutation,
    mutation: state.serviceProvider.mutation,
    confirmed: state.core.confirmed,
    state: state,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchServiceProviderMutation, fetchServiceProvider, newServiceProvider, createServiceProvider, journalize, coreConfirm }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(ServiceProviderForm))
    ))));