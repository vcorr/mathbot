import type { ComponentType } from 'react';
import CoordDiagram from './CoordDiagram';
import CoordSliderDiagram from './CoordSliderDiagram';
import RiseRunDiagram from './RiseRunDiagram';
import ThreeLinesDiagram from './ThreeLinesDiagram';
import TwoPointDiagram from './TwoPointDiagram';
import LinearDiagram from './LinearDiagram';
import GradientSliderDiagram from './GradientSliderDiagram';
import LinearShiftDiagram from './LinearShiftDiagram';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<string, ComponentType<any>> = {
  'coord': CoordDiagram,
  'coord-slider': CoordSliderDiagram,
  'rise-run': RiseRunDiagram,
  'three-lines': ThreeLinesDiagram,
  'two-point': TwoPointDiagram,
  'linear': LinearDiagram,
  'gradient-slider': GradientSliderDiagram,
  'linear-shift': LinearShiftDiagram,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDiagram(key: string): ComponentType<any> | undefined {
  return registry[key];
}
