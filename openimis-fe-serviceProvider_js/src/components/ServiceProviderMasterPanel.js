import React from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    ControlledField, PublishedComponent, FormPanel,
    TextInput, TextAreaInput,
    withModulesManager,
} from "@openimis/fe-core";
import { Grid } from "@material-ui/core";

const styles = theme => ({
    item: theme.paper.item,
});

class ServiceProviderMasterPanel extends FormPanel {

    constructor(props) {
        super(props);
        this.codeMaxLength = props.modulesManager.getConf("fe-serviceProvider", "serviceProviderForm.codeMaxLength", 8);
        this.accCodeMaxLength = props.modulesManager.getConf("fe-serviceProvider", "serviceProviderForm.accCodeMaxLength", 25);
        this.accCodeMandatory = props.modulesManager.getConf("fe-serviceProvider", "serviceProviderForm.accCodeMandatory", true);
    }

   


    render() {
        const { classes, edited, reset, readOnly = false } = this.props;
        return (
            <Grid container>
                 <ControlledField module="serviceProvider" id="ServiceProvider.name" field={
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="serviceProvider" 
                            label="ServiceProviderForm.name"
                            name="name"
                            value={edited.name}
                            readOnly={readOnly}
                            required={true}
                            onChange={(v, s) => this.updateAttribute("name", v)}
                         
                        />
                    </Grid>
                } />
               
                 <ControlledField module="serviceProvider" id="ServiceProvider.code" field={
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="serviceProvider" 
                            label="ServiceProviderForm.code"
                            name="code"
                            value={edited.code}
                            readOnly={readOnly}
                            required={true}
                            onChange={(v, s) => this.updateAttribute("code", v)}
                            inputProps={{
                                "maxLength": this.codeMaxLength,
                            }}
                        />
                    </Grid>
                } />

                <ControlledField module="serviceProvider" id="ServiceProvider.legalForm" field={
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="serviceProvider.ServiceProviderLegalFormPicker"
                            value={!!edited.legalForm ? edited.legalForm : null}
                            nullLabel="empty"
                            reset={reset}
                            readOnly={readOnly}
                            required={true}
                            onChange={(v, s) => this.updateAttribute('legalForm', v)}
                        />
                    </Grid>
                } />
                <ControlledField module="serviceProvider" id="ServiceProvider.level" field={
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="serviceProvider.ServiceProviderLevelPicker"
                            value={ !!edited.level ? edited.level : null}
                            nullLabel="empty"
                            reset={reset}
                            readOnly={readOnly}
                            required={true}
                            onChange={(v, s) => this.updateAttribute("level", v )}
                        />
                    </Grid>
                } />
                               
                <ControlledField module="serviceProvider" id="ServiceProvider.subLevel" field={
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="serviceProvider.ServiceProviderSubLevelPicker"
                            value={ !!edited.subLevel ? edited.subLevel : null}
                            withNull={true}
                            readOnly={readOnly}
                            onChange={(v, s) => this.updateAttribute('subLevel', v )}
                        />
                    </Grid>
                } />
                
                
                <ControlledField module="serviceProvider" id="ServiceProvider.accountCode" field={
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="serviceProvider" 
                            label="ServiceProviderForm.accountCode"
                            name="accountCode"
                            value={edited.accountCode}
                            readOnly={readOnly}
                            required={true}
                            onChange={(v, s) => this.updateAttribute("accountCode", v)}
                            required={this.accCodeMandatory}
                            inputProps={{
                                "maxLength": this.accCodeMaxLength,
                            }}
                        />
                    </Grid>
                } />

                <Grid item xs={3} className={classes.item}>
                    <TextAreaInput
                        module="serviceProvider"
                        label="ServiceProviderForm.address"
                        value={edited.address}
                        name="address"
                        readOnly={readOnly}
                        onChange={(v, s) => this.updateAttribute("address", v)}
                    />
                </Grid>
                <ControlledField module="serviceProvider" id="ServiceProvider.phoneNumber" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="serviceProvider" 
                            label="ServiceProviderForm.phoneNumber"
                            name="phoneNumber"
                            value={edited.phoneNumber}
                            readOnly={readOnly}
                            onChange={(v, s) => this.updateAttribute("phoneNumber", v)}
                        />
                    </Grid>
                } />
                <ControlledField module="serviceProvider" id="ServiceProvider.email" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="serviceProvider" 
                            label="ServiceProviderForm.email"
                            name="email"
                            value={edited.email}
                            readOnly={readOnly}
                            onChange={(v, s) => this.updateAttribute("email", v)}
                        />
                    </Grid>
                } />
                <ControlledField module="serviceProvider" id="ServiceProvider.fax" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="serviceProvider" 
                            label="ServiceProviderForm.fax"
                            name="fax"
                            value={edited.fax}
                            readOnly={readOnly}
                            onChange={(v, s) => this.updateAttribute("fax", v)}
                        />
                    </Grid>
                } />
            </Grid>
        )
    }
}

export default withModulesManager(withTheme(withStyles(styles)(ServiceProviderMasterPanel)))

