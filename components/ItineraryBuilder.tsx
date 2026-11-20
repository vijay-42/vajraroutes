"use client";

import { useState } from "react";
import { waLink } from "@/data/site";
import Icon from "./Icon";

type Day = { title: string; notes: string };

/** Same fields as the live itinerary builder; "Save Itinerary" sends it to the team on WhatsApp. */
export default function ItineraryBuilder({ destinations }: { destinations: string[] }) {
  const [dest, setDest] = useState("");
  const [days, setDays] = useState<Day[]>([{ title: "", notes: "" }]);
  const [saved, setSaved] = useState(false);

  const setDay = (i: number, k: keyof Day, v: string) => setDays((d) => d.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const text = [
      `Custom itinerary from vajraroutes.com`,
      `Trip Name: ${f.trip}`,
      `Destination: ${f.destination === "Other (Custom)" ? f.custom : f.destination}`,
      `Duration (days): ${f.duration}`,
      f.start && `Start Date: ${f.start}`, f.end && `End Date: ${f.end}`,
      f.travellers && `Number of Travelers: ${f.travellers}`,
      f.budget && `Budget: ₹${f.budget}`,
      f.notes && `Notes: ${f.notes}`,
      ...days.filter((d) => d.title || d.notes).map((d, i) => `Day ${i + 1}: ${d.title}${d.notes ? ` — ${d.notes}` : ""}`),
    ].filter(Boolean).join("\n");
    window.open(waLink(text), "_blank", "noopener");
    setSaved(true);
  }

  return (
    <form className="builder" onSubmit={onSubmit}>
      <div className="builder__main">
        <div className="box">
          <h2 className="h3">Trip Details</h2>
          <div className="form form--flat">
            <div className="field full"><label htmlFor="b-t">Trip Name *</label><input id="b-t" name="trip" required /></div>
            <div className="field full">
              <label htmlFor="b-d">Destination *</label>
              <select id="b-d" name="destination" required value={dest} onChange={(e) => setDest(e.target.value)}>
                <option value="">Select Destination</option>
                {destinations.map((d) => <option key={d}>{d}</option>)}
                <option>Other (Custom)</option>
              </select>
            </div>
            {dest === "Other (Custom)" && (
              <div className="field full"><label htmlFor="b-c">Custom Destination Name *</label><input id="b-c" name="custom" required /></div>
            )}
            <div className="field"><label htmlFor="b-u">Duration (days) *</label><input id="b-u" name="duration" type="number" min={1} required /></div>
            <div className="field"><label htmlFor="b-n">Number of Travelers</label><input id="b-n" name="travellers" type="number" min={1} /></div>
            <div className="field"><label htmlFor="b-s">Start Date</label><input id="b-s" name="start" type="date" /></div>
            <div className="field"><label htmlFor="b-e">End Date</label><input id="b-e" name="end" type="date" /></div>
            <div className="field full"><label htmlFor="b-b">Budget (Optional) ₹</label><input id="b-b" name="budget" type="number" min={0} /></div>
            <div className="field full"><label htmlFor="b-o">Notes</label><textarea id="b-o" name="notes" /></div>
          </div>
        </div>

        <div className="box">
          <div className="shead" style={{ marginBottom: 14 }}>
            <div><h2 className="h3">Daily Itinerary</h2></div>
            <button type="button" className="btn btn--line btn--sm" onClick={() => setDays((d) => [...d, { title: "", notes: "" }])}><Icon name="plus" /> Add Day</button>
          </div>
          {days.map((d, i) => (
            <div key={i} className="dayrow">
              <span className="itin__badge">Day {i + 1}</span>
              <input aria-label={`Day ${i + 1} plan`} value={d.title} onChange={(e) => setDay(i, "title", e.target.value)} />
              <textarea aria-label={`Day ${i + 1} notes`} value={d.notes} onChange={(e) => setDay(i, "notes", e.target.value)} rows={2} />
              {days.length > 1 && (
                <button type="button" className="dayrow__x" onClick={() => setDays((x) => x.filter((_, j) => j !== i))} aria-label={`Remove day ${i + 1}`}><Icon name="close" /></button>
              )}
            </div>
          ))}
        </div>
        <button className="btn btn--black btn--lg" type="submit"><Icon name="whatsapp" /> Save Itinerary</button>
        {saved && <p className="form__ok" style={{ display: "block", marginTop: 12 }}>Itinerary Saved! Your custom itinerary has been saved successfully.</p>}
      </div>

      <aside className="box builder__how">
        <h2 className="h3">How It Works</h2>
        <ol>
          <li>Fill in your trip details</li>
          <li>Plan your daily activities</li>
          <li>Save and share your itinerary</li>
          <li>Get a quote from our experts</li>
        </ol>
      </aside>
    </form>
  );
}
