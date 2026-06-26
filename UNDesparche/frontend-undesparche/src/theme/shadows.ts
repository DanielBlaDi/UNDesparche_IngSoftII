import type { Shadows } from '@mui/material/styles';

const shadowKeyUmbraOpacity = 0.04;
const shadowAmbientShadowOpacity = 0.06;
const shadowHoverOpacity = 0.08;

function createShadow(px: number, opacity: number): string {
  return `0 ${px}px ${px * 3}px rgba(0, 0, 0, ${opacity})`;
}

export const shadows: Shadows = [
  'none',
  createShadow(1, shadowKeyUmbraOpacity),
  createShadow(2, shadowKeyUmbraOpacity),
  createShadow(3, shadowKeyUmbraOpacity),
  createShadow(4, shadowAmbientShadowOpacity),
  createShadow(5, shadowAmbientShadowOpacity),
  createShadow(6, shadowAmbientShadowOpacity),
  createShadow(7, shadowAmbientShadowOpacity),
  createShadow(8, shadowHoverOpacity),
  createShadow(9, shadowHoverOpacity),
  createShadow(10, shadowHoverOpacity),
  createShadow(11, shadowHoverOpacity),
  createShadow(12, shadowHoverOpacity),
  createShadow(13, shadowHoverOpacity),
  createShadow(14, shadowHoverOpacity),
  createShadow(15, shadowHoverOpacity),
  createShadow(16, shadowHoverOpacity),
  createShadow(17, shadowHoverOpacity),
  createShadow(18, shadowHoverOpacity),
  createShadow(19, shadowHoverOpacity),
  createShadow(20, shadowHoverOpacity),
  createShadow(21, shadowHoverOpacity),
  createShadow(22, shadowHoverOpacity),
  createShadow(23, shadowHoverOpacity),
  createShadow(24, shadowHoverOpacity),
];
