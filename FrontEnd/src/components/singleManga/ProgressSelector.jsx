
export default function ProgressSelector({ label, current, max, onChange }) {
    return (
      <div className="mb-4">
        <label className="text-white mb-2 block">{label} ({current}/{max})</label>
        <select 
          value={current} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="bg-gray-700 text-white rounded p-2 w-full"
        >
          {[...Array(max + 1).keys()].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
    );
  };