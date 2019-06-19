import React from "react";
import data from "./jsonResult.json";

const baseUrl = "http://cert-chain.com/";

export default function List(props) {
  const { match } = props;
  const { params = {} } = match;
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
