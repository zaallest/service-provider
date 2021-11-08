import React, { Component } from "react";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Checkbox, FormControlLabel, Grid, Paper } from "@material-ui/core";
import {
    withModulesManager, formatMessage,
    Contributions, PublishedComponent, ControlledField, TextInput
} from "@openimis/fe-core";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: 0
    },
    item: {
        padding: theme.spacing(1)
    },
    paperDivider: theme.paper.divider,
});

const SERVICEPROVIDER_FILTER_CONTRIBUTION_KEY = "serviceProvider.Filter";

//This class filters service prviders pase on any input values....
class ServiceProviderFilter extends Component {

    state = {
        showHistory: false,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevProps.filters['showHistory'] !== this.props.filters['showHistory'] &&
            !!this.props.filters['showHistory'] &&
            this.state.showHistory !== this.props.filters['showHistory']['value']
        ) {
            this.setState((state, props) => ({ showHistory: props.filters['showHistory']['value'] }))
        }
    }

    debouncedOnChangeFilter = _debounce(
        this.props.onChangeFilters,
        this.props.modulesManager.getConf("fe-serviceProvider", "debounceTime", 800)
    )

    //This part pick the filter values..
    _filterValue = k => {
        const { filters } = this.props;
        return !!filters && !!filters[k] ? filters[k].value : null
    }

    _onChangeShowHistory = () => {
        let filters = [
            {
                id: 'showHistory',
                value: !this.state.showHistory,
                filter: `showHistory: ${!this.state.showHistory}`
            }
        ];
        this.props.onChangeFilters(filters);
        this.setState((state) => ({
            showHistory: !state.showHistory
        }));
    }

    //This section renders and return the filtered data based on input values...
    render() {
        const { intl, classes, filters, onChangeFilters } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container className={classes.item}>
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.name" field={
                                <Grid item xs={2} className={classes.item}>
                                    <TextInput
                                        module="serviceProvider" label="serviceProvider.name"
                                        name="name"
                                        value={this._filterValue('name')}
                                        onChange={v => this.debouncedOnChangeFilter([{
                                            id: 'name',
                                            value: v,
                                            filter: `name: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.code" field={
                                <Grid item xs={2} className={classes.item}>
                                    <TextInput
                                        module="serviceProvider"
                                        label="serviceProvider.code"
                                        name="code"
                                        value={this._filterValue('code')}
                                        onChange={v => this.debouncedOnChangeFilter([{
                                            id: 'code',
                                            value: v,
                                            filter: `code: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.legalForm" field={
                                <Grid item xs={2} className={classes.item}>
                                    <PublishedComponent pubRef="serviceProvider.ServiceProviderLegalFormPicker"
                                    value={this._filterValue('legalForm')}
                                    onChange={v => onChangeFilters([{
                                            id: 'legalForm',
                                            value: v,
                                            filter: `code: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.level" field={
                                <Grid item xs={2} className={classes.item}>
                                    <PublishedComponent pubRef="serviceProvider.ServiceProviderLevelPicker"
                                        value={this._filterValue('level')}
                                        onChange={v => onChangeFilters([{
                                            id: 'level',
                                            value: v,
                                            filter: `code: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>
                           
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.subLevel" field={
                                <Grid item xs={2} className={classes.item}>
                                    <PublishedComponent pubRef="serviceProvider.ServiceProviderSubLevelPicker"
                                        value={this._filterValue('subLevel')}
                                        onChange={v => onChangeFilters([{
                                            id: 'subLevel',
                                            value: v,
                                            filter: `code: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>

                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.accountCode" field={
                                <Grid item xs={2} className={classes.item}>
                                    <TextInput
                                        module="serviceProvider" 
                                        label="serviceProvider.accountCode"
                                        name="accountCode"
                                        value={this._filterValue('accountCode')}
                                        onChange={v => this.debouncedOnChangeFilter([{
                                            id: 'accountCode',
                                            value: v,
                                            filter: `accountCode: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.address" field={
                                <Grid item xs={3} className={classes.item}>
                                    <TextInput
                                        module="serviceProvider" label="serviceProvider.address"
                                        name="address"
                                        value={this._filterValue('address')}
                                        onChange={v => this.debouncedOnChangeFilter([{
                                            id: 'address',
                                            value: v,
                                            filter: `address: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.phoneNumber" field={
                                <Grid item xs={3} className={classes.item}>
                                    <TextInput
                                        module="serviceProvider" label="serviceProvider.phoneNumber"
                                        name="phoneNumber"
                                        value={this._filterValue('phoneNumber')}
                                        onChange={v => this.debouncedOnChangeFilter([{
                                            id: 'phoneNumber',
                                            value: v,
                                            filter: `phoneNumber: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.email" field={
                                <Grid  item xs={3} className={classes.item}>
                                    <TextInput
                                        module="serviceProvider" label="serviceProvider.email"
                                        name="email"
                                        value={this._filterValue('email')}
                                        onChange={v => this.debouncedOnChangeFilter([{
                                            id: 'email',
                                            value: v,
                                            filter: `email: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>
                            <ControlledField module="serviceProvider" id="ServiceProviderFilter.fax" field={
                                <Grid item xs={3} className={classes.item}>
                                    <TextInput
                                        module="serviceProvider" label="serviceProvider.fax"
                                        name="fax"
                                        value={this._filterValue('fax')}
                                        onChange={v => this.debouncedOnChangeFilter([{
                                            id: 'fax',
                                            value: v,
                                            filter: `fax: "${v}"`
                                        }])}
                                    />
                                </Grid>
                            }/>

                        <ControlledField module="serviceProvider" id="ServiceProviderFilter.showHistory" field={
                            <Grid item xs={6} className={classes.item}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={this.state.showHistory}
                                            onChange={e => this._onChangeShowHistory()}
                                        />
                                    }
                                    label={formatMessage(intl, "serviceProvider", "ServiceProviderFilter.showHistory")}
                                />
                            </Grid>
                        } />
                        </Grid>
                    </Paper>
                </Grid>
                <Contributions filters={filters} onChangeFilters={onChangeFilters} contributionKey={SERVICEPROVIDER_FILTER_CONTRIBUTION_KEY} />
            </Grid> // main closing
                
        )
    }
}

export default withModulesManager(injectIntl((withTheme(withStyles(styles)(ServiceProviderFilter)))));