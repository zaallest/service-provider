import {
    graphql, formatPageQueryWithCount, formatMutation, formatPageQuery, formatGQLString, decodeId
} from "@openimis/fe-core";

const SERVICEPROVIDER_FULL_PROJECTION = mm => ["id","uuid","name","code","legalForm{code, legalForm}","level{code, level}","subLevel{code, subLevel}","accountCode", "phoneNumber","address" ,"email","fax"];
const PAYPOINT_FULL_PROJECTION = mm =>         ["id","uuid","paypointName", "paypointCode", "geolocation", "location{code, name}", "serviceProvider{code, name}",];
const SERVICEPROVIDER_PROJECTION = "serviceproviders{id,uuid,name,code, legalForm{code, legalForm}, level{code, level}, subLevel{code, subLevel}, accountCode, phoneNumber, address, email, fax}"


//this function fetches all the service providers
export function fetchServiceProviders(mm,perms) {
    const payload = formatPageQueryWithCount(
        "serviceProvider",
        perms,
        SERVICEPROVIDER_FULL_PROJECTION(mm)
        
        );
    return graphql(payload, 'SERVICE_PROVIDER_SERVICE_PROVIDERS_LIST');
}

export function fetchServiceProvider(mm, ServiceProviderUuid) {
  let filters = []
  if (!!ServiceProviderUuid) {
    filters.push(`uuid: "${ServiceProviderUuid}"`, "showHistory: true")
  }
  const payload = formatPageQueryWithCount("serviceProvider",
    filters,
    SERVICEPROVIDER_FULL_PROJECTION(mm)
  );
  return graphql(payload, 'SERVICE_PROVIDER_OVERVIEW');
}

//Fetch service provider summary....
export function fetchServiceProviderSummaries(mm, filters) {
  var projections = [
    "id","uuid","name","code",
    "legalForm{code, legalForm}","level{code, level}",
    "subLevel{code, subLevel}","accountCode", 
    "phoneNumber","address" ,"email","fax", 
    "validityFrom", "validityTo"]
  const payload = formatPageQueryWithCount("serviceProvider",
    filters,
    projections
  );
  return graphql(payload, 'SERVICEPROVIDER_SERVICEPROVIDERS');
}

//This function fetch service providers
  export function fetchServiceProviderStr( name, str) {
    let filters = [`type: "${name}"`, `str: "${str}"`];
   
    let projections = ["id", "uuid", "name", "code", "legalForm", "level", "subLevel", "address", "email","phoneNumber", "fax"]
    let payload = formatPageQuery("serviceProviderStr",
      filters,
      projections
    );
    return graphql(payload, `SERVICE_PROVIDER_STR`);
  }

  //new service provider function
  export function newServiceProvider() {
    return dispatch => {
      dispatch({ type: 'SERVICE_PROVIDER_NEW' })
    }
  }

    //This function fetch the service provider full...
  export function fetchServiceProviderFull(mm, uuid) {
    let payload = formatPageQuery("serviceProvider",
      [`uuid:"${uuid}"`],
      SERVICEPROVIDER_FULL_PROJECTION(mm),
      "clientMutationId"
    );
    return graphql(payload, 'SERVICE_PROVIDER_SERVICE_PROVIDER');
  }

  //This function fetch the service provider mutation...
  export function fetchServiceProviderMutation(mm, clientMutationId) {
    let payload = formatPageQuery("mutationLogs",
      [`clientMutationId:"${clientMutationId}"`],
      ["id", "serviceproviders{serviceprovider{uuid}}"]
    );
    return graphql(payload, 'SERVICE_PROVIDER_SERVICE_PROVIDER');
  }

  
  //This function Creats or update Service Provider
  export function createOrUpdateserviceprovider(sp, clientMutationLabel) {
    let action = sp.uuid !== undefined && sp.uuid !== null ? "update" : "create";
    let mutation = formatMutation(`${action}ServiceProvider`, formatServiceProviderGQL(sp), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
      mutation.payload,
      ['SERVICE_PROVIDER_MUTATION_REQ', `SERVICE_PROVIDER_${action.toUpperCase()}_SERVICE_PROVIDER_RESP`, 'SERVICE_PROVIDER_MUTATION_ERR'],
      {
        clientMutationId: mutation.clientMutationId,
        clientMutationLabel,
        requestedDateTime
      }
    )
  }

  function formatCatchment(catchment) {
    return `{
      ${!!catchment.id ? `id: ${catchment.id}` : ""}
      serviceProviderId: ${decodeId(catchment.location.id)}
      catchment: ${catchment.catchment}    
    }`
  }
  
  function formatCatchments(catchments) {
    if (!catchments || !catchments.length) return "";
    return `catchments: [
      ${catchments.map(c => formatCatchment(c)).join('\n')}
    ]`
  }
  
  

