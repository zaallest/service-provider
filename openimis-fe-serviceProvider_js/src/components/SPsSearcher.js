import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import {
    withModulesManager, decodeId, formatDateFromISO,
    journalize, coreConfirm,
    Searcher,
} from "@openimis/fe-core";
import ServicePFilter from "./SPFilter";
import { fetchServiceProviderSummaries, deleteServiceProvider } from "../actions";
import {
    formatMessage, formatMessageWithValues,
    PublishedComponent,
} from "@openimis/fe-core";
import { IconButton } from "@material-ui/core";
import {RIGHT_SERVICE_PROVIDER_DELETE } from "../constants";

class ServiceProvidersSearcher extends Component {

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-serviceProvider", "serviceProviderFilter.rowsPerPageOptions", [5, 10, 20, 50]);
        this.defaultPageSize = props.modulesManager.getConf("fe-serviceProvider", "serviceProviderFilter.defaultPageSize", 5);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        } else if (prevProps.confirmed !== this.props.confirmed && !!this.props.confirmed && !!this.state.confirmedAction) {
            this.state.confirmedAction();
        }
    }

    rowIdentifier = (r) => r.uuid

    headers = (filters) => {
        let headers = [
            "serviceProvider.name",
            "serviceProvider.code",
            "serviceProvider.legalForm",
            "serviceProvider.level",
            "serviceProvider.subLevel",
            "serviceProvider.accountCode",
            "serviceProvider.address",
            "serviceProvider.phoneNumber",
            "serviceProvider.email",
            "serviceProvider.fax",
            "serviceProvider.validityFrom",
            "serviceProvider.validityTo",
        ]
        if (this.props.rights.includes(RIGHT_SERVICE_PROVIDER_DELETE)) {
            headers.push(null);
        }
        return headers;
    }

    sorts = (filters) => [
        ['name', true],
        ['code', true],
        ['legalForm', true],
        ['level', true],
        ['subLevel', true],
        null,
        null,
        null,
        null,
        ['validityFrom', false],
        ['validityTo', false]
    ]

    itemFormatters = (filters) => {
        let formatters = [
            sp => sp.name,
            sp => sp.code,
            sp => sp.legalForm.legalForm,
            sp => sp.level.level,
            sp => sp.subLevel.subLevel,
            sp => sp.accountCode,
            sp => sp.address,
            sp => sp.phoneNumber,
            sp => sp.email,
            sp  => sp.fax,

            sp => formatDateFromISO(
                this.props.modulesManager,
                this.props.intl,
                sp.validityFrom),
            sp => formatDateFromISO(
                this.props.modulesManager,
                this.props.intl,
                sp.validityTo),

        ]
        if (this.props.rights.includes(RIGHT_SERVICE_PROVIDER_DELETE)) {
            formatters.push(sp => !!sp.validityTo ? null : <IconButton
                onClick={e => this.onDelete(sp)}>
                <DeleteIcon />
            </IconButton>);
        }
        return formatters;
    }

    rowDisabled = (selection, i) => !!i.validityTo

    onDelete = sp => {
        let confirm = e => this.props.coreConfirm(
            formatMessage(this.props.intl, "serviceProvider", "deleteServiceProvider.title"),
            formatMessageWithValues(this.props.intl, "serviceProvider", "deleteServiceProviderDialog.message",

                {
                    uuid: sp.uuid,
                    code: sp.code,
                    name: sp.name,
                }),
        );
        let confirmedAction = () => this.props.deleteServiceProvider(
            sp,
            formatMessageWithValues(
                this.props.intl,
                "serviceProvider",
                "DeleteServiceProvider.mutationLabel",
                { code: sp.code }
            )
        );
        this.setState(
            { confirmedAction },
            confirm
        )
    }

    rowLocked = (selection, sp) => !!sp.clientMutationId

    render() {
        const {
            intl,
            ServiceProviders, ServiceProvidersListInfo,
            fetchingServiceProviders, fetchedServiceProviders, errorServiceProviders,
            onDoubleClick,
        } = this.props;
        let count = ServiceProvidersListInfo.totalCount;

        return (
            <Fragment>
                <Searcher
                    module="serviceProvider"
                    
                    fetch={this.props.fetchServiceProviderSummaries}
                    cacheFiltersKey="serviceProviderSearcher"
                    items={ServiceProviders}
                    rowIdentifier={this.rowIdentifier}
                    rowLocked={this.rowLocked}
                    itemsPageInfo={ServiceProvidersListInfo}
                    fetchingItems={fetchingServiceProviders}
                    fetchedItems={fetchedServiceProviders}
                    errorItems={errorServiceProviders}
                    FilterPane={ServicePFilter}
                    tableTitle={formatMessageWithValues(intl, "serviceProvider", "ServiceProviderSummaries", { count })}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    rowDisabled={this.rowDisabled}
                    sorts={this.sorts}
                    onDoubleClick={onDoubleClick}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    submittingMutation: state.serviceProvider.submittingMutation,
    mutation: state.serviceProvider.mutation,
    confirmed: state.core.confirmed,
    ServiceProviders: state.serviceProvider.ServiceProviders,
    ServiceProvidersListInfo: state.serviceProvider.ServiceProvidersListInfo,
    fetchingServiceProviders: state.serviceProvider.fetchingServiceProviders,
    fetchedServiceProviders: state.serviceProvider.fetchedServiceProviders,
    errorServiceProviders: state.serviceProvider.errorServiceProviders,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { fetchServiceProviderSummaries, deleteServiceProvider, coreConfirm, journalize },
        dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ServiceProvidersSearcher)));