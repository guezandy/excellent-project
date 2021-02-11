const API_URL = "http://jobcoin.gemini.com/pried-stuffing/api"

export const buildRequestURL = (resource = "", key) => {
    const url = `${API_URL}/${resource}`
    if (!key) {
        return url;
    }
    return `${url}/${key}`;
}

export const isValidAddress = async address => {
    const response = await fetch(buildRequestURL("addresses", address))
    const response_json = await response.json()

    if (!Object.keys(response_json).includes("balance") || !Object.keys(response_json).includes("transactions")) {
        return false;
    }

    if (response_json['balance'] === "0" && response_json['transactions'].length === 0) {
        return false
    }

    return true
}

export const createTransaction = async (fromAddress, toAddress, amount) => {
    let formData = new FormData();
    formData.append('fromAddress', fromAddress);
    formData.append('toAddress', toAddress);
    formData.append('amount', amount);
    fetch(buildRequestURL("transactions"), { method: "POST", body: formData });
}