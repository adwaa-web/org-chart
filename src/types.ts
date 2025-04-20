import { Node, Edge } from 'reactflow';

// ユーザーデータの型定義
export interface User {
  id: string;
  name: string;
  position?: string;  // 役職
  avatar?: string;    // アバター画像URL（オプション）
}

// 基本ノード型定義
export interface BaseNode extends Node {
  sourceNodeId?: string;
}

// 部署ノード型定義
export interface DepartmentNode extends BaseNode {
  type: 'department';
  data: {
    label: string;
    color?: string;
  };
}

// ユーザーノード型定義
export interface UserNode extends BaseNode {
  type: 'user';
  data: {
    userId: string;
    name: string;
    position?: string;
  };
}

// 全ノード型
export type OrgChartNode = DepartmentNode | UserNode;

export interface StorageData {
  nodes: OrgChartNode[];
  edges: Edge[];
  departments: string[];
  users: User[];
}

export interface DepartmentColor {
  name: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}