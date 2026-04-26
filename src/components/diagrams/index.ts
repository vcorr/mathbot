import type { ComponentType } from 'react';
import CoordDiagram from './CoordDiagram';
import CoordSliderDiagram from './CoordSliderDiagram';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, ComponentType<any>> = {
  coord: CoordDiagram,
  'coord-slider': CoordSliderDiagram,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDiagram(key: string): ComponentType<any> | undefined {
  return registry[key];
}
