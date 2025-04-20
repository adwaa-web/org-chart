import { create } from 'zustand';
import {
    Connection,
    Edge,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange
} from 'reactflow';
import { DepartmentNode, UserNode, OrgChartNode, StorageData, User } from '../types';

// エッジスタイルの型定義
interface EdgeStyle {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
}

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

// 初期ユーザーデータ
const initialUsers: User[] = [
    { id: 'user1', name: '山田太郎', position: '社長' },
    { id: 'user2', name: '鈴木一郎', position: '本社長' },
    { id: 'user3', name: '佐藤健太', position: '工場長' },
    { id: 'user4', name: '田中優子', position: '総務部長' },
    { id: 'user5', name: '高橋誠', position: '総務部員' },
    { id: 'user6', name: '渡辺直樹', position: '営業部長' },
    { id: 'user7', name: '伊藤美咲', position: '営業部員' },
    { id: 'user8', name: '小林大輔', position: '販売部長' },
    { id: 'user9', name: '加藤裕太', position: '品質管理部長' },
    { id: 'user10', name: '吉田花子', position: '技術部長' },
    { id: 'user11', name: '山本和也', position: '技術部員' },
    { id: 'user12', name: '中村祐介', position: '製造部長' },
    { id: 'user13', name: '斎藤真由美', position: '製造部員' },
];

