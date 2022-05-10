import React from "react";
import { useSelector } from "react-redux";

export default function Price({ price: eth }) {
  const enableUSD = useSelector((state) => state.enableUSD.enableUSD);
  const ethPrice = useSelector((state) => state.enableUSD.ethPrice);
  return (
    <div>{`${enableUSD ? "$" : "Ξ"} ${
      enableUSD ? (ethPrice * eth).toFixed(2) : eth
    }`}</div>
  );
}
