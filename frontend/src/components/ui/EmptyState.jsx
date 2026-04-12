import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ icon: Icon = FiInbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-3xl bg-surface-50 border border-surface-200/60 flex items-center justify-center mb-5 shadow-inner-soft">
      <Icon className="w-7 h-7 text-surface-400" />
    </div>
    <h3 className="text-base font-semibold text-surface-700 mb-1.5">{title}</h3>
    {description && <p className="text-sm text-surface-400 max-w-xs leading-relaxed">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
