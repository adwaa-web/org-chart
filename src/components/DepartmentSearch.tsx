import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { departmentColors } from '../constants';
import { DepartmentNode } from '../types';

interface DepartmentSearchProps {
  departments: string[];
  onSelect: (department: string) => void;
  onColorSelect: (color: string) => void;
  onAdd: (department: string) => void;
  onAddNode?: (department: string) => void;  // 新しいノードを追加するための関数
  selectedNode: DepartmentNode;
}

export function DepartmentSearch({
  departments,
  onSelect,
  onColorSelect,
  onAdd,
  // onAddNode は使用しなくなりましたが、
  // インターフェースの互換性のために型定義は維持します
  // onAddNode,
  selectedNode,
}: DepartmentSearchProps) {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');

  // コンポーネントのレンダリング回数を追跡
  const [renderCount, setRenderCount] = useState(0);

  // デバッグ用：コンポーネントのマウント時に部署リストを表示
  useEffect(() => {
    console.log('DepartmentSearch: 現在の部署リスト:', departments);
    // レンダリングカウントを増やす
    setRenderCount(prev => prev + 1);
  }, [departments]);

  // 検索フィルターを適用
  const filteredDepartments = search.trim() === ''
    ? [...departments] // 空の検索の場合はすべての部署を表示
    : departments.filter(dept => dept.toLowerCase().includes(search.toLowerCase()));

  console.log('フィルター後の部署リスト:', filteredDepartments);
  console.log('現在のレンダリング回数:', renderCount);

  const handleAdd = () => {
    if (newDepartment.trim()) {
      const trimmedDepartment = newDepartment.trim();
      console.log('追加ボタンがクリックされました:', trimmedDepartment);

      // 部署名を追加（ユーザーの要望により、部署リストにのみ追加）
      onAdd(trimmedDepartment);
      console.log('部署名追加関数を呼び出しました');

      // ユーザーの要望によりノードは自動的に追加しない
      // if (onAddNode) {
      //   console.log('ノード追加関数を呼び出します');
      //   onAddNode(trimmedDepartment);
      // }

      setNewDepartment('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">色を選択</h4>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(departmentColors).map(([key, color]) => (
            <button
              key={key}
              className={`w-full aspect-square rounded-lg border-2 ${color.bgColor} ${color.borderColor
                } ${selectedNode.data.color === key ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
              onClick={() => onColorSelect(key)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="部署を検索"
          className="pl-10 pr-4 py-2 w-full border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-48 overflow-y-auto mb-4 border border-gray-200 rounded p-1">
        <div className="text-xs text-gray-500 mb-2">
          デバッグ: 部署数 {departments.length} | レンダリング回数: {renderCount}
        </div>

        {/* 厳密にユニークなキーを使用して強制的に再レンダリング */}
        {[...departments].map((dept, index) => (
          <div key={`dept-${renderCount}-${index}-${dept}`} className="mb-1">
            <button
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md ${selectedNode.data.label === dept ? 'bg-blue-50' : ''
                }`}
              onClick={() => onSelect(dept)}
            >
              {dept}
            </button>
          </div>
        ))}

        {departments.length === 0 && (
          <div className="text-gray-500 text-center py-2">部署がありません</div>
        )}
      </div>

      {!isAdding ? (
        <button
          className="w-full flex items-center justify-center text-blue-600 hover:text-blue-700 py-2"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          新規部署を追加
        </button>
      ) : (
        <div className="mt-2">
          <input
            type="text"
            placeholder="新規部署名"
            className="w-full px-3 py-2 border rounded-md mb-2"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-2">
            <button
              className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleAdd}
            >
              追加
            </button>
            <button
              className="flex-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setIsAdding(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}