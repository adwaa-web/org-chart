import { useState } from 'react';
import { User } from '../types';
import { Search, UserPlus, X } from 'lucide-react';

interface UserAssignmentProps {
  users: User[];
  departmentUsers: string[];
  onAssignUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onAddUser: (user: User) => void;
}

export function UserAssignment({
  users,
  departmentUsers,
  onAssignUser,
  onRemoveUser,
  onAddUser
}: UserAssignmentProps) {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPosition, setNewUserPosition] = useState('');
  
  // この部署に割り当てられていないユーザーをフィルタリング
  const availableUsers = users.filter(user => 
    !departmentUsers.includes(user.id) && 
    (search.trim() === '' || 
     user.name.toLowerCase().includes(search.toLowerCase()) ||
     (user.position && user.position.toLowerCase().includes(search.toLowerCase())))
  );
  
  // この部署に割り当てられているユーザー
  const assignedUsers = users.filter(user => 
    departmentUsers.includes(user.id)
  );
  
  // 新規ユーザー追加処理
  const handleAddNewUser = () => {
    if (newUserName.trim()) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: newUserName.trim(),
        position: newUserPosition.trim() || undefined
      };
      
      onAddUser(newUser);
      setNewUserName('');
      setNewUserPosition('');
      setIsAdding(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg">
      {/* 担当者リスト */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">現在の担当者</h4>
        {assignedUsers.length > 0 ? (
          <div className="space-y-2">
            {assignedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">{user.name}</div>
                  {user.position && (
                    <div className="text-xs text-gray-500">{user.position}</div>
                  )}
                </div>
                <button
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => onRemoveUser(user.id)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-2">
            担当者が設定されていません
          </div>
        )}
      </div>
      
      {/* 担当者追加 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">担当者を追加</h4>
        
        <div className="relative mb-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="担当者を検索"
            className="pl-10 pr-4 py-2 w-full border rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="max-h-36 overflow-y-auto border border-gray-200 rounded p-1 mb-2">
          {availableUsers.length > 0 ? (
            availableUsers.map(user => (
              <div key={user.id} className="mb-1">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                  onClick={() => onAssignUser(user.id)}
                >
                  <div className="font-medium">{user.name}</div>
                  {user.position && (
                    <div className="text-xs text-gray-500">{user.position}</div>
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-2">
              追加可能なユーザーがいません
            </div>
          )}
        </div>
      </div>
      
      {/* 新規ユーザー追加 */}
      {!isAdding ? (
        <button
          className="w-full flex items-center justify-center text-blue-600 hover:text-blue-700 py-2"
          onClick={() => setIsAdding(true)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          新規ユーザーを追加
        </button>
      ) : (
        <div className="mt-2">
          <input
            type="text"
            placeholder="名前"
            className="w-full px-3 py-2 border rounded-md mb-2"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNewUser()}
          />
          <input
            type="text"
            placeholder="役職（任意）"
            className="w-full px-3 py-2 border rounded-md mb-2"
            value={newUserPosition}
            onChange={(e) => setNewUserPosition(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNewUser()}
          />
          <div className="flex gap-2">
            <button
              className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleAddNewUser}
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
