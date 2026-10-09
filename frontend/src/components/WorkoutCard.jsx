import { Dumbbell, Pencil, Trash2 } from "lucide-react";

export default function WorkoutCard({ workout, onEdit, onDelete }) {
  return (
    <article className="workout-card">
      <div className="workout-icon"><Dumbbell size={20} strokeWidth={1.8} /></div>
      <div className="workout-content">
        <div className="workout-title-line">
          <h3>{workout.title}</h3>
          <div className="card-actions">
            <button className="icon-button" type="button" onClick={() => onEdit(workout)} aria-label={`Edit ${workout.title}`}>
              <Pencil size={16} />
            </button>
            <button className="icon-button delete-button" type="button" onClick={() => onDelete(workout._id)} aria-label={`Delete ${workout.title}`}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="workout-stats">
          <span><strong>{workout.load}</strong> kg</span>
          <i />
          <span><strong>{workout.reps}</strong> reps</span>
        </div>
      </div>
    </article>
  );
}
