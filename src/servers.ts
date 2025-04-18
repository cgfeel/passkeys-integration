const SITE_URL = `http://${window.location.hostname}:3010`;

export const fetchHandle = async <T extends any,>(path: string, data?: Object) => {
  const body = data === void 0 ? {} : { body: JSON.stringify(data) };
  const options = {
    method: data === void 0 ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${SITE_URL}${path}`, {
    ...options,
    ...body
  });

  const json = await response.json() as T;
  return json;
};