import type { ReactNode } from 'react';

type BasicProps = { children?: ReactNode } & Record<string, unknown>;

function createComponent(displayName: string) {
  const Component = ({ children }: BasicProps) => <div data-recharts={displayName}>{children}</div>;
  Component.displayName = displayName;
  return Component;
}

export const ResponsiveContainer = createComponent('ResponsiveContainer');
export const AreaChart = createComponent('AreaChart');
export const Area = createComponent('Area');
export const CartesianGrid = createComponent('CartesianGrid');
export const Tooltip = createComponent('Tooltip');
export const XAxis = createComponent('XAxis');
export const YAxis = createComponent('YAxis');
export const PieChart = createComponent('PieChart');
export const Pie = createComponent('Pie');
export const Legend = createComponent('Legend');
export const Cell = ({ children }: BasicProps) => <>{children}</>;
export const BarChart = createComponent('BarChart');
export const Bar = createComponent('Bar');
export const PolarGrid = createComponent('PolarGrid');
export const PolarAngleAxis = createComponent('PolarAngleAxis');
export const PolarRadiusAxis = createComponent('PolarRadiusAxis');
export const RadarChart = createComponent('RadarChart');
export const Radar = createComponent('Radar');

export default {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Legend,
  Cell,
  BarChart,
  Bar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadarChart,
  Radar,
};
