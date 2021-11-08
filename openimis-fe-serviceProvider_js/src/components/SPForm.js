import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReplayIcon from "@material-ui/icons/Replay"
import {
    ProgressOrError, Form,
    withModulesManager, journalize,
    formatMessageWithValues,
} from "@openimis/fe-core";
import ServiceProviderMasterPanel from "./ServiceProviderMasterPanel";
import { fetchServiceP } from "../actions";

class ServiceProviderForm extends Component {


    state = {
        lockNew: false,
        reset: 0,
        update: 0,
        serviceprovider_uuid: null,
        ServiceProvider: this._newServiceProvider(),
        newServiceProvider: true,
    }

 
//This section is called and set the sp to empty when user want to add new service provider....
    _newServiceProvider() {
        let sp = {};
        return sp;
    }

    componentDidMount() {
        if (this.props.serviceprovider_uuid) {
            this.setState((state, props) => ({ serviceprovider_uuid: props.serviceprovider_uuid }))
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.ServiceProvider.code !== this.state.ServiceProvider.code) {
            document.title = formatMessageWithValues(this.props.intl, "serviceProvider", "serviceProvider.edit.page.title", { code: this.state.ServiceProvider.code })
        } 
        if (prevProps.fetchedServiceProvider !== this.props.fetchedServiceProvider
            && !!this.props.fetchedServiceProvider
            && !!this.props.ServiceProvider) {
            this.setState((state, props) => ({
                ServiceProvider: { ...props.ServiceProvider },
                serviceprovider_uuid: props.ServiceProvider.uuid,
                lockNew: false,
                newServiceProvider: false,
            }));
        } else if (prevState.serviceprovider_uuid !== this.state.serviceprovider_uuid) {
            this.props.fetchServiceP(
                this.props.modulesManager,
                this.state.serviceprovider_uuid,
                null
            )
        } else if (prevProps.serviceprovider_uuid && !this.props.serviceprovider_uuid) {
            this.setState({ ServiceProvider: this._newServiceProvider(), lockNew: false, serviceprovider_uuid: null });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState((state) => ({ reset: state.reset + 1 }));
        }
    }

    //This section retset the form if a user wants to add new data....
    _add = () => {
        this.setState((state) => ({
            ServiceProvider: this._newServiceProvider(),
                lockNew: false,
                newServiceProvider: true,
                reset: state.reset + 1,
            }),
            e => {
                this.props.add();
                this.forceUpdate();
            }
        )
    }

    
    onEditedChanged = ServiceProvider => {
        this.setState({ ServiceProvider, newServiceProvider: false })
    }

    //This section creats restriction for user to iptut all reguired data before saving the data....
    canSave = () => {
        if (!this.state.ServiceProvider.code) return false;
        if (!this.state.ServiceProvider.name) return false;
        if (!this.state.ServiceProvider.legalForm) return false;
        if (!this.state.ServiceProvider.level) return false;
        if (!this.state.ServiceProvider.subLevel) return false;
        if (!this.state.ServiceProvider.accountCode) return false;
        if (!this.state.ServiceProvider.phoneNumber) return false;
        if (!this.state.ServiceProvider.email) return false;
        if (!this.state.ServiceProvider.fax) return false;
        return true;
    }

    //This section allows the page to relode...
    reload = () => {
        this.props.fetchServiceP(
            this.props.modulesManager,
            this.state.serviceprovider_uuid,
            this.state.ServiceProvider.code
        );
    }

    //This section prevent user to add duplicate datas.....
    _save = (ServiceProvider) => {
        this.setState(
            { lockNew: !ServiceProvider.uuid }, // avoid duplicates
            e => this.props.save(ServiceProvider))
    }

    render() {
        const {
            fetchingServiceProvider,
            fetchedServiceProvider,
            errorServiceProvider,
            add, save, back,

        } = this.props
        const {
            serviceprovider_uuid,
            lockNew,
            newServiceProvider,
            ServiceProvider,
            reset,
            update,
        } = this.state;
        console.log('serviceProvider', ServiceProvider);
        let readOnly = lockNew || !!ServiceProvider.validityTo;
        let actions = [];

        if (serviceprovider_uuid) {
            actions.push({
                doIt: e => this.reload(serviceprovider_uuid),
                icon: <ReplayIcon />,
                onlyIfDirty: !readOnly
            });
        }
        return (
            <Fragment>
                <ProgressOrError progress={fetchingServiceProvider} error={errorServiceProvider} />
                {(!!fetchedServiceProvider || !serviceprovider_uuid) && (
                    <Fragment>
                        <Form
                            module="serviceProvider"
                            edited_id={serviceprovider_uuid}
                            edited={ServiceProvider}
                            reset={reset}
                            update={update}
                            title="serviceProvider.edit.title"
                            titleParams={{ code: ServiceProvider.code }}
                            back={back}
                            add={!!add && !newServiceProvider ? this._add : null}
                            save={!!save ? this._save : null}
                            canSave={this.canSave}
                            reload={(serviceprovider_uuid || readOnly) && this.reload}
                            readOnly={readOnly}
                            HeadPanel={ServiceProviderMasterPanel}
                            // Panels={[PaypointSearcher]}
                            onEditedChanged={this.onEditedChanged}
                            actions={actions}
                        />
                    </Fragment>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    // userServiceProviderFullPath: !!state.serviceProvider ? state.serviceProvider.userServiceProviderFullPath : null,
    ServiceProvider: state.serviceProvider.ServiceProvider,
    fetchingServiceProvider: state.serviceProvider.fetchingServiceProvider,
    fetchedServiceProvider: state.serviceProvider.fetchedServiceProvider,
    errorServiceProvider: state.serviceProvider.errorServiceProvider,
    submittingMutation: state.serviceProvider.submittingMutation,
    mutation: state.serviceProvider.mutation,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchServiceP, journalize }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(ServiceProviderForm)

));
