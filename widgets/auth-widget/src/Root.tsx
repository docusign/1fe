import React from 'react';
import { WidgetProps } from './contract';

export default function Root(props: WidgetProps) {
  return (
    <>
      <p>My component from authed widget is mounted!</p>
    </>
  );
}
