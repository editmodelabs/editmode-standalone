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

export async function api(path) {
    return fetch("https://api.editmode.com" + path,
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

        const tokens = (content.match(/\{{(.*?)\}}/g) || []).map(t => t.substr(2, t.length - 4))

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


export const getCachedData = (id) => {
    const data = localStorage.getItem(id);
    if (data) {
        return JSON.parse(data)
    }
}

export const storeCache = (id, data) => {
    localStorage.setItem(id, JSON.stringify(data));
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