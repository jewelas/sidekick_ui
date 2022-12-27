import { httpGet, httpPost, httpDelete, httpPatch } from "./baseRestService";

export function getAccounts() {
    return httpGet(`adAccount`);
}

export function getAccount(docId) {
    return httpGet(`adAccount?docId=${docId}`);
}

export function createAccount(companyName) {
    return httpPost('adAccount', { companyName });
}

export function updateAccount(accountData) {
    return httpPatch('adAccount', accountData)
}

export function deleteAccount(docId) {
    return httpDelete(`adAccount?docId=${docId}`)
}

export function getCampaigns() {
    return httpGet(`adCampaign`);
}

export function getAccountCampaigns(accountId) {
    return httpGet(`adCampaign?accountId=${accountId}`);
}

export function getCampaign(docId) {
    return httpGet(`adCampaign?docId=${docId}`);
}

export function createCampaign(name, accountId) {
    return httpPost('adCampaign', { name, accountId });
}

export function updateCampaign(campaignData) {
    return httpPatch('adCampaign', campaignData)
}

export function deleteCampaign(docId) {
    return httpDelete(`adCampaign?docId=${docId}`)
}

export function getAds() {
    return httpGet(`adAd`);
}

export function getCampaignAds(campaignId) {
    return httpGet(`adAd?campaignId=${campaignId}`);
}

export function getAd(docId) {
    return httpGet(`adAd?docId=${docId}`);
}

export function createAd(name, campaignId) {
    return httpPost('adAd', { name, campaignId });
}

export function updateAd(adData) {
    return httpPatch('adAd', adData)
}

export function deleteAd(docId) {
    return httpDelete(`adAd?docId=${docId}`)
}