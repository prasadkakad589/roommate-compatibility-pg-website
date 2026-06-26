import { ImagePlus, Plus } from "lucide-react";
import { useState } from "react";
import { getApiError } from "../../api/client.js";
import { addPG } from "../../api/pg.js";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";

const initialForm = {
  name: "",
  description: "",
  address: "",
  location: "",
  latitude: "",
  longitude: "",
  rent: "",
  roomtype: "double",
  sharing: 2,
  totalrooms: "",
  available: "",
  food: "both",
  amenities: "",
  rules: "",
  images: [],
};

export const AddPgForm = ({ onCreated }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files ? files : value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      rent: Number(form.rent),
      sharing: Number(form.sharing),
      totalrooms: Number(form.totalrooms),
      available: Number(form.available),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      amenities: form.amenities.split(",").map((item) => item.trim()),
      rules: form.rules.split(",").map((item) => item.trim()),
    };

    try {
      await addPG(payload);
      setForm(initialForm);
      onCreated?.();
    } catch (err) {
      setError(getApiError(err, "Could not add PG"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-mint text-moss">
          <Plus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Add PG</h2>
          <p className="text-sm text-stone-600">Create a listing with up to five images.</p>
        </div>
      </div>

      {error ? <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <label>
          <span className="label">Name</span>
          <input className="field" name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>
          <span className="label">Location</span>
          <input className="field" name="location" value={form.location} onChange={onChange} />
        </label>
        <label className="sm:col-span-2">
          <span className="label">Description</span>
          <textarea className="field min-h-24" name="description" value={form.description} onChange={onChange} required />
        </label>
        <label className="sm:col-span-2">
          <span className="label">Address</span>
          <input className="field" name="address" value={form.address} onChange={onChange} />
        </label>
        <label>
          <span className="label">Latitude</span>
          <input className="field" name="latitude" type="number" step="any" value={form.latitude} onChange={onChange} />
        </label>
        <label>
          <span className="label">Longitude</span>
          <input className="field" name="longitude" type="number" step="any" value={form.longitude} onChange={onChange} />
        </label>
        <label>
          <span className="label">Rent</span>
          <input className="field" name="rent" type="number" min="0" value={form.rent} onChange={onChange} required />
        </label>
        <label>
          <span className="label">Room type</span>
          <select className="field" name="roomtype" value={form.roomtype} onChange={onChange}>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>
        </label>
        <label>
          <span className="label">Sharing</span>
          <input className="field" name="sharing" type="number" min="1" value={form.sharing} onChange={onChange} />
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
          <span className="label">Total rooms</span>
          <input className="field" name="totalrooms" type="number" min="0" value={form.totalrooms} onChange={onChange} />
        </label>
        <label>
          <span className="label">Available rooms</span>
          <input className="field" name="available" type="number" min="0" value={form.available} onChange={onChange} />
        </label>
        <label>
          <span className="label">Amenities</span>
          <input className="field" name="amenities" value={form.amenities} onChange={onChange} placeholder="wifi, laundry" />
        </label>
        <label>
          <span className="label">Rules</span>
          <input className="field" name="rules" value={form.rules} onChange={onChange} placeholder="no smoking, quiet hours" />
        </label>
        <label className="sm:col-span-2">
          <span className="label">Images</span>
          <div className="flex items-center gap-3 rounded-md border border-dashed border-stone-300 bg-white p-4">
            <ImagePlus className="h-5 w-5 text-moss" />
            <input name="images" type="file" accept="image/png,image/jpeg" multiple onChange={onChange} />
          </div>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving}>
            <Plus className="h-4 w-4" />
            {saving ? "Adding" : "Add PG"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
