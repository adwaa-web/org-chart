import { Node, Edge } from 'reactflow';

// ユーザーデータの型定義
export interface User {
  id: string;
  name: string;
  position?: string;  // 役職
  avatar?: string;    // アバター画像URL（オプション）
}

export interface DepartmentNode extends Node {
  data: {
    label: string;
    color?: string;
    users?: string[];  // 担当者のユーザーID配列
  };
  sourceNodeId?: string;
}

export interface StorageData {
  nodes: DepartmentNode[];
  edges: Edge[];
  departments: string[];
  users: User[];       // ユーザー情報の配列を追加
}

export interface DepartmentColor {
  name: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}