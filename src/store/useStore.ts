import { create } from 'zustand';
import {
    Connection,
    Edge,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange
} from 'reactflow';
import { DepartmentNode, StorageData } from '../types';

// 初期データ
const initialDepartments = [
    '代表取締役社長',
    '本社',
    '工場部門',
    '総務部',
    '営業部',
    '販売部',
    '品質管理部',
    '技術部',
    '製造部',
];

const initialNodes: DepartmentNode[] = [
    {
        id: 'president',
        type: 'department',
        position: { x: 0, y: 150 },
        data: { label: '代表取締役社長', color: 'blue' },
    },
    {
        id: 'hq',
        type: 'department',
        position: { x: 200, y: 50 },
        data: { label: '本社', color: 'amber' },
    },
    {
        id: 'factory',
        type: 'department',
        position: { x: 200, y: 250 },
        data: { label: '工場部門', color: 'emerald' },
    },
    {
        id: 'admin',
        type: 'department',
        position: { x: 400, y: 0 },
        data: { label: '総務部', color: 'orange' },
    },
    {
        id: 'sales',
        type: 'department',
        position: { x: 400, y: 50 },
        data: { label: '営業部', color: 'orange' },
    },
    {
        id: 'retail',
        type: 'department',
        position: { x: 400, y: 100 },
        data: { label: '販売部', color: 'orange' },
    },
    {
        id: 'quality',
        type: 'department',
        position: { x: 400, y: 200 },
        data: { label: '品質管理部', color: 'green' },
    },
    {
        id: 'tech',
        type: 'department',
        position: { x: 400, y: 250 },
        data: { label: '技術部', color: 'green' },
    },
    {
        id: 'manufacturing',
        type: 'department',
        position: { x: 400, y: 300 },
        data: { label: '製造部', color: 'green' },
    },
];

const initialEdges: Edge[] = [
    {
        id: 'e1',
        source: 'president',
        target: 'hq',
        type: 'step',
        style: { stroke: '#cbd5e1', strokeWidth: 2 }
    },
    {
        id: 'e2',
        source: 'president',
        target: 'factory',
        type: 'step',
        style: { stroke: '#cbd5e1', strokeWidth: 2 }
    },
    {
        id: 'e3',
        source: 'hq',
        target: 'admin',
        type: 'step',
        style: { stroke: '#cbd5e1', strokeWidth: 2 }
    },
    {
        id: 'e4',
        source: 'hq',
        target: 'sales',
        type: 'step',
        style: { stroke: '#cbd5e1', strokeWidth: 2 }
    },
    {
        id: 'e5',
        source: 'hq',
        target: 'retail',
        type: 'step',
        style: { stroke: '#cbd5e1', strokeWidth: 2 }
    },
    {
        id: 'e6',
        source: 'factory',
        target: 'quality',
        type: 'step',
        style: { stroke: '#cbd5e1', strokeWidth: 2 }
    },
    {
        id: 'e7',
        source: 'factory',
        target: 'tech',
        type: 'step',
        style: { stroke: '#cbd5e1', strokeWidth: 2 }
    },
    {
        id: 'e8',
        source: 'factory',
        target: 'manufacturing',
        type: 'step',
        style: { stroke: '#cbd5e1', strokeWidth: 2 }
    },
];

// 履歴用の型定義
interface HistoryState {
    nodes: DepartmentNode[];
    edges: Edge[];
    departments: string[];
}

// ストア状態の型定義
interface OrgChartState {
    // ノードとエッジの状態
    nodes: DepartmentNode[];
    edges: Edge[];
    departments: string[];

    // 選択関連
    selectedNode: DepartmentNode | null;
    isSidebarOpen: boolean;

    // 履歴関連
    history: HistoryState[];
    currentIndex: number;
    isDragging: boolean;
    isHistoryAction: boolean;

    // 初期化状態
    isInitialized: boolean;

    // アクション
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (connection: Connection) => void;
    addNode: () => void;
    setSelectedNode: (node: DepartmentNode | null) => void;
    setIsSidebarOpen: (open: boolean) => void;
    handleDepartmentSelect: (department: string) => void;
    handleColorSelect: (color: string) => void;
    handleAddDepartment: (department: string) => void;
    handleAddNodeFromEvent: (newNode: DepartmentNode) => void;
    handleUpdateNodePosition: (id: string, position: { x: number, y: number }) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    loadFromStorage: () => void;
    saveToStorage: () => void;
}

