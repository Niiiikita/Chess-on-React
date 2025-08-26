// Поддержка import Icon from './icon.svg?react'
declare module "*.svg?react" {
  import { FunctionComponent, SVGProps } from "react";
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