//SERVICE PROVIDER FORMATTER
function formatServiceProviderGQL(sp) {
  return `
    ${sp.uuid !== undefined && sp.uuid !== null ? `uuid: "${sp.uuid}"` : ''}
    name: "${sp.name}"
    code: "${sp.code}"
    legalFormCode: "${sp.legalForm}"
    levelCode: "${sp.level}"
    subLevelCode: "${sp.subLevel}"
    accountCode: "${sp.accountCode}"
    phoneNumber: "${sp.phoneNumber}"
    address: "${sp.address}"
    email: "${sp.email}"
    fax: "${sp.fax}"
    ${formatCatchments(sp.catchments)}

  `
}



//Create or Update Service Prooviders....
export function createOrUpdateServiceProvider(sp, clientMutationLabel) {
  let action = sp.uuid !== undefined && sp.uuid !== null ? "update" : "create";
  let mutation = formatMutation(`${action}ServiceProvider`, formatServiceProviderGQL(sp), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['SERVICE_PROVIDER_MUTATION_REQ', `SERVICE_PROVIDER_${action.toUpperCase()}_SERVICE_PROVIDER_RESP`, 'SERVICE_PROVIDER_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

//This method save service provider input date
export function createServiceProvider1(mm, serviceprovider, clientMutationLabel) {
  let action = sp.uuid !== undefined && sp.uuid !== null ? "update" : "create";
  let mutation = formatMutation(`${action}ServiceProvider`, formatServiceProviderGQL(serviceprovider), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['SERVICE_PROVIDER_MUTATION_REQ', `SERVICE_PROVIDER_${action.toUpperCase()}_SERVICE_PROVIDER_RESP`,'SERVICE_PROVIDER_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

//This method save service provider input date
export function createServiceProvider(sp, clientMutationLabel) {
  console.log(sp);
  let action = sp.uuid !== undefined && sp.uuid !== null ? "update" : "create";
  let formatServiceProviderGQL1 = `
    name: "${sp.name}"
    code: "${sp.code}"
    legalFormCode: "${sp.legalForm}"
    levelCode: "${sp.level}"
    subLevelCode: "${sp.subLevel}"
    accountCode: "${sp.accountCode}"
    phoneNumber: "${sp.phoneNumber}"
    address: "${sp.address}"
    email: "${sp.email}"
    fax: "${sp.fax}"
    ${formatCatchments(sp.catchments)}

`
let mutation = formatMutation(`${action}ServiceProvider`, formatServiceProviderGQL1, clientMutationLabel);

// let mutation = formatMutation("createServiceProvider", formatServiceProviderGQL1, clientMutationLabel);
console.log(mutation);

var requestedDateTime = new Date();
return graphql(
  mutation.payload,
  // "SERVICE_PROVIDER_CREATE_SERVICE_PROVIDER_RESP",
  ['SERVICE_PROVIDER_MUTATION_REQ', `SERVICE_PROVIDER_${action.toUpperCase()}_SERVICE_PROVIDER_RESP`,'SERVICE_PROVIDER_MUTATION_ERR'],

  {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
  }
)
     
}



//This function Update service providr data
export function updateServiceProvider(mm, service_provider, clientMutationLabel) {
  let mutation = formatMutation("updateServiceProvider", formatServiceProviderGQL(service_provider), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['SERVICE_PROVIDER_MUTATION_REQ','SERVICE_PROVIDER_UPDATE_SERVICE_PROVIDER_RESP','SERVICE_PROVIDER_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}

//This function Update service providr data
export function updateServiceProvider1(mm, service_provider, clientMutationLabel) {
  let mutation = formatMutation("updateServiceProvider", formatInsureeGQL(mm, service_provider), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['SERVICE_PROVIDER_MUTATION_REQ','SERVICE_PROVIDER_UPDATE_SERVICE_PROVIDER_RESP','SERVICE_PROVIDER_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}


//This method delete service provider date
  export function deleteServiceProvider(sp, clientMutationLabel) {
    let payload = `
      uuid: "${sp.uuid}"
      code: "${sp.code}"
    `
    let mutation = formatMutation("deleteServiceProvider", payload, clientMutationLabel);
    var requestedDateTime = new Date();
    sp.clientMutationId = mutation.clientMutationId;
  return graphql(
    mutation.payload,
    ['SERVICE_PROVIDER_MUTATION_REQ','SERVICE_PROVIDER_DELETE_SERVICE_PROVIDER_RESP','SERVICE_PROVIDER_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    }
  )
}


//Check if you can add a service provider....
export function checkCanAddServiceProvider(serviceprovider) {
  
  let filters = [`serviceproviderId:${decodeId(serviceprovider.id)}`]
    const payload = formatQuery("canAddServiceProvider",
       filters,
       null
     );
     return graphql(payload, 'SERVICE_PROVIDER_CAN_ADD_SERVICEPROVIDER');
   }


//This method creates paypoints 
export function createPayPoint( PayPoint, clientMutationLabel) {
  let formatPayPointGQL = `
  paypointName: "${PayPoint.paypointName}"
  paypointCode: "${PayPoint.paypointCode}"
  geolocation: "${PayPoint.geolocation}"
  serviceProvider: "${PayPoint.serviceProvider}"
  location: "${PayPoint.location}"
  

  `
let mutation = formatMutation("createPayPoint", formatPayPointGQL, clientMutationLabel);
var requestedDateTime = new Date();
return graphql(
  mutation.payload,
  ['PAY_POINT_MUTATION_REQ','PAY_POINT_CREATE_SERVICE_PROVIDER_RESP','PAY_POINT_MUTATION_ERR'],

  {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
  })

}

//This function Update Pay Point data
export function updatePayPoint(mm, service_provider, clientMutationLabel) {
  let mutation = formatMutation("updatePayPoint", formatInsureeGQL(mm, paypoint), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['PAY_POINT_MUTATION_REQ','PAY_POINT_UPDATE_SERVICE_PROVIDER_RESP','PAY_POINT_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime
    }
  )
}


//Check if you can add a pay point....
export function checkCanAddPayPoint(serviceprovider) {
  
  let filters = [`serviceproviderId:${decodeId(serviceprovider.id)}`]
    const payload = formatQuery("checkCanAddPayPoint",
       filters,
       null
     );
     return graphql(payload, 'PAY_POINT_CAN_ADD_PAYPOINT');
   }

   //this function fetches all the pay point providers
export function fetchPayPoints(mm,perms) {
  const payload = formatPageQueryWithCount(
      "payPoint",
      perms,
      PAYPOINT_FULL_PROJECTION(mm)
      
      );
  return graphql(payload, 'PAYPOINT_PAYPOINTS_LIST');
}


// This function fetch all the names of service provider

export function fetchServiceProviderNames(mm, filters) {
  var projections = [ "name"]
  const payload = formatPageQueryWithCount("serviceProvider",
    filters,
    projections
  );
  return graphql(payload, 'SERVICEPROVIDER_SERVICEPROVIDERS');
}

export function fetchServiceP(mm, serviceproviderUuid, serviceproviderCode) {
  let filters = [
    !!serviceproviderUuid ? `uuid: "${serviceproviderUuid}"` : `code: "${serviceproviderCode}"`,
    'showHistory: true'
  ]
  let projections = [
    "id", "uuid", "name", "code", "legalForm{legalForm}", "level{level}",
    "subLevel{subLevel}", "accountCode","phoneNumber","email", "fax",
    "validityFrom", "validityTo"
  ]
  const payload = formatPageQuery("serviceProvider",
    filters,
    projections
  );
  return graphql(payload, 'SERVICE_PROVIDER_SERVICE_PROVIDER');
}



//This function paypoints by uuid
export function fetchPayPoint(mm, PayPointUuid) {
let filters = []
if (!!PayPointUuid) {
  filters.push(`uuid: "${PayPointUuid}"`, "showHistory: true")
}
const payload = formatPageQueryWithCount("serviceProvider",
  filters,
  PAYPOINT_FULL_PROJECTION(mm)
);
return graphql(payload, 'PAY_POINT_OVERVIEW');
}

//This function deletes Paypoint...
export function deletePayPoint(mm, serviceprovider_uuid, paypoint, clientMutationLabel) {
  let mutation = formatMutation("deletePayPoint", `${!!serviceprovider_uuid ? `uuid: "${serviceprovider_uuid}",` : ""} `, clientMutationLabel);
  paypoint.clientMutationId = mutation.clientMutationId;
  var requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    ['PAYPOINT_MUTATION_REQ', 'PAYPOINT_DELETE_INSUREES_RESP', 'PAYPOINT_MUTATION_ERR'],
    {
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
      serviceprovider_uuid: serviceprovider_uuid,
    }
  )
}


  //new pay point function
export function newPayPoint() {
    return dispatch => {
      dispatch({ type: 'PAY_POINT_NEW' })
    }
}

//This function fetch the service provider mutation...
export function fetchPayPointMutation(mm, clientMutationId) {
  let payload = formatPageQuery("mutationLogs",
    [`clientMutationId:"${clientMutationId}"`],
    ["id", "paypoints{paypoint{uuid}}"]
  );
  return graphql(payload, 'PAYPOINT_PAYPOINT');
}





 