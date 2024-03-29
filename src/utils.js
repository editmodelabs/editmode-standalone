// Thanks @stimulus:
// https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
export function domReady() {
    return new Promise(resolve => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", resolve)
        } else {
            resolve()
        }
    })
}

export async function api(path, config = {}) {
    const { parameters } = config
    const url = new URL("https://api.editmode.com")
    const urlparams = url.searchParams

    url.pathname = path

    if (parameters) {
        for (let [key, val] of Object.entries(parameters)) {
            if (val) {
                if (Array.isArray(val)) {
                    val.forEach(v => urlparams.append(key + "[]", v))
                } else {
                    urlparams.append(key, val)
                }
            }
        }
    }

    return fetch(url.toString(),
        {
            method: 'get',
            headers: {
                Accept: "application/json",
                referrer: window.location.href
            }
        }
    ).then(response => response.json())
}

export const parseVariable = (content, variables) => {
    if (variables) {
        try {
            eval(`variables = ${variables}`)
            if (typeof variables != 'object') throw "Invalid Variable Value " + variables
        } catch (error) {
            console.log(error)
        }

        const tokens = content && (content.match(/\{{(.*?)\}}/g) || []).map(t => t.substr(2, t.length - 4))

        if (tokens) {
            tokens.forEach(function (token) {
                const value = variables && variables[token] || ""
                const emVar = `<em-var data-chunk-variable="${token}" data-chunk-variable-value="${value}">${value}</em-var>`
                content = content.replace(`{{${token}}}`, emVar);
            });
        }
    }

    return content
}

export const setBranchId = () => {
    const url = new URL(window.location.href)
    const id = url.searchParams.get('em_branch_id')

    return id || ""
}

export const getCachedData = (id) => {
    const data = localStorage.getItem(id)
    if (data) {
        return JSON.parse(data)
    }
}

export const storeCache = (id, data) => {
    if (!data) return
    localStorage.setItem(id, JSON.stringify(data))
}

export const setTransformAttributes = (url, transform) => {
    try {
        transform = transform.trim().replace(/\s+/g, ' ').replaceAll(" ", ",")
        console.log(transform)
        let newUrl = new URL(url)

        newUrl.searchParams.append('tr', transform)

        return newUrl.toString()
    } catch (er) {
        console.warn(er)
        return url
    }
}

export const logger = (message) => {
    // TODO: Add type to change color between warn info and danger
    console.log(`%c ${message}`, 'color: #bada55');
}


export const storeTimedCache = (id, data) => {
    const expiry = new Date(new Date().setHours(new Date().getHours() + 1)); // Set 1 hour expiration
    const item = {
        value: data,
        expiry: expiry.getTime(),
    };
    localStorage.setItem(id, JSON.stringify(item));
};

export const getTimedCachedData = (id) => {
    const cachedItem = localStorage.getItem(id);
    if (!cachedItem) return null;
    const item = JSON.parse(cachedItem);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(id);
        return null;
    }
    return item.value;
};