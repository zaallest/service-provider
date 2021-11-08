import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    primaryButton: theme.dialog.primaryButton,
    secondaryButton: theme.dialog.secondaryButton,
})

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';

import { FormattedMessage } from "@openimis/fe-core";

import { ServiceProviderLabel } from "../utils/utils";


class DeleteServiceProviderDialog extends Component {

    render() {
        const { classes, serviceprovider, onCancel, onConfirm } = this.props;
        return (
            <Dialog
                open={!!serviceprovider}
                onClose={onCancel}
            >
                <DialogTitle><FormattedMessage module="serviceProvider" id="deleteServiceProviderDialog.title" values={{label: ServiceProviderLabel(serviceprovider)}} /></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <FormattedMessage module="serviceProvider" id="deleteServiceProviderDialog.message" values={{label: ServiceProviderLabel(serviceprovider)}} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => onConfirm(true)} className={classes.primaryButton} autoFocus>
                        <FormattedMessage module="serviceProvider" id="deleteServiceProviderDialog.deleteserviceProviderAndPayPoints.button" />
                    </Button>
                    <Button onClick={e => onConfirm(false)} className={classes.secondaryButton} >
                        <FormattedMessage module="serviceProvider" id="deleteServiceProviderDialog.deleteServiceProviderOnly.button" />
                    </Button>
                    <Button onClick={onCancel} className={classes.secondaryButton} >
                        <FormattedMessage module="core" id="cancel"/>
                    </Button>
                    
                </DialogActions>
            </Dialog>
        )
    }
}

export default injectIntl(withTheme(withStyles(styles)(DeleteServiceProviderDialog)));