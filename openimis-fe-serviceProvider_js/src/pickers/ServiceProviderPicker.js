import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { formatMessage, AutoSuggestion, withModulesManager } from "@openimis/fe-core";
import _debounce from "lodash/debounce";
import { ServiceProviderLabel } from "../utils";
import { fetchServiceProviderStr, fetchServiceProviderSummaries } from "../actions";

const styles = theme => ({
    textField: {
        width: "100%",
    },
});

class ServiceProviderPicker extends Component {

    state = {
        serviceproviders: []
    }

    constructor(props) {
        super(props);
        this.name = props.modulesManager.getConf("fe-serviceProvider", "ServiceProvider.name")
        this.selectThreshold = props.modulesManager.getConf("fe-serviceProvider", "ServiceProviderPicker.selectThreshold", 10);
    }

    componentDidMount() {
        this.setState({ serviceproviders: this.props.serviceproviders });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(prevProps.serviceproviders, this.props.serviceproviders)) {
            this.setState({ serviceproviders: this.props.serviceproviders })
        }
    }

    getSuggestions = str => !!str &&
        str.length >= this.props.modulesManager.getConf("fe-serviceProvider", "serviceProviderMinCharLookup", 2) &&
        this.props.fetchServiceProviderSummaries(this.name, this.props.name, str);

    debouncedGetSuggestion = _debounce(
        this.getSuggestions,
        this.props.modulesManager.getConf("fe-serviceProvider", "debounceTime", 800)
    )

    onSuggestionSelected = v => {
        this.props.onChange(v, ServiceProviderLabel(v))
    }

    onClear = () => {
        this.setState(
            { serviceproviders: [] },
            e => this.onSuggestionSelected(null)
        );
    }

    render() {
        const { intl, name, value, reset,
            withLabel = true, label = null, withNull = false, nullLabel = null, filterLabels = true,
            preValues = [],
            withPlaceholder, placeholder = null,
            readOnly = false, required = false
        } = this.props;
        const { serviceproviders } = this.state;

        return <AutoSuggestion
            module="serviceProvider"
            items={serviceproviders}
            preValues={preValues}
            label={!!withLabel && (label || formatMessage(intl, "serviceProvider", `ServiceProvider${name}Picker.label`))}
            placeholder={!!withPlaceholder ? placeholder || formatMessage(intl, "serviceProvider", `ServiceProvider${name}Picker.placehoder`) : null}
            lookup={ServiceProviderLabel}
            renderSuggestion={a => <span>{ServiceProviderLabel(a)}</span>}
            getSuggestions={this.getSuggestions}
            getSuggestionValue={ServiceProviderLabel}
            onClear={this.onClear}
            onSuggestionSelected={this.onSuggestionSelected}
            value={value}
            reset={reset}
            readOnly={readOnly}
            required={required}
            selectThreshold={this.selectThreshold}
            withNull={withNull}
            nullLabel={nullLabel ||
                filterLabels ?
                formatMessage(intl, "serviceProvider", `serviceProvider.ServiceProvider${name}Picker.null`) :
                formatMessage(intl, "serviceProvider", `serviceProvider.ServiceProvider${name}Picker.none`)}
        />
    }
}

const mapStateToProps = (state, props) => ({
    serviceproviders: state.loc[`l${props.name}s`] || [],
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchServiceProviderSummaries }, dispatch);
};


export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ServiceProviderPicker)))));
