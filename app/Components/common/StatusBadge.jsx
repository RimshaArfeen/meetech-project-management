

// Status Badge Component
export const StatusBadge = ({ status }) => {
     const styles = {
          'Completed': 'bg-emerald-100 text-emerald-700',
          'In Progress': 'bg-blue-100 text-blue-700',
          'Blocked': 'bg-red-100 text-red-700',
          'Not Started': 'bg-slate-100 text-slate-700',
          'Review': 'bg-amber-100 text-amber-700'
     };

     return (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap ${styles[status] || styles['Not Started']}`}>
               {status}
          </span>
     );
};