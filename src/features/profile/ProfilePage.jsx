import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { getApiError } from "../../api/client.js";
import { saveProfile } from "../../api/profile.js";
import { useAuth } from "../../auth/AuthProvider.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";

const initialProfile = {
  sleepTime: 23,
  wakeTime: 7,
  cleanliness: 3,
  studyStyle: "silent",
  food: "veg",
  smoking: false,
  drinking: false,
  budget: 10000,
  locality: "",
  latitude: "",
  longitude: "",
  personality: "introvert",
};

export const ProfilePage = () => {
  const { refreshMe, user } = useAuth();
  const [form, setForm] = useState(initialProfile);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setForm((current) => ({ ...current, ...user.profile }));
    }
  }, [user]);

  const onChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");

    const payload = {
      ...form,
      sleepTime: Number(form.sleepTime),
      wakeTime: Number(form.wakeTime),
      cleanliness: Number(form.cleanliness),
      budget: Number(form.budget),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    };

    try {
      await saveProfile(payload);
      await refreshMe();
      setStatus("Profile saved");
    } catch (err) {
      setError(getApiError(err, "Could not save profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <h1 className="text-3xl font-bold text-ink">Living Profile</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          These preferences are converted into the backend compatibility vector and used by roommate matching.
        </p>
      </div>

      <Card className="p-5">
        {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
        {status ? <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{status}</div> : null}

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <label>
            <span className="label">Sleep time</span>
            <input className="field" name="sleepTime" type="number" min="0" max="24" value={form.sleepTime} onChange={onChange} />
          </label>
          <label>
            <span className="label">Wake time</span>
            <input className="field" name="wakeTime" type="number" min="0" max="24" value={form.wakeTime} onChange={onChange} />
          </label>
          <label>
            <span className="label">Cleanliness</span>
            <input className="field" name="cleanliness" type="number" min="1" max="5" value={form.cleanliness} onChange={onChange} />
          </label>
          <label>
            <span className="label">Monthly budget</span>
            <input className="field" name="budget" type="number" min="0" value={form.budget} onChange={onChange} />
          </label>
          <label>
            <span className="label">Study style</span>
            <select className="field" name="studyStyle" value={form.studyStyle} onChange={onChange}>
              <option value="silent">Silent</option>
              <option value="collaborative">Collaborative</option>
              <option value="flexible">Flexible</option>
            </select>
          </label>
          <label>
            <span className="label">Food</span>
            <select className="field" name="food" value={form.food} onChange={onChange}>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-veg</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label>
            <span className="label">Personality</span>
            <select className="field" name="personality" value={form.personality} onChange={onChange}>
              <option value="introvert">Introvert</option>
              <option value="extrovert">Extrovert</option>
              <option value="ambivert">Ambivert</option>
            </select>
          </label>
          <label>
            <span className="label">Locality</span>
            <input className="field" name="locality" value={form.locality} onChange={onChange} />
          </label>
          <label>
            <span className="label">Latitude</span>
            <input className="field" name="latitude" type="number" step="any" value={form.latitude} onChange={onChange} />
          </label>
          <label>
            <span className="label">Longitude</span>
            <input className="field" name="longitude" type="number" step="any" value={form.longitude} onChange={onChange} />
          </label>

          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" name="smoking" checked={Boolean(form.smoking)} onChange={onChange} />
              Smoking
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" name="drinking" checked={Boolean(form.drinking)} onChange={onChange} />
              Drinking
            </label>
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving" : "Save profile"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
