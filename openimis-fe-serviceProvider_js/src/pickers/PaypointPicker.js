import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { injectIntl } from 'react-intl';
import { fetchInsureesForPicker } from "../actions";
import { TextInput, Picker, withModulesManager } from "@openimis/fe-core";
import _ from "lodash";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    },
    item: {
        padding: theme.spacing(1)
    }
});

class RawFilter extends Component {
    state = {
        name: "",
        code: "",
        email: "",
    }

    stateToFilters = () => {
        let filters = [];
        if (!!this.state.name) {
            filters.push(`name_Istartswith: "${this.state.name}"`)
        }
        if (!!this.state.code) {
            filters.push(`code_Istartswith: "${this.state.code}"`)
        }
        if (!!this.state.email) {
            filters.push(`email_Istartswith: "${this.state.email}"`)
        }
        return filters;
    }

    _onChange = (a, v) => {
        this.setState(
            { [a]: v },
            e => this.props.onChange(this.stateToFilters())
        )
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container>
                <Grid item xs={4} className={classes.item}>
                    <TextInput
                        autoFocus={true}
                        module="serviceProvider"
                        label="Paypoint.name"
                        value={this.state.name}
                        onChange={v => this._onChange("name", v)}
                    />
                </Grid>
                <Grid item xs={4} className={classes.item}>
                    <TextInput
                        module="serviceProvider"
                        label="Paypoint.code"
                        value={this.state.code}
                        onChange={v => this._onChange("code", v)}
                    />
                </Grid>
                <Grid item xs={4} className={classes.item}>
                    <TextInput
                        module="sericeProvider"
                        label="Paypoint.email"
                        value={this.state.email}
                        onChange={v => this._onChange("email", v)}
                    />
                </Grid>
            </Grid>
        )
    }
}

const Filter = withTheme(withStyles(styles)(RawFilter));

const INIT_STATE = {
    page: 0,
    pageSize: 10,
    afterCursor: null,
    beforeCursor: null,
    filters: [],
    selected: null,
}

class InsureePicker extends Component {

    state = INIT_STATE;

    componentDidMount() {
        if (this.props.value) {
            this.setState((state, props) => ({ selected: props.value }));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.reset !== this.props.reset) {
            this.setState((state, props) => ({
                ...INIT_STATE,
                selected: props.value
            }));
        } else if (!_.isEqual(prevProps.value, this.props.value)) {
            this.setState((state, props) => ({ selected: props.value }));
        }
    }

    formatSuggestion = a => !!a ? `${a.code} ${a.email} (${a.name})` : ""

    filtersToQueryParams = () => {
        let prms = [...(this.props.forcedFilter || []), ...this.state.filters];
        prms = prms.concat(`first: ${this.state.pageSize}`);
        if (!!this.state.afterCursor) {
            prms = prms.concat(`after: "${this.state.afterCursor}"`)
        }
        if (!!this.state.beforeCursor) {
            prms = prms.concat(`before: "${this.state.beforeCursor}"`)
        }
        return prms;
    }

    getSuggestions = (filters) => {
        this.setState(
            { filters },
            e => this.props.fetchInsureesForPicker(this.props.modulesManager, this.filtersToQueryParams())
        );
    }

    debouncedGetSuggestion = _.debounce(
        this.getSuggestions,
        this.props.modulesManager.getConf("fe-insuree", "debounceTime", 800)
    )

    onChangeRowsPerPage = (cnt) => {
        this.setState(
            {
                pageSize: cnt,
                page: 0,
                afterCursor: null,
                beforeCursor: null,
            },
            e => this.props.fetchInsureesForPicker(this.props.modulesManager, this.filtersToQueryParams())
        )
    }

    onSelect = v => {
        this.setState(
            { selected: v },
            this.props.onChange(v, this.formatSuggestion(v))
        )
    }

    onChangePage = (page, nbr) => {
        if (nbr > this.state.page) {
            this.setState((state, props) =>
                ({
                    page: state.page + 1,
                    beforeCursor: null,
                    afterCursor: props.insureesPageInfo.endCursor,
                }),
                e => this.props.fetchInsureesForPicker(this.props.modulesManager, this.filtersToQueryParams())
            )
        } else if (nbr < this.state.page) {
            this.setState((state, props) =>
                ({
                    page: state.page - 1,
                    beforeCursor: props.insureesPageInfo.startCursor,
                    afterCursor: null,
                }),
                e => this.props.fetchInsureesForPicker(this.props.modulesManager, this.filtersToQueryParams())
            )
        }
    }

    render() {
        const { insurees, insureesPageInfo, readOnly = false, required = false, withLabel = true, IconRender = null, title, check, checked } = this.props;
        return (
            <Picker
                module="insuree"
                label={!!withLabel ? "Insuree.label" : null}
                title={title}
                dialogTitle="Insuree.picker.dialog.title"
                IconRender={IconRender}
                check={check}
                checked={checked}
                filter={<Filter onChange={this.debouncedGetSuggestion} />}
                suggestions={insurees}
                suggestionFormatter={this.formatSuggestion}
                page={this.state.page}
                pageSize={this.state.pageSize}
                count={insureesPageInfo.totalCount}
                onChangePage={this.onChangePage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
                onSelect={this.onSelect}
                value={this.state.selected}
                readOnly={readOnly}
                required={required}
            />
        )
    }
}

const mapStateToProps = state => ({
    insurees: state.insuree.insurees,
    insureesPageInfo: state.insuree.insureesPageInfo,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchInsureesForPicker }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(InsureePicker)))));
