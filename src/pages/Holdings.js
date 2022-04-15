import React from "react";
import { useSelector } from "react-redux";
import Lists from "../components/List";

export default function Holdings() {
  const collections = useSelector((state) => state.collections.collections);
  return (
    <div class="flex flex-col w-full h-full pl-0 md:p-2 md:space-y-4 overflow-scroll">
      <Lists collections={collections} />
    </div>
  );
}
