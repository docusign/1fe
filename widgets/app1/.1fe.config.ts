import { fetchCommonConfigs } from '@myorg/common-configs';

export default {
  extends: async () => {
    return await fetchCommonConfigs();
  },
};
