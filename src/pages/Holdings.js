import React from "react";
import { useSelector } from "react-redux";
import Lists from "../components/List";
import { useQuery, gql } from "@apollo/client";
import { getCollectionsList } from "../helpers/Collections";

const TRADES_QUERY = gql`
  {
    getTrades {
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
    collections = getCollectionsList(data.getTrades);
  }
  console.log("hello", collections);
  return (
    <div class="flex flex-col w-full h-full pl-0 md:p-2 md:space-y-4 overflow-scroll">
      <Lists collections={collections} />
    </div>
  );
}
