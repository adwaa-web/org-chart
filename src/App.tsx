import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { DepartmentNode } from './components/DepartmentNode';
import { DepartmentSearch } from './components/DepartmentSearch';
import { DepartmentNode as DepartmentNodeType } from './types';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import useStore from './store/useStore';

// カスタムノードタイプの定義
const nodeTypes = {
  department: DepartmentNode,
};

function App() {
  // zustandストアからの状態と関数を取得
  const {
    nodes,
    edges,
    departments,
    selectedNode,
    isSidebarOpen,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
    setIsSidebarOpen,
    handleDepartmentSelect,
    handleColorSelect,
    handleAddDepartment,
    handleAddNodeFromEvent,
    handleUpdateNodePosition,
    handleUndo,
    handleRedo,
    loadFromStorage,
    isInitialized,
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
            <h3 className="text-lg font-medium mb-4">部署を編集</h3>
            <DepartmentSearch
              departments={departments}
              onSelect={handleDepartmentSelect}
              onColorSelect={handleColorSelect}
              onAdd={handleAddDepartment}
              selectedNode={selectedNode}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;