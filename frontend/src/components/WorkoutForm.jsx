import { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";

const emptyForm = { title: "", load: "", reps: "" };

export default function WorkoutForm({ initialValues, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(initialValues || emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues || emptyForm);
    setErrors({});
  }, [initialValues]);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setErrors({});
    try {
      await onSubmit({
        title: values.title.trim(),
        load: values.load.trim() === "" ? "" : Number(values.load),
        reps: values.reps.trim() === "" ? "" : Number(values.reps)
      });
      setValues(emptyForm);
    } catch (error) {
      setErrors(error.fieldErrors || { form: error.message });
    }
  };

  return (
    <form className="workout-form" onSubmit={submit} noValidate>
      <label htmlFor="title">Workout name</label>
      <input
        id="title"
        name="title"
        value={values.title}
        onChange={update}
        placeholder="e.g. Bench press"
        maxLength={80}
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? "title-error" : undefined}
      />
      {errors.title && <span className="field-error" id="title-error">{errors.title}</span>}

      <div className="form-row">
        <div className="field-group">
          <label htmlFor="load">Load <span>(kg)</span></label>
          <input
            id="load"
            name="load"
            type="number"
            min="0"
            step="any"
            value={values.load}
            onChange={update}
            placeholder="0"
            aria-invalid={Boolean(errors.load)}
            aria-describedby={errors.load ? "load-error" : undefined}
          />
          {errors.load && <span className="field-error" id="load-error">{errors.load}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="reps">Reps</label>
          <input
            id="reps"
            name="reps"
            type="number"
            min="1"
            step="1"
            value={values.reps}
            onChange={update}
            placeholder="0"
            aria-invalid={Boolean(errors.reps)}
            aria-describedby={errors.reps ? "reps-error" : undefined}
          />
          {errors.reps && <span className="field-error" id="reps-error">{errors.reps}</span>}
        </div>
      </div>

      {errors.form && <p className="form-error" role="alert">{errors.form}</p>}
      <div className="form-actions">
        {initialValues && (
          <button className="button button-secondary" type="button" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
        )}
        <button className="button button-primary" type="submit" disabled={submitting}>
          {initialValues ? <Save size={16} /> : <Plus size={17} />}
          {submitting ? "Saving..." : initialValues ? "Save changes" : "Add workout"}
        </button>
      </div>
    </form>
  );
}
