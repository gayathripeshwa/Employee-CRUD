// Coloured pill for an employee's status: Active (green), On leave (amber), Exited (grey).
function StatusBadge({ status }) {
    const value = status || 'Active'; // employees added before "status" existed
    const className = 'badge badge-' + value.toLowerCase().replace(' ', '-');
    return <span className={className}>{value}</span>;
}

export default StatusBadge;
