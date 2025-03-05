type VisibleProps = {
  then: React.ReactNode;
  else?: React.ReactNode;
  if: unknown;
  children?: never;
};

export const Visible: React.FC<VisibleProps> = ({
  if: test,
  then,
  else: fallback,
}) => {
  if (!!test) {
    return <>{then}</>;
  }
  return fallback ? <>{fallback}</> : null;
};
