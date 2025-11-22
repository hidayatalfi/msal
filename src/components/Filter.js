import React from "react";

export default function Filter({ filterData = ["Filter"], filter, setFilter }) {
  return (
    <>
      {filterData.map((item, index) => (
        <div
          key={index}
          onClick={() => setFilter(item)}
          className={`${filter === item && "bg-linear-to-r from-blue-400 to-purple-400 text-white"} flex w-fit cursor-pointer items-center justify-center rounded-full border border-gray-300 px-5 py-1`}
        >
          <p className="text-sm">{item}</p>
        </div>
      ))}
    </>
  );
}
