import { platformProps } from '@devhub/1fe-shell';
import { Button } from 'antd';
import { useReducer, useState } from 'react';
import { WidgetContainer } from '../misc/widgetContainer';
import { GetChildWidget } from '../misc/utils';

export const AppLoadTime = () => {
  const [isVisible, showWidget] = useReducer(() => true, false);
  const [entries, setEntries] = useState<string | null>(null);
  const [measure, setMeasure] = useState<string | null>(null);

  // const t = useTranslate();

  return (
    <div data-qa='utils.appLoadTime.container'>
      <h2>utils.appLoadTime</h2>
      <Button data-qa='utils.appLoadTime.get.btn' onClick={showWidget}>
        utils.appLoadTime.Get/MarkEnd
      </Button>
      <Button
        data-qa='utils.appLoadTime.getEntries.btn'
        onClick={async () => {
          const resultString = platformProps.utils.appLoadTime
            .getEntries()
            .map((entry) => {
              return `Name: ${entry.name}, Entry Type: ${entry.entryType}, Start Time: ${entry.startTime}, Duration: ${entry.duration}`;
            })
            .join('; ');
          setEntries(resultString);
        }}
      >
        utils.appLoadTime.getEntries
      </Button>

      {entries && (
        <div data-qa='utils.appLoadTime.getEntries.result'>{entries}</div>
      )}

      <Button
        data-qa='utils.appLoadTime.mark.btn'
        onClick={() => {
          platformProps.utils.appLoadTime.markStart('iLove1FESoMuchMarkTest');
          setMeasure('Mark started');
        }}
      >
        utils.appLoadTime.markStart
      </Button>
      <Button
        data-qa='utils.appLoadTime.measure.btn'
        onClick={() => {
          const result = platformProps.utils.appLoadTime.markEnd(
            'iLove1FESoMuchMarkTest',
          );

          if (result) {
            setMeasure(`${result.name}  ${result.duration.toString()}`);
          }
        }}
      >
        utils.appLoadTime.markEnd
      </Button>
      {measure && (
        <div data-qa='utils.appLoadTime.measure.result'>{measure}</div>
      )}

      {isVisible && (
        <WidgetContainer data-qa='utils.widgets.appLoadTime.result.container'>
          <GetChildWidget isVisible={isVisible} />
        </WidgetContainer>
      )}
    </div>
  );
};
