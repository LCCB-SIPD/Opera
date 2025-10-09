export default async function Fetch<T = unknown>(
  dir: string,
  Method: string = "POST",
  payload: Record<string, unknown> = {},
  headers: Record<string, string> = {},  
): Promise<T | null> {
  if (!dir || dir === "") {
    alert("Invalid API Directory not found");
    return null;
  }

  try {
    const methodUpper = Method.toUpperCase();

    // If GET or HEAD, serialize payload as query string and don't send a body
    let url = dir;
    const fetchOptions: RequestInit = {
      method: methodUpper,
      headers: { "Content-Type": "application/json", ...headers},
    };

    if (methodUpper === "GET" || methodUpper === "HEAD") {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(payload)) {
        if (v === undefined || v === null) continue;
        params.append(k, String(v));
      }
      const query = params.toString();
      if (query) url = `${dir}${dir.includes("?") ? "&" : "?"}${query}`;
      // remove Content-Type for GET/HEAD requests since there's no body
      delete (fetchOptions.headers as Record<string, string>)["Content-Type"];
    } else {
      (fetchOptions).body = JSON.stringify(payload);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) throw new Error(`Failed to fetch ${dir}: ${response.status}`);

    const data: T = await response.json();
    return data;
  } catch (err) {
    console.error("Fetch_to error:", err);
    return null;
  }
}