
export function ServiceProviderLabel(sp) {

    return !!sp ? `${sp.code} ${sp.name}` : "";
}

export function PayPointLabel(pP) {
    return !!pP ? `${pP.paypointCode} ${pP.paypointName}` : "";
}