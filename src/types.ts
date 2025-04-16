import { Node, Edge } from 'reactflow';

export interface DepartmentNode extends Node {
  data: {
    label: string;
    color?: string;
  };
  sourceNodeId?: string;
}

export interface StorageData {
  nodes: DepartmentNode[];
  edges: Edge[];
  departments: string[];
}

export interface DepartmentColor {
  name: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}