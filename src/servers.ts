const SITE_URL = "http://localhost:3010";

export const fetchHandle = async <T extends any,>(path: string, data: Object) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(`${SITE_URL}${path}`, options);
  const json = await response.json() as T;

  return json;
};