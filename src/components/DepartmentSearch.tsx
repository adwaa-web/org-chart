import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { departmentColors } from '../constants';
import { DepartmentNode } from '../types';

interface DepartmentSearchProps {
  departments: string[];
  onSelect: (department: string) => void;
  onColorSelect: (color: string) => void;
  onAdd: (department: string) => void;
  selectedNode: DepartmentNode;
}

export function DepartmentSearch({
  departments,
  onSelect,
  onColorSelect,
  onAdd,
  selectedNode,
}: DepartmentSearchProps) {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    if (newDepartment.trim()) {
      onAdd(newDepartment.trim());
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
              className={`w-full aspect-square rounded-lg border-2 ${color.bgColor} ${
                color.borderColor
              } ${
                selectedNode.data.color === key ? 'ring-2 ring-offset-2 ring-blue-500' : ''
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

      <div className="max-h-48 overflow-y-auto mb-4">
        {filteredDepartments.map((dept) => (
          <button
            key={dept}
            className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md ${
              selectedNode.data.label === dept ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelect(dept)}
          >
            {dept}
          </button>
        ))}
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