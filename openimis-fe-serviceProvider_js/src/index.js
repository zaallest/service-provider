import messages_en from "./translations/en.json";
import ServiceProviderMainMenu from './menu/ServiceProviderMainMenu';

//Import pages...
// import PayPoint_Page from "./pages/PayPoint_Page";
import PayPointsList from "./pages/PayPointsList";
import ServiceProviderEditPage from "./pages/ServiceProviderEditPage";
import ServiceProvidersListPage from "./pages/ServiceProvidersListPage";

//mport pickers....
import ServiceProviderPicker from "./pickers/ServiceProviderPicker";
import ServiceProviderLegalFormPicker from "./pickers/ServiceProviderLegalFormPicker";
import ServiceProviderLevelPicker from "./pickers/ServiceProviderLevelPicker";
import ServiceProviderSubLevelPicker from "./pickers/ServiceProviderSubLevelPicker";
import reducer from "./reducer";



const ROUTE_SERVICE_PROVIDERS = "serviceProvider/service_providers";
const ROUTE_SERVICE_PROVIDER = "serviceProvider/service_provider";

//Define a constant of the paypoints rout
const ROUTE_PAY_POINTS = "serviceProvider/pay_points";
const ROUTE_PAY_POINT = "serviceProvider/pay_point";


//This section register pages to display...
const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: 'serviceProvider', reducer }],
  "core.MainMenu": [ServiceProviderMainMenu],
  "refs": [

    

    {key: "serviceProvider.ServiceProvidersListPage", ref: ServiceProvidersListPage},
    {key: "serviceProvider.PayPointsList", ref: PayPointsList},
    // {key: "serviceProvider.AddPayPoint", ref: PayPoint_Page},
    {key: "serviceProvider.ServiceProviderPicker", ref: ServiceProviderPicker},
    { key: "serviceProvider.ServiceProviderPicker.projection", ref: ["code", "name"] },
    {key: "serviceProvider.ServiceProviderLegalFormPicker", ref: ServiceProviderLegalFormPicker},
    { key: "serviceProvider.ServiceProviderLegalFormPicker.projection", ref: ["code", "legalForm"] },
    {key: "serviceProvider.ServiceProviderLevelPicker", ref: ServiceProviderLevelPicker},
    { key: "serviceProvider.ServiceProviderLevelPicker.projection", ref: ["code", "level"] },
    {key: "serviceProvider.ServiceProviderSubLevelPicker", ref: ServiceProviderSubLevelPicker},
    { key: "serviceProvider.ServiceProviderSubLevelPicker.projection", ref: ["code", "subLevel"] },

    { key: "serviceProvider.route.service_providers", ref: ROUTE_SERVICE_PROVIDERS },
    { key: "serviceProvider.route.service_provider", ref: ROUTE_SERVICE_PROVIDER },
    { key: "serviceProvider.route.pay_points", ref: ROUTE_PAY_POINTS },
    { key: "serviceProvider.route.pay_point", ref: ROUTE_PAY_POINT },

  ],
  "core.MainMenu": [ServiceProviderMainMenu],
  "core.Router": [
    
    { path: ROUTE_SERVICE_PROVIDERS, component: ServiceProvidersListPage },
    { path: ROUTE_SERVICE_PROVIDER, component: ServiceProviderEditPage },
    { path: ROUTE_SERVICE_PROVIDER + "/:serviceprovider_uuid?", component: ServiceProviderEditPage },
   
  
  ],


}

export const ServiceProviderModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}