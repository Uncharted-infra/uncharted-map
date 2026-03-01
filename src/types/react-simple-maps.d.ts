declare module "react-simple-maps" {
  import { FC, ReactNode } from "react";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      rotate?: [number, number, number];
      scale?: number;
      center?: [number, number];
    };
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: Geography[] }) => ReactNode;
    parseGeographies?: (geos: unknown[]) => unknown[];
  }

  export interface Geography {
    rsmKey: string;
    id?: string;
    properties: Record<string, unknown>;
    svgPath?: string;
  }

  export interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (evt: React.MouseEvent) => void;
    onMouseLeave?: (evt: React.MouseEvent) => void;
    onMouseDown?: (evt: React.MouseEvent) => void;
    onMouseUp?: (evt: React.MouseEvent) => void;
  }

  export interface SphereProps {
    id?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }

  export interface GraticuleProps {
    stroke?: string;
    strokeWidth?: number;
  }

  export const ComposableMap: FC<ComposableMapProps>;
  export const Geographies: FC<GeographiesProps>;
  export const Geography: FC<GeographyProps>;
  export const Sphere: FC<SphereProps>;
  export const Graticule: FC<GraticuleProps>;
}
