import {} from "dotenv/config";
import fetch from "node-fetch";
import querystring from "querystring";
import xml2js from "xml2js-es6-promise";

export default async query => {
  if (!query) return null;
  query = querystring.escape(query);
  let data = null;
  const url = `https://api.indeed.com/ads/apisearch?publisher=${
    process.env.INDEED_API_KEY
  }&format=xml&q=${query}&v=2`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const js = await xml2js(text);
    if (js.response) {
      data = js.response.results[0].result.map(result => {
        let title = result.jobtitle[0];
        let company = result.company[0];
        let location = result.formattedLocation[0];
        let snippet = result.snippet[0];
        let url = result.url[0];
        return {
          title,
          company,
          location,
          snippet,
          url
        };
      });
    }
  } catch (error) {
    console.log(error);
  }

  return data;
};
