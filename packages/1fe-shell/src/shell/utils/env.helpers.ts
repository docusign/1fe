import bowser from 'bowser';

export const getBrowserEnvironment = () => bowser.parse(window.navigator.userAgent);