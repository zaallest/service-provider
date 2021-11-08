import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import _debounce from "lodash/debounce";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import {
    withModulesManager, formatMessage,
    TextInput, PublishedComponent
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

class ServicePFilter extends Component {
    state = {
        reset: 0,
        showHistory: false,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            prevProps.filters['showHistory'] !== this.props.filters['showHistory'] &&
            !!this.props.filters['showHistory'] &&
            this.state.showHistory !== this.props.filters['showHistory']['value']
        ) {
            this.setState((sate, props) => ({ showHistory: props.filters['showHistory']['value'] }))
        }
    }

    debouncedOnChangeFilter = _debounce(
        this.props.onChangeFilters,
        this.props.modulesManager.getConf("fe-serviceProvider", "debounceTime", 800)
    )


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
            showHistory: !state.showHistory,
            reset: state.reset + 1,
        }));
    }

    _onChange = (k, v, s) => {
        let filters = [
            {
                id: k,
                value: v,
                filter: `${k}: "${v}"`
            }
        ];
        this.props.onChangeFilters(filters);
        this.setState((state) => ({
            reset: state.reset + 1,
        }));
    }

    render() {
        const { intl, classes, filters } = this.props;
        return (
            <Grid container className={classes.form}>
                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="serviceProvider" label="serviceProvider.name"
                        name="name"
                        value={(filters['name'] && filters['name']['value'])}
                        onChange={v => this.debouncedOnChangeFilter([
                            {
                                id: 'name',
                                value: v,
                                filter: !!v ? `name_Icontains: "${v}"` : null
                            }
                        ])}
                    />
                </Grid>

                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="serviceProvider" label="serviceProvider.code"
                        name="code"
                        value={(filters['code'] && filters['code']['value'])}
                        onChange={v => this.debouncedOnChangeFilter([
                            {
                                id: 'code',
                                value: v,
                                filter: !!v ? `code_Icontains: "${v}"` : null
                            }
                        ])}
                    />
                </Grid>

                <Grid item xs={2} className={classes.item}>
                    <PublishedComponent
                        pubRef="serviceProvider.ServiceProviderLegalFormPicker"
                        value={(filters['legalForm'] && filters['legalForm']['value'])}
                        onChange={(v, s) => this._onChange('legalForm', v, s)}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <PublishedComponent
                        pubRef="serviceProvider.ServiceProviderLevelPicker"
                        value={(filters['level'] && filters['level']['value'])}
                        onChange={(v, s) => this._onChange('level', v, s)}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <PublishedComponent
                        pubRef="serviceProvider.ServiceProviderSubLevelPicker"
                        value={(filters['subLevel'] && filters['subLevel']['subLevel'])}
                        onChange={(v, s) => this._onChange('subLevel', v, s)}
                    />
                </Grid>
               
                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="serviceProvider" label="serviceProvider.accountCode"
                        name="accountCode"
                        value={(filters['accountCode'] && filters['accountCode']['value'])}
                        onChange={v => this.debouncedOnChangeFilter([
                            {
                                id: 'accountCode',
                                value: v,
                                filter: !!v ? `accountCode_Icontains: "${v}"` : null
                            }
                        ])}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="serviceProvider" label="serviceProvider.address"
                        name="address"
                        value={(filters['address'] && filters['address']['value'])}
                        onChange={v => this.debouncedOnChangeFilter([
                            {
                                id: 'address',
                                value: v,
                                filter: !!v ? `address_Icontains: "${v}"` : null
                            }
                        ])}
                    />
                </Grid>

                <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="serviceProvider" label="serviceProvider.phoneNumber"
                        name="phoneNumber"
                        value={(filters['phoneNumber'] && filters['phoneNumber']['value'])}
                        onChange={v => this.debouncedOnChangeFilter([
                            {
                                id: 'phoneNumber',
                                value: v,
                                filter: !!v ? `phoneNumber_Icontains: "${v}"` : null
                            }
                        ])}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="serviceProvider" label="serviceProvider.email"
                        name="email"
                        value={(filters['email'] && filters['email']['value'])}
                        onChange={v => this.debouncedOnChangeFilter([
                            {
                                id: 'email',
                                value: v,
                                filter: !!v ? `email_Icontains: "${v}"` : null
                            }
                        ])}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="serviceProvider" label="serviceProvider.fax"
                        name="fax"
                        value={(filters['fax'] && filters['fax']['value'])}
                        onChange={v => this.debouncedOnChangeFilter([
                            {
                                id: 'fax',
                                value: v,
                                filter: !!v ? `fax_Icontains: "${v}"` : null
                            }
                        ])}
                    />
                </Grid>

            
                
            </Grid>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(ServicePFilter))));