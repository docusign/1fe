const esmLibs = ['chalk'];

export default {
  transformIgnorePatterns: [`node_modules/(?!(${esmLibs.join('|')})/)`],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
};
