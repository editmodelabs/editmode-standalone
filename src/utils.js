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
            if (typeof variables === 'string') {
                variables = JSON.parse(variables)
            }

            if (typeof variables != 'object') throw "Invalid Variable Value " + variables
        } catch (error) {
            console.error(error)
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
