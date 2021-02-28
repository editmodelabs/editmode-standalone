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