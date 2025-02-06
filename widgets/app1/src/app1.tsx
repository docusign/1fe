import React from "react";

// export default function Root() {
//   return <p>My component from app1 is mounted! Hello world</p>;
// }

const RootWrapper: React.FC<any> = (props) => {
  console.log(props);
  return <p>My component from app1 is mounted! Hello world</p>;
};

export default RootWrapper;

