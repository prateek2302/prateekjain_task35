import { useState } from "react";
import { Activity, ArrowDownRight, Dumbbell, Sparkles } from "lucide-react";
import WorkoutCard from "./components/WorkoutCard.jsx";
import WorkoutForm from "./components/WorkoutForm.jsx";
import { useWorkouts } from "./context/WorkoutContext.jsx";

export default function App() {
  const { workouts, loading, error, addWorkout, editWorkout, removeWorkout, setRequestError } = useWorkouts();
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const saveWorkout = async (values) => {
    setSubmitting(true);
    setActionError("");
    setRequestError("");
    try {
      if (editing) {
        await editWorkout(editing._id, values);
        setEditing(null);
      } else {
        await addWorkout(values);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const deleteWorkout = async (id) => {
    setActionError("");
    setRequestError("");
    try {
      await removeWorkout(id);
      if (editing?._id === id) setEditing(null);
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const startEditing = (workout) => {
    setEditing({ _id: workout._id, title: workout.title, load: workout.load, reps: workout.reps });
    setActionError("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Workout Budyyy home">
          <span className="brand-mark"><Dumbbell size={19} /></span>
          <span>workout<span className="brand-accent">budyyy</span></span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> Your training, in good company</span>
      </header>

      <main className="page">
        <section className="hero">
          <div>
            <div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL TRAINING LOG</div>
            <h1>Workout <span>Budyyy</span></h1>
            <p>Show up. Put in the work. Keep getting stronger.</p>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <Activity size={23} />
            <span>ONE REP<br />AT A TIME</span>
          </div>
        </section>

        <div className="dashboard">
          <section className="workouts-section">
            <div className="section-heading">
              <div>
                <p className="section-kicker">THE WORK ADDS UP</p>
                <h2>Your workouts <span className="count-badge">{workouts.length}</span></h2>
              </div>
              <div className="scroll-cue"><ArrowDownRight size={16} /><span>KEEP IT UP</span></div>
            </div>

            {error && (
              <div className="notice notice-error" role="alert">
                {error} <button type="button" onClick={() => window.location.reload()}>Try again</button>
              </div>
            )}
            {actionError && <div className="notice notice-error" role="alert">{actionError}</div>}

            {loading ? (
              <div className="empty-state"><span className="loader" />Loading your workouts...</div>
            ) : workouts.length ? (
              <div className="workout-list">
                {workouts.map((workout) => (
                  <WorkoutCard
                    key={workout._id}
                    workout={workout}
                    onEdit={startEditing}
                    onDelete={deleteWorkout}
                  />
                ))}
              </div>
            ) : !error ? (
              <div className="empty-state">
                <div className="empty-icon"><Dumbbell size={23} /></div>
                <h3>Your first rep starts here</h3>
                <p>Add a workout and start building your training log.</p>
              </div>
            ) : null}

            {!loading && workouts.length > 0 && (
              <p className="list-footer"><span className="footer-dot" /> Showing all your logged sessions</p>
            )}
          </section>

          <aside className="form-panel">
            <div className="panel-heading">
              <span className="panel-icon"><Dumbbell size={19} /></span>
              <div>
                <p className="section-kicker">{editing ? "MAKE IT COUNT" : "READY WHEN YOU ARE"}</p>
                <h2>{editing ? "Edit workout" : "Add a New Workout"}</h2>
              </div>
            </div>
            <WorkoutForm
              key={editing?._id || "new-workout"}
              initialValues={editing}
              onSubmit={saveWorkout}
              onCancel={() => setEditing(null)}
              submitting={submitting}
            />
            <div className="panel-tip"><Sparkles size={14} /><span>Consistency beats intensity. Log every session.</span></div>
          </aside>
        </div>
        <footer className="page-footer">MADE FOR THE LONG GAME <span>·</span> KEEP SHOWING UP</footer>
      </main>
    </div>
  );
}
