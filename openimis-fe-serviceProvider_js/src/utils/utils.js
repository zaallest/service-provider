import _ from "lodash";


export function PayPointLabel(pP) {
    return !!pP ? `${pP.paypointCode} ${pP.paypointName}` : "";
}

export function ServiceProviderLabel(serviceprovider) {
    if (!serviceprovider) return "";
    return `${_.compact([serviceprovider.name, serviceprovider.code]).join(" ")} : "" `;
}


export function insureeLabel(insuree) {
    if (!insuree) return "";
    return `${_.compact([insuree.lastName, insuree.otherNames]).join(" ")}${!!insuree.chfId ? ` (${insuree.chfId})` : ""}`
}

export function familyLabel(family) {
    return !!family && !!family.headInsuree ? insureeLabel(family.headInsuree) : ""
}