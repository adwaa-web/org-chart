import { Handle, Position } from 'reactflow';
import { departmentColors } from '../constants';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store/useStore';

interface DepartmentNodeProps {
  data: { 
    label: string;
    color?: string;
    users?: string[];
  };
  id: string;
}

export function DepartmentNode({ data, id }: DepartmentNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colorStyle = data.color ? departmentColors[data.color] : getDepartmentStyle(data.label);
  
  // 担当者表示のためのuseStoreから必要な情報を取得
  const users = useStore(state => state.users);
  const departmentUsers = data.users || [];
  const assignedUsers = users.filter(user => departmentUsers.includes(user.id));
  
  const handleAddNode = () => {
    const existingNodes = document.querySelectorAll('[data-testid^="rf__node-"]');
    const currentNode = Array.from(existingNodes).find(node => node.getAttribute('data-testid') === `rf__node-${id}`);
    
    if (currentNode) {
      const rect = currentNode.getBoundingClientRect();
      
      // 次の階層のノードを探す（現在のノードの子要素）
      const childNodes = Array.from(existingNodes).filter(node => {
        const nodeRect = node.getBoundingClientRect();
        return Math.abs(nodeRect.left - (rect.left + 200)) < 10;
      });

      // Y座標でソート
      childNodes.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

      // 親ノードのY座標を基準に、子ノードを均等に配置
      const totalHeight = childNodes.length > 0 ? 100 * (childNodes.length + 1) : 0; // 新しいノードも含めた総高さ
      const startY = rect.top - (totalHeight / 2); // 親ノードを中心に配置開始

      // 既存の子ノードの位置を更新
      childNodes.forEach((node, index) => {
        const nodeId = node.getAttribute('data-testid')?.replace('rf__node-', '');
        if (nodeId) {
          const updateEvent = new CustomEvent('updateNodePosition', {
            detail: {
              id: nodeId,
              position: {
                x: rect.left + 200,
                y: startY + (index * 100)
              }
            }
          });
          window.dispatchEvent(updateEvent);
        }
      });

      // 新しいノードを追加
      const newNode = {
        id: `node-${Date.now()}`,
        type: 'department',
        position: {
          x: rect.left + 200,
          y: startY + (childNodes.length * 100)
        },
        data: { label: '新規部署', color: 'gray' },
        sourceNodeId: id
      };

      const event = new CustomEvent('addNode', { detail: newNode });
      window.dispatchEvent(event);
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`px-4 py-2 shadow-md rounded-lg border-2 min-w-[120px] ${
        colorStyle.bgColor
      } ${colorStyle.borderColor} ${colorStyle.textColor}`}>
        <Handle 
          type="target" 
          position={Position.Left}
          className="w-3 h-3 !bg-gray-400"
        />
        <div className="font-medium text-sm text-center">{data.label}</div>
        
        {/* 担当者情報表示 */}
        {assignedUsers.length > 0 && (
          <div className="text-xs mt-1 border-t pt-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              <span>{assignedUsers.length}</span>
            </div>
            {assignedUsers.length <= 2 && assignedUsers.map((user) => (
              <div key={user.id} className="text-center">
                <span>{user.name}</span>
                {user.position && (
                  <span className="ml-1 opacity-70">({user.position})</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <Handle 
          type="source" 
          position={Position.Right}
          className="w-3 h-3 !bg-gray-400"
        />
      </div>
      {isHovered && (
        <button
          className="absolute -right-8 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition-colors"
          onClick={handleAddNode}
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

const getDepartmentStyle = (label: string) => {
  if (label === '代表取締役社長') {
    return departmentColors.blue;
  }
  if (label === '本社') {
    return departmentColors.amber;
  }
  if (label === '工場部門') {
    return departmentColors.emerald;
  }
  if (label.includes('総務') || label.includes('営業') || label.includes('販売')) {
    return departmentColors.orange;
  }
  if (label.includes('品質') || label.includes('技術') || label.includes('製造')) {
    return departmentColors.green;
  }
  return departmentColors.gray;
};