// 部署ノードの初期データ
const initialDepartmentNodes: DepartmentNode[] = [
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

// ユーザーノードの初期データ
const initialUserNodes: UserNode[] = [
    {
        id: 'usernode-1',
        type: 'user',
        position: { x: 100, y: 150 },
        data: { userId: 'user1', name: '山田太郎', position: '社長' },
        sourceNodeId: 'president'
    },
    {
        id: 'usernode-2',
        type: 'user',
        position: { x: 300, y: 50 },
        data: { userId: 'user2', name: '鈴木一郎', position: '本社長' },
        sourceNodeId: 'hq'
    },
    {
        id: 'usernode-3',
        type: 'user',
        position: { x: 300, y: 250 },
        data: { userId: 'user3', name: '佐藤健太', position: '工場長' },
        sourceNodeId: 'factory'
    }
];

// 部署間のエッジ初期データ
const initialDepartmentEdges: Edge[] = [
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

// ユーザーと部署を結ぶエッジの初期データ
const initialUserEdges: Edge[] = [
    {
        id: 'u1',
        source: 'president',
        target: 'usernode-1',
        type: 'step',
        style: { stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5,5' }
    },
    {
        id: 'u2',
        source: 'hq',
        target: 'usernode-2',
        type: 'step',
        style: { stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5,5' }
    },
    {
        id: 'u3',
        source: 'factory',
        target: 'usernode-3',
        type: 'step',
        style: { stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5,5' }
    }
];

// 全ノードとエッジの初期データ
const initialNodes: OrgChartNode[] = [...initialDepartmentNodes, ...initialUserNodes];
const initialEdges: Edge[] = [...initialDepartmentEdges, ...initialUserEdges];

// 履歴用の型定義
interface HistoryState {
    nodes: OrgChartNode[];
    edges: Edge[];
    departments: string[];
    users: User[];
}

// ストア状態の型定義
interface OrgChartState {
    // ノードとエッジの状態
    nodes: OrgChartNode[];
    edges: Edge[];
    departments: string[];
    users: User[];

    // 選択関連
    selectedNode: DepartmentNode | null;
    isSidebarOpen: boolean;
    activeTab: 'department' | 'users';

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
    setActiveTab: (tab: 'department' | 'users') => void;
    handleDepartmentSelect: (department: string) => void;
    handleColorSelect: (color: string) => void;
    handleAddDepartment: (department: string) => void;
    handleAddNodeFromEvent: (newNode: OrgChartNode) => void;
    handleUpdateNodePosition: (id: string, position: { x: number, y: number }) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    loadFromStorage: () => void;
    saveToStorage: () => void;

    // ユーザー関連のアクション
    handleAddUser: (user: User) => void;
}

// ローカルストレージからデータをロード
const loadFromStorage = (): StorageData | null => {
    const savedData = localStorage.getItem('orgChart');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        // 古いフォーマットのデータのusersフィールドがない場合は追加する
        if (!parsed.users) {
            parsed.users = initialUsers;
        }
        return parsed;
    }
    return null;
};

// 状態をストレージに保存
const saveToStorage = (data: StorageData) => {
    localStorage.setItem('orgChart', JSON.stringify(data));
};

// Zustandストアの作成
const useStore = create<OrgChartState>((set, get) => ({
    // ノードとエッジの初期化
    nodes: initialNodes,
    edges: initialEdges,
    departments: initialDepartments,
    users: initialUsers,
    selectedNode: null,
    isSidebarOpen: true,
    activeTab: 'department',
    history: [],
    currentIndex: -1,
    isDragging: false,
    isHistoryAction: false,
    isInitialized: false,

    // ノード変更時のハンドラ
    onNodesChange: (changes: NodeChange[]) => {
        const isDragStart = changes.some((change: NodeChange) => 'type' in change && change.type === 'position' && change.dragging === true);
        const isDragEnd = changes.some((change: NodeChange) => 'type' in change && change.type === 'position' && change.dragging === false);

        if (isDragStart) {
            set({ isDragging: true });
        }

        // ノードに変更を適用
        set(state => ({
            nodes: applyNodeChanges(changes, state.nodes.map(node => ({ ...node }))) as unknown as OrgChartNode[],
        }));

        if (isDragEnd) {
            set(state => {
                // ドラッグ終了時に履歴に追加
                const historyEntry: HistoryState = {
                    nodes: [...state.nodes],
                    edges: [...state.edges],
                    departments: [...state.departments],
                    users: [...state.users]
                };

                // 履歴に追加
                if (state.isInitialized && !state.isHistoryAction) {
                    const newHistory = [...state.history.slice(0, state.currentIndex + 1), historyEntry];

                    // 状態をストレージに保存
                    saveToStorage({
                        nodes: state.nodes,
                        edges: state.edges,
                        departments: state.departments,
                        users: state.users
                    });

                    return {
                        isDragging: false,
                        history: newHistory,
                        currentIndex: state.currentIndex + 1,
                    };
                }

                return { isDragging: false, isHistoryAction: false };
            });
        }
    },

    // エッジ変更時のハンドラ
    onEdgesChange: (changes: EdgeChange[]) => {
        set(state => {
            const newEdges = applyEdgeChanges(changes, state.edges);

            if (!state.isHistoryAction) {
                // 履歴アクションでない場合のみ、履歴を更新しローカルストレージに保存
                const historyEntry: HistoryState = {
                    nodes: [...state.nodes],
                    edges: [...newEdges],
                    departments: [...state.departments],
                    users: [...state.users],
                };

                const newHistory = state.history.slice(0, state.currentIndex + 1);
                newHistory.push(historyEntry);

                saveToStorage({
                    nodes: state.nodes,
                    edges: newEdges,
                    departments: state.departments,
                    users: state.users,
                });

                return {
                    edges: newEdges,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false,
                };
            }

            return { edges: newEdges, isHistoryAction: false };
        });
    },

    // 接続時のハンドラ
    onConnect: (connection: Connection) => {
        set(state => {
            // エッジタイプを決定 - ユーザーノードが含まれている場合は点線
            const sourceNode = state.nodes.find(node => node.id === connection.source);
            const targetNode = state.nodes.find(node => node.id === connection.target);

            let edgeStyle: EdgeStyle = { stroke: '#cbd5e1', strokeWidth: 2 };

            if (sourceNode?.type === 'user' || targetNode?.type === 'user') {
                edgeStyle = { stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5,5' };
            }

            const newEdges = addEdge({
                ...connection,
                type: 'step',
                style: edgeStyle,
            }, state.edges);

            // 履歴を更新し、ローカルストレージに保存
            const historyEntry: HistoryState = {
                nodes: [...state.nodes],
                edges: [...newEdges],
                departments: [...state.departments],
                users: [...state.users],
            };

            const newHistory = state.history.slice(0, state.currentIndex + 1);
            newHistory.push(historyEntry);

            saveToStorage({
                nodes: state.nodes,
                edges: newEdges,
                departments: state.departments,
                users: state.users,
            });

            return {
                edges: newEdges,
                history: newHistory,
                currentIndex: state.currentIndex + 1,
                isHistoryAction: false,
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
                const currentState = { nodes: newNodes, edges: state.edges, departments: state.departments, users: state.users };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: state.edges, departments: state.departments, users: state.users });

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
    setSelectedNode: (node: DepartmentNode | null) => {
        set({ selectedNode: node });
    },

    // サイドバー開閉状態の設定
    setIsSidebarOpen: (open: boolean) => {
        set({ isSidebarOpen: open });
    },

    // アクティブタブの設定
    setActiveTab: (tab: 'department' | 'users') => {
        set({ activeTab: tab });
    },

    // 部署選択のハンドラ
    handleDepartmentSelect: (department: string) => {
        set(state => {
            if (!state.selectedNode) return state;

            const newNodes = state.nodes.map(node => {
                if (node.id === state.selectedNode?.id && node.type === 'department') {
                    return { ...node, data: { ...node.data, label: department } };
                }
                return node;
            }) as OrgChartNode[];

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: state.edges, departments: state.departments, users: state.users };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: state.edges, departments: state.departments, users: state.users });

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
    handleColorSelect: (color: string) => {
        set(state => {
            if (!state.selectedNode) return state;

            const newNodes = state.nodes.map(node => {
                if (node.id === state.selectedNode?.id && node.type === 'department') {
                    return { ...node, data: { ...node.data, color } };
                }
                return node;
            }) as OrgChartNode[];

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: state.edges, departments: state.departments, users: state.users };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: state.edges, departments: state.departments, users: state.users });

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

    // 部署追加ハンドラ
    handleAddDepartment: (department: string) => {
        set(state => {
            const newDepartments = [...state.departments, department];

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: state.nodes, edges: state.edges, departments: newDepartments, users: state.users };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: state.nodes, edges: state.edges, departments: newDepartments, users: state.users });

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
    handleAddNodeFromEvent: (newNode: OrgChartNode) => {
        set(state => {
            const newNodes = [...state.nodes, newNode];

            // sourceNodeIdが存在する場合のみエッジを作成
            let newEdges = [...state.edges];

            if (newNode.sourceNodeId) {
                const edgeStyle = newNode.type === 'user'
                    ? { stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5,5' }
                    : { stroke: '#cbd5e1', strokeWidth: 2 };

                const newEdge: Edge = {
                    id: `e-${Date.now()}`,
                    source: newNode.sourceNodeId,
                    target: newNode.id,
                    type: 'step',
                    style: edgeStyle
                };

                newEdges = [...state.edges, newEdge];
            }

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: newEdges, departments: state.departments, users: state.users };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: newEdges, departments: state.departments, users: state.users });

                return {
                    nodes: newNodes,
                    edges: newEdges,
                    selectedNode: newNode.type === 'department' ? newNode as DepartmentNode : state.selectedNode,
                    isSidebarOpen: true,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                nodes: newNodes,
                edges: newEdges,
                selectedNode: newNode.type === 'department' ? newNode as DepartmentNode : state.selectedNode,
                isSidebarOpen: true,
                isHistoryAction: false
            };
        });
    },

    // ノード位置更新ハンドラ
    handleUpdateNodePosition: (id: string, position: { x: number, y: number }) => {
        set(state => {
            const newNodes = state.nodes.map(node =>
                node.id === id ? { ...node, position } : node
            ) as OrgChartNode[];

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: newNodes, edges: state.edges, departments: state.departments, users: state.users };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: newNodes, edges: state.edges, departments: state.departments, users: state.users });

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
                    users: prevState.users,
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
                    users: nextState.users,
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
                    departments: savedData.departments,
                    users: savedData.users,
                }];

                return {
                    nodes: savedData.nodes,
                    edges: savedData.edges,
                    departments: savedData.departments,
                    users: savedData.users,
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
                    departments: initialDepartments,
                    users: initialUsers,
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
        const state = get();
        saveToStorage({
            nodes: state.nodes,
            edges: state.edges,
            departments: state.departments,
            users: state.users,
        });
    },

    // ユーザー追加ハンドラ
    handleAddUser: (user: User) => {
        set(state => {
            const newUsers = [...state.users, user];

            // 履歴アクションでなければ履歴に追加
            if (state.isInitialized && !state.isDragging && !state.isHistoryAction) {
                const currentState = { nodes: state.nodes, edges: state.edges, departments: state.departments, users: newUsers };
                const newHistory = [...state.history.slice(0, state.currentIndex + 1), currentState];

                // 状態をストレージに保存
                saveToStorage({ nodes: state.nodes, edges: state.edges, departments: state.departments, users: newUsers });

                return {
                    users: newUsers,
                    history: newHistory,
                    currentIndex: state.currentIndex + 1,
                    isHistoryAction: false
                };
            }

            return {
                users: newUsers,
                isHistoryAction: false
            };
        });
    }
}));

export default useStore;
