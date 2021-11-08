import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { IconButton, Tooltip } from "@material-ui/core";
import {
    Search as SearchIcon, People as PeopleIcon, Tab as TabIcon, Delete as DeleteIcon
} from '@material-ui/icons';
import {
    withModulesManager, formatMessageWithValues, 
    formatDateFromISO, formatMessage,
    withHistory, historyPush, coreConfirm, journalize,
    Searcher
} from "@openimis/fe-core";
import { RIGHT_SERVICE_PROVIDER_DELETE, RIGHT_PAY_POINT_DELETE } from "../constants";
import { deletePayPoint, fetchPayPoints } from "../actions";

import { ServiceProviderLabel, PayPointLabel } from "../utils/utils";
import DeleteFamilyDialog from "./DeleteSPDialog";

const SERVICEPROVIDER_SEARCHER_CONTRIBUTION_KEY = "serviceProvider.PayPointSearcher";


class PayPointSearcher extends Component {

    state = {
        open: false,
        geolocation: null,
        confirmedAction: null,
        reset: 0,
        deletePayPoint: null,
    }
   

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-serviceProvider", "serviceProviderFilter.rowsPerPageOptions", [5, 10, 20, 50]);
        this.defaultPageSize = props.modulesManager.getConf("fe-serviceProvider", "serviceProviderFilter.defaultPageSize", 5);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        } else if (!prevProps.confirmed && this.props.confirmed) {
            this.state.confirmedAction();
        }
    }

    fetch = (prms) => {
        this.props.fetchPayPoints(
            this.props.modulesManager,
            prms
        )
    }

    rowIdentifier = (r) => r.uuid

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`)
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`)
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    headers = (filters) => {
        var h = [
            "payPoint.paypointName",
            "payPoint.paypointCode",
            "payPoint.geolocation",
            "payPoint.location",
            "payPoint.serviceProvider",
            
        ]
     
        h.push(
            "paypoint.validityFrom",
            "paypoint.validityTo",
        )
        if (!!this.props.rights.includes(RIGHT_PAY_POINT_DELETE)) {
            h.push("serviceProvider.fetchPayPoints.delete")
        }

        return h;
    }

    sorts = (filters) => {
        var results = [
            ['paypointName', true],
            ['paypointCode', true],
            ['geolocation', true],
            ['location', true],
            ['serviceProvider', true],
            
        ];
        results.push(
            ['validityFrom', false],
            ['validityTo', false],
        );
        return results;
    }


    handleClose = () => { this.setState({ open: false, code: null }) }

    //This section confirms delete action...
    confirmDelete = (i) => {
        let confirmedAction = () => this.props.deletePayPoint(
            this.props.modulesManager,
            !!i.payPoint ? i.payPoint.uuid : null,
            i,
            formatMessageWithValues(this.props.intl, "serviceProvider", "deletePayPoint.mutationLabel", { label: ServiceProvPayPointLabeliderLabel(i) }),
        );
        let confirm = e => this.props.coreConfirm(
            formatMessageWithValues(this.props.intl, "serviceProvider", "deletePayPointDialog.title", { label: PayPointLabel(i) }),
            formatMessageWithValues(this.props.intl, "serviceProvider", "deletePayPointDialog.message",
                {
                    label: PayPointLabel(i),
                }),
        );
        this.setState(
            { confirmedAction },
            confirm
        )
    }

    //This generate delete icon and call for the delete action..
    deletePayPointAction = (i) =>
        !!i.validityTo ? null :
            <Tooltip title={formatMessage(this.props.intl, "serviceProvider", "payPoint.deletePayPoint.tooltip")}>
                <IconButton onClick={e => !i.clientMutationId && this.confirmDelete(i)}><DeleteIcon /></IconButton>
            </Tooltip>

deletePayPoint = (deletePp) => {
        let paypoint = this.state.deletePayPoint;
        this.setState(
            { deletePayPoint: null },
            (e) => {
                this.props.deletePayPoint(
                    this.props.modulesManager,
                    paypoint,
                    deletePp,
                    formatMessageWithValues(this.props.intl, "serviceProvider", "deletePayPoint.mutationLabel", { label: PayPointLabel(paypoint) }))
            })
    }
        itemFormatters = (filters) => {
        var formatters = [

            // serviceProvider => this.adornedCode(serviceProvider),
            payPoint => payPoint.paypointName,
            payPoint => payPoint.paypointCode,
            payPoint => payPoint.geolocation,
            payPoint => payPoint.location,
            payPoint => payPoint.serviceProvider.name,

        ]
        
        formatters.push(
            payPoint => formatDateFromISO(
                this.props.modulesManager,
                this.props.intl,
                payPoint.validityFrom),
                payPoint => formatDateFromISO(
                this.props.modulesManager,
                this.props.intl,
                payPoint.validityTo),
        )
        
        if (!!this.props.rights.includes(RIGHT_PAY_POINT_DELETE)) {
        formatters.push(this.deletePayPointAction)
            // formatters.push(this.deleteServiceProviderAction)
        }
        // formatters.push(this.deleteServiceProviderAction)

        return formatters;
    }

    rowDisabled = (selection, i) => !!i.validityTo
    rowLocked = (selection, i) => !!i.clientMutationId

    render() {
        const { intl, filterPaneContributionsKey, cacheFiltersKey, onDoubleClick, 
            fetchingPayPoints, fetchedPayPoints, errorPayPoints, PayPoints, PayPointsListInfo
        } = this.props;

        let count = PayPointsListInfo.totalCount;

        return (
            <Fragment>
                <DeleteFamilyDialog
                    paypoint={this.state.deletePayPoint}
                    onConfirm={this.deletePayPoint}
                    onCancel={e => this.setState({ deletePayPoint: null })} />
                <Searcher
                    module="serviceProvider"
                    cacheFiltersKey={cacheFiltersKey}
                    // FilterPane={ServiceProviderFilter}
                    filterPaneContributionsKey={filterPaneContributionsKey}
                    items={PayPoints}
                    itemsPageInfo={PayPointsListInfo}
                    fetchingItems={fetchingPayPoints}
                    fetchedItems={fetchedPayPoints}
                    errorItems={errorPayPoints}
                    contributionKey={SERVICEPROVIDER_SEARCHER_CONTRIBUTION_KEY}
                    tableTitle={formatMessageWithValues(intl, "serviceProvider", "paypointSummaries", { count })}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    fetch={this.fetch}
                    rowIdentifier={this.rowIdentifier}
                    filtersToQueryParams={this.filtersToQueryParams}
                    defaultOrderBy="geolocation"
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    sorts={this.sorts}
                    rowDisabled={this.rowDisabled}
                    rowLocked={this.rowLocked}
                    onDoubleClick={(i) => !i.clientMutationId && onDoubleClick(i)}
                    reset={this.state.reset}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    PayPoints: state.serviceProvider.PayPoints,
    PayPointsListInfo: state.serviceProvider.PayPointsListInfo,
    fetchingPayPoints: state.serviceProvider.fetchingPayPoints,
    fetchedPayPoints: state.serviceProvider.fetchedPayPoints,
    errorPayPoints: state.serviceProvider.errorPayPoints,
    submittingMutation: state.serviceProvider.submittingMutation,
    mutation: state.serviceProvider.mutation,
    confirmed: state.core.confirmed,
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { fetchPayPoints, deletePayPoint, journalize, coreConfirm },
        dispatch);
};

export default withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(injectIntl(PayPointSearcher))));