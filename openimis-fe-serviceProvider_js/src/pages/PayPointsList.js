import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { injectIntl} from 'react-intl';
import { bindActionCreators } from "redux";
import { formatMessageWithValues, withModulesManager, withHistory} from "@openimis/fe-core";
import { ProgressOrError, Table } from "@openimis/fe-core";
import { fetchPayPoints } from "../actions";
import { Fab } from "@material-ui/core";
import { RIGHT_SERVICE_PROVIDER_ADD } from "../constants";




const styles = theme => ({
    page: theme.page,
    fab: theme.fab

});

class PayPointsList extends Component {

    state = {
        page: 0,
        pageSize: 10,
        afterCursor: null,
        beforeCursor: null,
    }

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-serviceProvider", "rowsPerPageOptions", [1, 5, 10, 15, 25, 50, 100]);
    }

    
    //this method is binding to payPointList class and it is executed every time this page is called
    componentDidMount() {
        //calls the query method to fetch payPoint
        this.query();

    }

    //Define some parameters and pass it while fetching payPoint from actpaypointNameions
    query  = () => {
        let prms = [];
        prms.push(`first: ${this.state.pageSize} `);
        if (!!this.state.afterCursor) {
            prms.push(`after: "${this.afterCursor}" `)
            
        }
        if (!!this.state.beforeCursor) {
            prms.push(`before: "${this.beforeCursor}" `)
            
        }
        prms.push( ` orderBy: ["id"]`);
        this.props.fetchPayPoints(prms);
    }

    onRowDoubleClick= (row) =>{
        console.log(row);
    }

    onDoubleClick = (p, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "payPoint.route.PayPointOverview", [p.uuid], newTab)
    }

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "payPoint.route.paypoint");
    }

   //This function is trigged when the row per page droupdown change which sets the pageSize and recall the query
    onChangeRowsPerPage = (cnt) => {
        this.setState(
            {
                pageSize: cnt,
                page: 0,
                afterCursor: null,
                beforeCursor: null,
            },
            e => this.query()
        )
    }

       //This function is trigged on next and previous page change
    onChangePage = (page, nbr) => {
        if (nbr > this.state.page) {
            this.setState( (state, props) => ({
                page: this.state.page  + 1,
                beforeCursor: null,
                afterCursor: this.props.PayPointsListInfo.endCursor,
            }),
            e => this.query()
            )
            
        }else if (nbr < this.state.page) {
            this.setState( (state, props) => ({
                page: this.state.page  - 1,
                beforeCursor: this.props.PayPointsListInfo.startCursor,
                afterCursor: null,
            }),
            e => this.query()
            )
            
        }
    }

    render() {
        const { intl, classes, fetchingPayPoints, errorPayPoints, PayPoints, PayPointsListInfo, rights } = this.props;
     
        let headers = [
          
            "payPoint.paypointName",
            "payPoint.paypointCode", 
            "payPoint.serviceProvider",
            "payPoint.geolocation",
            "payPoint.location",
         

            
        ]
         

        let itemFormatters = [
           
            e => e.paypointName,
            e => e.paypointName,
            e => e.serviceProvider.name,
            e => e.geolocation,
            e => e.location.name,
       

        ]
           
     
        return ( 
            <div className={classes.page} >

                < ProgressOrError progress={fetchingPayPoints} error={errorPayPoints} />
             
                <Table 
                    module = "serviceProvider"
                    header = {formatMessageWithValues(intl, "serviceProvider", "pay_point.table", { count: PayPointsListInfo.totalCount } )}
                    headers = {headers}
                    itemFormatters = { itemFormatters }
                    items = { PayPoints }
                    withPagination = {true}
                    page = {this.state.page}
                    pageSize = {this.state.pageSize}
                    count = {PayPointsListInfo.totalCount}
                    onChangePage = {this.onChangePage}
                    onChangeRowsPerPage ={this.onChangeRowsPerPage}
                    rowsPerPageOptions = {this.rowsPerPageOptions}
                    onDoubleClick={e => this.onDoubleClick(e)}
                    rights = {this.rights}
                />

            </div>
        )
    }
}


const mapStateToProps = state => ({
    // rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingPayPoints: state.serviceProvider.fetchingPayPoints,
    errorPayPoints: state.serviceProvider.errorPayPoints,
    fetchedPayPoints: state.serviceProvider.fetchedPayPoints,
    PayPoints: state.serviceProvider.PayPoints,
    PayPointsListInfo: state.serviceProvider.PayPointsListInfo,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPayPoints }, dispatch);
};


export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(PayPointsList))
    ))));