// ローカルストレージからデータをロード
const loadFromStorage = (): StorageData | null => {
    const savedData = localStorage.getItem('orgChart');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return null;
};

// 状態をストレージに保存
const saveToStorage = (data: StorageData) => {
    localStorage.setItem('orgChart', JSON.stringify(data));
};

// Zustandストアの作成
const useStore = create<OrgChartState>((set, get) => ({
    // 初期状態
    nodes: initialNodes,
    edges: initialEdges,
    departments: initialDepartments,
    selectedNode: null,
    isSidebarOpen: true,
    history: [],
    currentIndex: -1,
    isDragging: false,
    isHistoryAction: false,
    isInitialized: false,

    // ノード変更時のハンドラ
    onNodesChange: (changes) => {
        const isDragStart = changes.some((change: NodeChange) => 'type' in change && change.type === 'position' && change.dragging === true);
        const isDragEnd = changes.some((change: NodeChange) => 'type' in change && change.type === 'position' && change.dragging === false);

        if (isDragStart) {
            set({ isDragging: true });
        }

        // ノードに変更を適用
        set(state => ({
            nodes: applyNodeChanges(changes, state.nodes) as DepartmentNode[],
        }));

        if (isDragEnd) {
            set(state => {
                // ドラッグ終了時に履歴に追加
                const { nodes, edges, departments } = state;
                const currentState = { nodes, edges, departments };

                // 履歴に追加
                if (state.isInitialized && !state.isHistoryAction) {
                    const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];
                    return {
                        isDragging: false,
                        history: newHistory,
                        currentIndex: state.currentIndex + 1,
                    };
                }

                return { isDragging: false, isHistoryAction: false };
            });

            // 状態をストレージに保存
            const { nodes, edges, departments } = get();
            saveToStorage({ nodes, edges, departments });
        }
    },

    // エッジ変更時のハンドラ
    onEdgesChange: (changes) => {
        set(state => {
            const newEdges = applyEdgeChanges(changes, state.edges);

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: state.nodes, edges: newEdges, departments: state.departments };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: state.nodes, edges: newEdges, departments: state.departments });

                return {
                    edges: newEdges,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                edges: newEdges,
                isHistoryAction: false
            };
        });
    },

    // 接続時のハンドラ
    onConnect: (connection) => {
        set(state => {
            const newEdge = {
                ...connection,
                type: 'step',
                style: { stroke: '#cbd5e1', strokeWidth: 2 }
            };

            const newEdges = addEdge(newEdge, state.edges);

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: state.nodes, edges: newEdges, departments: state.departments };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: state.nodes, edges: newEdges, departments: state.departments });

                return {
                    edges: newEdges,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                edges: newEdges,
                isHistoryAction: false
            };
        });
    },

    // 新しいノードを追加
    addNode: () => {
        set(state => {
            const newNode: DepartmentNode = {
                id: `node-${Date.now()}`,
                type: 'department',
                position: { x: Math.random() * 500, y: Math.random() * 300 },
                data: { label: '新規部署', color: 'gray' },
            };

            const newNodes = [...state.nodes, newNode];

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: state.edges, departments: state.departments };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: state.edges, departments: state.departments });

                return {
                    nodes: newNodes,
                    selectedNode: newNode,
                    isSidebarOpen: true,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                nodes: newNodes,
                selectedNode: newNode,
                isSidebarOpen: true,
                isHistoryAction: false
            };
        });
    },

    // 選択ノードの設定
    setSelectedNode: (node) => {
        set({ selectedNode: node });
    },

    // サイドバー開閉状態の設定
    setIsSidebarOpen: (open) => {
        set({ isSidebarOpen: open });
    },

    // 部署選択のハンドラ
    handleDepartmentSelect: (department) => {
        set(state => {
            if (!state.selectedNode) return state;

            const newNodes = state.nodes.map(node =>
                node.id === state.selectedNode?.id
                    ? { ...node, data: { ...node.data, label: department } }
                    : node
            );

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: state.edges, departments: state.departments };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: state.edges, departments: state.departments });

                return {
                    nodes: newNodes,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                nodes: newNodes,
                isHistoryAction: false
            };
        });
    },

    // 色選択のハンドラ
    handleColorSelect: (color) => {
        set(state => {
            if (!state.selectedNode) return state;

            const newNodes = state.nodes.map(node =>
                node.id === state.selectedNode?.id
                    ? { ...node, data: { ...node.data, color } }
                    : node
            );

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: state.edges, departments: state.departments };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: state.edges, departments: state.departments });

                return {
                    nodes: newNodes,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                nodes: newNodes,
                isHistoryAction: false
            };
        });
    },

    // 部署追加のハンドラ
    handleAddDepartment: (department) => {
        set(state => {
            if (state.departments.includes(department)) return state;

            const newDepartments = [...state.departments, department];

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: state.nodes, edges: state.edges, departments: newDepartments };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: state.nodes, edges: state.edges, departments: newDepartments });

                return {
                    departments: newDepartments,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                departments: newDepartments,
                isHistoryAction: false
            };
        });
    },

    // イベントからのノード追加ハンドラ
    handleAddNodeFromEvent: (newNode) => {
        set(state => {
            const newNodes = [...state.nodes, newNode];

            // sourceNodeIdが存在する場合のみエッジを作成
            let newEdges = [...state.edges];

            if (newNode.sourceNodeId) {
                const newEdge: Edge = {
                    id: `e-${Date.now()}`,
                    source: newNode.sourceNodeId,
                    target: newNode.id,
                    type: 'step',
                    style: { stroke: '#cbd5e1', strokeWidth: 2 }
                };

                newEdges = [...state.edges, newEdge];
            }

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: newEdges, departments: state.departments };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: newEdges, departments: state.departments });

                return {
                    nodes: newNodes,
                    edges: newEdges,
                    selectedNode: newNode,
                    isSidebarOpen: true,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                nodes: newNodes,
                edges: newEdges,
                selectedNode: newNode,
                isSidebarOpen: true,
                isHistoryAction: false
            };
        });
    },

    // ノード位置更新ハンドラ
    handleUpdateNodePosition: (id, position) => {
        set(state => {
            const newNodes = state.nodes.map(node =>
                node.id === id ? { ...node, position } : node
            );

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: state.edges, departments: state.departments };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: state.edges, departments: state.departments });

                return {
                    nodes: newNodes,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                nodes: newNodes,
                isHistoryAction: false
            };
        });
    },

    // 元に戻すハンドラ
    handleUndo: () => {
        const state = get();
        if (state.currentIndex > 0) {
            set(state => {
                const prevState = state.history[state.currentIndex - 1];
                return {
                    nodes: prevState.nodes,
                    edges: prevState.edges,
                    departments: prevState.departments,
                    currentIndex: state.currentIndex - 1,
                    isHistoryAction: true
                };
            });
        }
    },

    // やり直しハンドラ
    handleRedo: () => {
        const state = get();
        if (state.currentIndex < state.history.length - 1) {
            set(state => {
                const nextState = state.history[state.currentIndex + 1];
                return {
                    nodes: nextState.nodes,
                    edges: nextState.edges,
                    departments: nextState.departments,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: true
                };
            });
        }
    },

    // ストレージからデータをロード
    loadFromStorage: () => {
        const savedData = loadFromStorage();
        if (savedData) {
            set(() => {
                const history = [{
                    nodes: savedData.nodes,
                    edges: savedData.edges,
                    departments: savedData.departments
                }];

                return {
                    nodes: savedData.nodes,
                    edges: savedData.edges,
                    departments: savedData.departments,
                    history,
                    currentIndex: 0,
                    isInitialized: true
                };
            });
        } else {
            set(() => {
                const history = [{
                    nodes: initialNodes,
                    edges: initialEdges,
                    departments: initialDepartments
                }];

                return {
                    history,
                    currentIndex: 0,
                    isInitialized: true
                };
            });
        }
    },

    // 状態をストレージに保存
    saveToStorage: () => {
        const { nodes, edges, departments } = get();
        saveToStorage({ nodes, edges, departments });
    }
}));

export default useStore;