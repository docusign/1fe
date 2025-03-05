import React, { useEffect } from "react";
import { default as Widget } from './components/router';
import withProvider from './withProvider';



// export default function Root() {
//   return <p>My component from app1 is mounted! Hello world</p>;
// }
// TODO: Strongly type
const RootWrapper: any = (props) => {
  useEffect(() => {
    props.platform.utils.appLoadTime.end();
  }, []);

  return <Widget {...props} />;
};

export default withProvider(RootWrapper);

