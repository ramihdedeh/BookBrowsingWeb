export const generatePKCE = async () => {
    const encoder = new TextEncoder();
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const codeVerifier = btoa(String.fromCharCode.apply(null, array))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    const codeChallenge = btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    return { codeVerifier, codeChallenge };
};

export const exchangeCodeForToken = async (code, tokenEndpoint, clientId, redirectUri, audience) => {
    const codeVerifier = localStorage.getItem("pkce_verifier");
    
    const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: clientId,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
            audience: audience,
        }),
    });

    if (!response.ok) {
        throw new Error("Token exchange failed");
    }

    return response.json();
};

export const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
};
