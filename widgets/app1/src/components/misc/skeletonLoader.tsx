import styled from '@emotion/styled';
import { Skeleton } from 'antd';

const FlexDiv = styled.div`
  display: flex;
`;

export const SkeletonLoader = () => (
  <Skeleton data-qa='demo-skeleton-qa'>
    <div>
      <FlexDiv>
        <Skeleton
          avatar
          paragraph={{
            rows: 4,
          }}
        />
      </FlexDiv>
    </div>
  </Skeleton>
);
