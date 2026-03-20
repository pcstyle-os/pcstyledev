import { Code2, Circle } from 'lucide-react';
import { useLiveStatus } from '../../hooks/useLiveStatus';

export function LiveCodingStatus() {
  const { status, loading } = useLiveStatus(30000);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body">
        <Circle size={10} className="animate-pulse text-primary" /> Connecting…
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body">
        <Circle size={10} /> Status unavailable
      </div>
    );
  }

  if (status.isActive) {
    return (
      <div className="flex items-center gap-2 text-xs text-primary font-body font-medium">
        <Code2 size={12} className="animate-pulse" />
        <span>Coding: {status.project || status.language || 'active'}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body">
      <Circle size={10} className="text-on-surface-variant/50" /> Away from editor
    </div>
  );
}
