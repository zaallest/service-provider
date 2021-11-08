import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl} from 'react-intl';
import { ScreenShare, AddBox,RotateRight, PersonPin, AccountBalance, AddLocation} from "@material-ui/icons";
import { formatMessage, MainMenuContribution, withModulesManager } from "@openimis/fe-core";
import { RIGHT_SERVICE_PROVIDER } from "../constants";

const SERVICE_PROVIDER_MAIN_MENU_CONTRIBUTION_KEY = "serviceProvider.MainMenu";

class ServiceProviderMainMenu extends Component {
    render() {
      const { modulesManager, rights } = this.props;
        let entries = [];

              if (rights.includes(RIGHT_SERVICE_PROVIDER)) {
                entries.push(
                    {
                      text: "Service Providers List",
                      icon: <PersonPin/>,
                      route: "/" + modulesManager.getRef("serviceProvider.route.service_providers"),
                      withDivider: true
                    }
                  )
            }
              // entries.push({
              //   text: " Payroll List",
              //   icon: <RotateRight />,
              //   route: "/location/healthFacility"
              // });
                
        entries.push(...this.props.modulesManager.getContribs(SERVICE_PROVIDER_MAIN_MENU_CONTRIBUTION_KEY).filter(c => !c.filter || c.filter(rights)));
        
        if (!entries.length) return null;
        return (
            <MainMenuContribution
                {...this.props}
                header = { formatMessage(this.props.intl, "serviceProvider", "mainMenu")}
                icon = {<ScreenShare />}
                entries = {entries}
            />
            );

    }
}


const mapStateToProps = state => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});
export default withModulesManager(injectIntl(connect(mapStateToProps)(ServiceProviderMainMenu)));

// export default withModulesManager(injectIntl(ServiceProviderMainMenu));