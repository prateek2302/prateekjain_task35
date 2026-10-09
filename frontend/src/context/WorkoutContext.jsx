import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

const WorkoutContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "";
const API_URL = API_BASE_URL ? `${API_BASE_URL}/workouts` : "";

const initialState = { workouts: [], loading: true, error: "" };

function workoutReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: "" };
    case "LOAD_SUCCESS":
      return { ...state, loading: false, workouts: action.payload, error: "" };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "CREATE":
      return { ...state, workouts: [action.payload, ...state.workouts], error: "" };
    case "UPDATE":
      return {
        ...state,
        workouts: state.workouts.map((workout) =>
          workout._id === action.payload._id ? action.payload : workout
        ),
        error: ""
      };
    case "DELETE":
      return {
        ...state,
        workouts: state.workouts.filter((workout) => workout._id !== action.payload),
        error: ""
      };
    case "REQUEST_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

async function request(url, options) {
  if (!url) {
    throw new Error("Workout API isn't configured yet. Deploy the backend and set the VITE_API_URL repository variable.");
  }
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "The request could not be completed.");
    error.fieldErrors = data.errors || {};
    throw error;
  }
  return data;
}

export function WorkoutContextProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const fetchWorkouts = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const workouts = await request(API_URL);
      dispatch({ type: "LOAD_SUCCESS", payload: workouts });
    } catch (error) {
      dispatch({ type: "LOAD_ERROR", payload: error.message });
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const addWorkout = async (workout) => {
    const created = await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout)
    });
    dispatch({ type: "CREATE", payload: created });
    return created;
  };

  const editWorkout = async (id, workout) => {
    const updated = await request(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout)
    });
    dispatch({ type: "UPDATE", payload: updated });
    return updated;
  };

  const removeWorkout = async (id) => {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    dispatch({ type: "DELETE", payload: id });
  };

  const setRequestError = (message) => dispatch({ type: "REQUEST_ERROR", payload: message });

  return (
    <WorkoutContext.Provider
      value={{ ...state, addWorkout, editWorkout, removeWorkout, setRequestError }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error("useWorkouts must be used inside WorkoutContextProvider.");
  return context;
}
