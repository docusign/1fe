// import { platformProps } from '@devhub/1fe-shell';
// import { Button } from 'antd';
// import { isEqual } from 'lodash';
// import { useState } from 'react';

// import { WidgetProps } from 'src/contract';
// import { ResultElementBoundary } from '../misc/resultElementBoundary';
// import { useTranslate } from 'src/locales';

/**
 * JSON stringify helper that prevents circular references
 * and outputs functions and symbols
 * @returns string value that represents the current key
 */
export const jsonReplacer = () => {
  const visited = new WeakSet();
  return (_key: unknown, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    if (typeof value == 'function') {
      return 'function';
    }
    if (typeof value == 'symbol') {
      return 'symbol';
    }
    if (typeof value === 'undefined') {
      return null;
    }
    return value;
  };
};

// TODO: strongly type
// export const GetComparePlatformProps: React.FC<any> = (props) => {
//   // const t = useTranslate();
//   const [result, setResult] = useState<string>('');

//   return (
//     <div data-qa={`import.platformProps.comparison.container`}>
//       <Button
//         data-qa={`import.platformProps.comparison.btn`}
//         onClick={() => {
//           const instance = isEqual(
//             JSON.stringify(platformProps, jsonReplacer()),
//             JSON.stringify(platformProps, jsonReplacer()),
//           );

//           if (instance) {
//             setResult(true.toString());
//           } else {
//             setResult(false.toString());
//           }
//         }}
//       >
//         {/* {t(`Components.PlatformProps.ComparisonButton`)} */}
//         {`Components.PlatformProps.ComparisonButton`}

//       </Button>
//       <div role='status' data-qa={`import.platformProps.comparison.liveRegion`}>
//         {result ? (
//           <ResultElementBoundary
//             data-qa={`import.platformProps.comparison.result`}
//           >
//             {result}
//           </ResultElementBoundary>
//         ) : null}
//       </div>
//     </div>
//   );
// };
