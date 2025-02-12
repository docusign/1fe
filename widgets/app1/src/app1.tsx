import React from "react";
import { default as Widget } from './components/router';
import withProvider from './withProvider';



// export default function Root() {
//   return <p>My component from app1 is mounted! Hello world</p>;
// }
// TODO: Strongly type
const RootWrapper: any = (props) => {
  return <Widget {...props} />;
};

export default withProvider(RootWrapper);

