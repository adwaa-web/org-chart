import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { DepartmentNode } from './components/DepartmentNode';
import { UserNode } from './components/UserNode';
import { DepartmentSearch } from './components/DepartmentSearch';
import { UserAssignment } from './components/UserAssignment';
import { DepartmentNode as DepartmentNodeType } from './types';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import useStore from './store/useStore';

// カスタムノードタイプの定義
const nodeTypes = {
  department: DepartmentNode,
  user: UserNode,
};

function App() {
  // zustandストアからの状態と関数を取得
  const {
    nodes,
    edges,
    departments,
    users,
    selectedNode,
    isSidebarOpen,
    activeTab,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
    setIsSidebarOpen,
    setActiveTab,
    handleDepartmentSelect,
    handleColorSelect,
    handleAddDepartment,
    handleAddNodeFromEvent,
    handleUpdateNodePosition,
    handleUndo,
    handleRedo,
    loadFromStorage,
    isInitialized,
    handleAddUser
  } = useStore();

  // 初期化処理 - ローカルストレージからデータをロード
  useEffect(() => {
    if (!isInitialized) {
      console.log('Initializing store from storage...');
      loadFromStorage();
    }
  }, [isInitialized, loadFromStorage]);

  // キーボードショートカットのハンドラを設定
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          console.log('Redo shortcut detected (Ctrl+Shift+Z)');
          handleRedo();
        } else {
          console.log('Undo shortcut detected (Ctrl+Z)');
          handleUndo();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        console.log('Redo shortcut detected (Ctrl+Y)');
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // カスタムイベントリスナーの設定
  useEffect(() => {
    const handleAddNodeEvent = (event: CustomEvent) => {
      handleAddNodeFromEvent(event.detail);
    };

    const handleUpdateNodePositionEvent = (event: CustomEvent) => {
      const { id, position } = event.detail;
      handleUpdateNodePosition(id, position);
    };

    window.addEventListener('addNode', handleAddNodeEvent as EventListener);
    window.addEventListener('updateNodePosition', handleUpdateNodePositionEvent as EventListener);

    return () => {
      window.removeEventListener('addNode', handleAddNodeEvent as EventListener);
      window.removeEventListener('updateNodePosition', handleUpdateNodePositionEvent as EventListener);
    };
  }, [handleAddNodeFromEvent, handleUpdateNodePosition]);

  return (
    <div className="w-screen h-screen flex bg-gray-50">
      <div className={`flex-1 relative transition-all duration-300 ${isSidebarOpen ? 'mr-72' : ''}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            setSelectedNode(node as DepartmentNodeType);
            setIsSidebarOpen(true);
          }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          fitView
        >
          <Background color="#94a3b8" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
        <button
          className="absolute bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
          onClick={addNode}
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <button
          className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white p-2 rounded-l-lg shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
        {selectedNode && (
          <div className="p-4">
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'department' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('department')}
              >
                部署情報
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('users')}
              >
                ユーザー管理
              </button>
            </div>

            {activeTab === 'department' ? (
              <div>
                <h3 className="text-lg font-medium mb-4">部署を編集</h3>
                <DepartmentSearch
                  departments={departments}
                  onSelect={handleDepartmentSelect}
                  onColorSelect={handleColorSelect}
                  onAdd={(departmentName) => {
                    console.log('App: handleAddDepartment呼び出し:', departmentName);
                    // 明示的に部署名をdepartmentsに追加
                    handleAddDepartment(departmentName);
                  }}
                  onAddNode={(departmentName) => {
                    console.log('App: onAddNode呼び出し:', departmentName);

                    // 常に新しいノードを追加する
                    // 新しいノードを追加
                    addNode();

                    // 少し遅延させて名前を更新（追加が完了した後）
                    setTimeout(() => {
                      console.log('新しいノードの名前を更新:', departmentName);
                      handleDepartmentSelect(departmentName);
                    }, 100);
                  }}
                  selectedNode={selectedNode}
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-4">ユーザー管理</h3>
                <UserAssignment
                  users={users}
                  departmentUsers={[]}
                  onAssignUser={(userId) => {
                    // ユーザーノードを作成し、部署に紐付けるロジックに変更
                    const user = users.find(u => u.id === userId);
                    if (user) {
                      // ユーザーノードの位置を部署ノードの右側に配置
                      const departmentPosition = selectedNode.position;
                      const position = {
                        x: departmentPosition.x + 200,
                        y: departmentPosition.y
                      };

                      // ユーザーノードの作成イベントを発火
                      const userNode = {
                        id: `user-${userId}-${Date.now()}`,
                        type: 'user',
                        position,
                        data: {
                          userId,
                          name: user.name,
                          position: user.position
                        },
                        sourceNodeId: selectedNode.id
                      };

                      const event = new CustomEvent('addNode', { detail: userNode });
                      window.dispatchEvent(event);
                    }
                  }}
                  onRemoveUser={() => {
                    // この機能は別の方法で実装する必要がある
                    alert('ユーザーノードを削除するには、ノードを直接選択して削除してください');
                  }}
                  onAddUser={handleAddUser}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;