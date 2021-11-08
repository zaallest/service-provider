import {
    formatServerError, formatGraphQLError, parseData, pageInfo, dispatchMutationReq,
    dispatchMutationErr, dispatchMutationResp
} from '@openimis/fe-core';

function reducer(
    state = {
        fetchingServiceProviders: false,
        errorServiceProviders: null,
        fetchedServiceProviders: false,
        ServiceProviders: [],
        ServiceProvidersListInfo: { totalCount: 0},
        ServiceProvider: null,
        
        // fetchingServiceProvider: false,
        // fetchedServiceProvider: true,
        // errorServiceProvider: null,
        // errorServiceProvider: null,
        
        checkCanAddPaypoint: false,
        checkingCanAddPaypoint: false,
        checkedCanAddPaypoint: false,
        canAddPaypointWarnings: [],
        errorCanAddPaypoint: null,

        fetchingPayPoints: false,
        errorPayPoints: null,
        fetchedPayPoints: false,
        PayPoints: [],
        PayPoint: null,
        PayPointsListInfo: { totalCount: 0},

        submittingMutation: false,
        mutation: {},

    },
    action,
){
    
    switch (action.type) {
        case 'SERVICE_PROVIDER_SERVICE_PROVIDERS_LIST_REQ':
            
            return{
                ...state,
                fetchingServiceProviders: true,
                fetchedServiceProviders: false,
                ServiceProviders: [],
                ServiceProvidersListInfo: { totalCount: 0},
                errorServiceProviders: null,

            };
        
        case 'SERVICE_PROVIDER_SERVICE_PROVIDERS_LIST_RESP':
            
            return{
                ...state,
                fetchingServiceProviders: false,
                fetchedServiceProviders: true,
                ServiceProviders: parseData(action.payload.data.serviceProvider),
                ServiceProvidersListInfo: pageInfo(action.payload.data.serviceProvider),
                errorServiceProviders: formatGraphQLError(action.payload),
            };
                
            
        case 'SERVICE_PROVIDER_SERVICE_PROVIDERS_LIST_ERR':
            
            return{
                ...state,
                fetchingServiceProviders: false,
                errorServiceProviders: formatServerError(action.payload),
            };

        case 'SERVICEPROVIDER_SERVICEPROVIDERS_REQ':
            return {
                ...state,
                fetchingServiceProviders: true,
                fetchedServiceProviders: false,
                ServiceProviders: [],
                errorServiceProviders: null,
            };
        case 'SERVICEPROVIDER_SERVICEPROVIDERS_RESP':
            return {
                ...state,
                fetchingServiceProviders: false,
                fetchedServiceProviders: true,
                ServiceProviders: parseData(action.payload.data.serviceProvider),
                ServiceProvidersListInfo: pageInfo(action.payload.data.serviceProvider),
                errorServiceProviders: formatGraphQLError(action.payload),
            };
        case 'SERVICEPROVIDER_SERVICEPROVIDERS_ERR':
            return {
                ...state,
                fetchingServiceProviders: false,
                errorServiceProviders: formatServerError(action.payload),
            };
        
        case 'SERVICE_PROVIDER_SERVICE_PROVIDER_REQ':
            
            return{
                ...state,
                fetchingServiceProvider: false,
                fetchedServiceProvider: false,
                ServiceProvider: null,
                ServiceProviderListInfo: { totalCount: 0},
                
                errorServiceProvider: null,

            };
            
        case 'SERVICE_PROVIDER_SERVICE_PROVIDER_RESP':
                
            return{
                ...state,
                fetchingServiceProvider: false,
                fetchedServiceProvider: false,
                ServiceProvider: parseData(action.payload.data.serviceProvider)[0],
                ServiceProviderListInfo: pageInfo(action.payload.data.serviceProvider),
                errorServiceProvider: formatGraphQLError(action.payload)
            };
                    
                
        case 'SERVICE_PROVIDER_SERVICE_PROVIDER_ERR':
                
            return{
                ...state,
                fetchingServiceProvider: false,
                errorServiceProvider: formatServerError(action.payload)
            };

        case 'SERVICE_PROVIDER_STR_REQ':
            return {
                ...state,
                fetchingServiceProvider: true,
                fetchedServiceProvider: false,
                ServiceProvider: null,
                errorServiceProvider: null,
            };
        case 'SERVICE_PROVIDER_STR_RESP':
            return {
                ...state,
                fetchingServiceProvider: false,
                fetchedServiceProvider: true,
                serviceProvider: parseData(action.payload.data.ServiceProviderStr),
                errorServiceProvider: formatGraphQLError(action.payload)
            };
        
        case 'SERVICE_PROVIDER_STR_ERR':
             return {
                ...state,
                fetchingServiceProvider: false,
                errorServiceProvider: formatServerError(action.payload)
            };

            case 'SERVICEPROVIDER_PAYPOINT_MEMBERS_REQ':
                return {
                    ...state,
                    fetchingPayPoints: true,
                    fetchedPayPoints: false,
                    errorPayPoints: null,
                };
            case 'SERVICEPROVIDER_PAYPOINT_MEMBERS_RESP':
                return {
                    ...state,
                    fetchingPayPoints: false,
                    fetchedPayPoints: true,
                    PayPoints: parseData(action.payload.data.PayPoints),
                    PayPointsListInfo: pageInfo(action.payload.data.PayPoints),
                    errorPayPoints: formatGraphQLError(action.payload)
                };
                case 'SERVICEPROVIDER_PAYPOINT_MEMBERS_ERR':
                    return {
                        ...state,
                        fetchingPayPoints: false,
                        errorPayPoints: formatServerError(action.payload)
                    };
                case 'SERVICEPROVIDER_PAYPOINT_MEMBER':
                    return {
                        ...state,
                        insuree: action.payload,
                    };

        case 'LOCATION_USER_HEALTH_FACILITY_FULL_PATH_RESP':
            var userHealthFacilityFullPath = parseData(action.payload.data.ServiceProviders)[0]
            return {
                ...state,
                userHealthFacilityFullPath,
                userHealthFacilityLocationStr: !!userHealthFacilityFullPath.name ? ServiceProviderLabel(userHealthFacilityFullPath.name) : null,
            }

        case 'SERVICEPROVIDER_PAYPOINT_MEMBER':
            return {
                ...state,
                PayPoint: action.payload,
            };
        
        case 'SERVICE_PROVIDER_NEW':
            return {
                    ...state,
                    ServiceProviderListInfo: { totalCount: 0 },
                    ServiceProvider: null,
                    ServiceProvider: null,
            };
            
        case 'PAYPOINT_PAYPOINTS_LIST_REQ':
            
            return{
                ...state,
                fetchingPayPoints: true,
                fetchedPayPoints: false,
                PayPoints: [],
                PayPointsListInfo: { totalCount: 0},
                errorPayPoints: null,
        
            };
                
        case 'PAYPOINT_PAYPOINTS_LIST_RESP':
                    
            return{
                ...state,
                fetchingPayPoints: false,
                fetchedPayPoints: true,
                PayPoints: parseData(action.payload.data.payPoint),
                PayPointsListInfo: pageInfo(action.payload.data.payPoint),
                errorPayPoints: formatGraphQLError(action.payload),
            };
                        
                    
        case 'PAYPOINT_PAYPOINTS_LIST_ERR':
                    
            return{
                ...state,
                fetchingPayPoints: false,
                errorPayPoints: formatServerError(action.payload),
            };

            
        case 'SERVICE_PROVIDER_MUTATION_REQ':
            return dispatchMutationReq(state, action);

        case 'SERVICE_PROVIDER_MUTATION_ERR':
            return dispatchMutationErr(state, action);

        case 'SERVICE_PROVIDER_CREATE_SERVICE_PROVIDER_RESP':
            return dispatchMutationResp(state,"createServiceProvider", action );

        case 'SERVICE_PROVIDER_UPDATE_SERVICE_PROVIDER_RESP':
            return dispatchMutationResp(state, "updateServiceProvider", action);
    
        case 'SERVICE_PROVIDER_DELETE_SERVICE_PROVIDER_RESP':
            return dispatchMutationResp(state, "deleteServiceProvider", action);
    
        default:
            return state;
    }

}

export default reducer;