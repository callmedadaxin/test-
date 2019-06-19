import React from "react";
import data from "./jsonResult.json";
import { parse } from "query-string";

const baseUrl = "http://cert-chain.com/";

export default function List(props) {
  const params = parse(window.location.search);

  const items = data.find(item => item.place === params.place);
  const { list = [] } = items;
  return (
    <div className="img-list">
      {list.map(item => (
        <div className="img-list-item">
          <img src={`${baseUrl}${item}`} alt={item} />
        </div>
      ))}
    </div>
  );
}
