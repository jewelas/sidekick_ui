
const HOST = "https://us-central1-projectsidekick-9feaf.cloudfunctions.net/";

const setupXhr = (resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = event => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let data = "";

                try {
                    data = JSON.parse(xhr.responseText);
                } catch (ex) {
                    data = xhr.responseText;
                }

                resolve(data);
            } else if (xhr.status === 401) {
                handleUnauthorized(reject);
            } else {
                reject()
            }
        }
    }

    return xhr;
}

const applyAccessToken = xhr => {

    let accessToken = localStorage.getItem("accessToken");

    if (accessToken) {

        xhr.setRequestHeader("Authorization", accessToken);
    }
}

const handleUnauthorized = reject => {

    localStorage.removeItem("accessToken");
    reject();
}

export function httpGet(url) {

    return new Promise((resolve, reject) => {

        let xhr = setupXhr(resolve, reject);

        xhr.open("GET", HOST + url);

        applyAccessToken(xhr);

        xhr.send();
    });
}

export function httpDelete(url) {

    return new Promise((resolve, reject) => {

        let xhr = setupXhr(resolve, reject);

        xhr.open("DELETE", HOST + url);

        applyAccessToken(xhr);

        xhr.send();
    });
}

export function httpPost(url, data) {

    return new Promise((resolve, reject) => {

        let xhr = setupXhr(resolve, reject);

        xhr.open("POST", HOST + url);

        xhr.setRequestHeader("Content-Type", "application/json");

        applyAccessToken(xhr);

        xhr.send(JSON.stringify(data));
    });
}

export function httpPatch(url, data) {

    return new Promise((resolve, reject) => {

        let xhr = setupXhr(resolve, reject);

        xhr.open("PATCH", HOST + url);

        xhr.setRequestHeader("Content-Type", "application/json");

        applyAccessToken(xhr);

        xhr.send(JSON.stringify(data));
    });
}