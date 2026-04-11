import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ icon: Icon = FiInbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-surface-400" />
    </div>
    <h3 className="text-sm font-semibold text-surface-700 mb-1">{title}</h3>
    {description && <p className="text-xs text-surface-500 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
