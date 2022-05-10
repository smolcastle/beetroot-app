import React from "react";
import { useSelector } from "react-redux";
import Lists from "../components/List";
import { useQuery, gql } from "@apollo/client";
import { getCollectionsList } from "../helpers/Collections";
import PortfolioValue from "../components/PortfolioValue";
import { WindMillLoading } from "react-loadingg";

const TRADES_QUERY = gql`
  {
    getTrades(address: "0xf896527c49b44aab3cf22ae356fa3af8e331f280") {
      transfer_id
      tx_id
      from_address
      to_address
      token_id
      value
      block_number
      eth_value
      gas_price
      gas_used
      receiver
      sender
      time_stamp
      tx_cost
      tx_hash
      label_id
      token_standard
      token_symbol
      address
      name
      display_name
    }
  }
`;

export default function Holdings() {
  const { data, loading, error } = useQuery(TRADES_QUERY);
  let collections = [];
  if (!loading) {
    collections = getCollectionsList(data?.getTrades);
  } else {
    return (
      <div className="flex flex-1 h-full flex-col justify-center pb-20">
        <div className="relative">
          <WindMillLoading size={"large"} color={"#88C0D0"} />
        </div>
        <div className="text-f2 text-3xl font-light text-center mt-20">
          {"Life is like a Windmill"}
        </div>
      </div>
    );
  }
  console.log(data);

  return (
    <div class="flex flex-row w-full h-full pl-0 md:p-2 md:space-y-4">
      <PortfolioValue />
      <Lists collections={collections} />
    </div>
  );
}
