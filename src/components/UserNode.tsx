import { Handle, Position } from 'reactflow';
import { User } from 'lucide-react';

interface UserNodeProps {
    data: {
        userId: string;
        name: string;
        position?: string;
    };
    id: string;
}

export function UserNode({ data }: UserNodeProps) {
    return (
        <div className="relative">
            <div className="px-4 py-2 shadow-md rounded-lg border-2 min-w-[120px] bg-gray-50 border-gray-200 text-gray-800">
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-3 h-3 !bg-gray-400"
                />

                <div className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div className="font-medium text-sm">{data.name}</div>
                </div>

                {data.position && (
                    <div className="text-xs text-center text-gray-500 mt-1">
                        {data.position}
                    </div>
                )}

                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-3 h-3 !bg-gray-400"
                />
            </div>
        </div>
    );
} 