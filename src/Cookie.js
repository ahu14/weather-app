export let setCookie = (name, value) => {
    let d = new Date(Date.now() + 3600 * 1000 * 24 * 365).toUTCString();
    document.cookie = `${name}=${value}; expires=${d}`;
}

export let getCookie = (name) => {
    let cookies = document.cookie.split(';');
    let value = "";

    for (let i = 0; i < cookies.length; i++){
        let cookie = cookies[i].trim();

        if (cookie.startsWith(`${name}=`)){
            value = cookie.substring(`${name}=`.length, cookie.length);
            break;
        }
    }

    return value;
}