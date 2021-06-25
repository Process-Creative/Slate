//@ts-ignore
import * as Responsive from './../../styles/settings/responsive.scss';

export const XSMALL = parseInt(Responsive.xsmall);
export const SMALL = parseInt(Responsive.small);
export const MEDIUM = parseInt(Responsive.medium);
export const LARGE = parseInt(Responsive.large);
export const XLARGE = parseInt(Responsive.xlarge);
export const XXLARGE = parseInt(Responsive.xxlarge);

export const RESPONSIVE_SIZES = {
  XSMALL, SMALL, MEDIUM, LARGE, XLARGE, XXLARGE
};

export type ResponsiveOptions = keyof typeof RESPONSIVE_SIZES;

export const responsiveMediaAbove = (size:ResponsiveOptions) => {
  return window.innerWidth >= RESPONSIVE_SIZES[size];
};

export const responsiveMediaBelow = (size:ResponsiveOptions) => {
  return window.innerWidth < RESPONSIVE_SIZES[size];
};

export const responsiveQuery = (size:ResponsiveOptions) => {
  return `(min-width: ${RESPONSIVE_SIZES[size]}px)`;
}