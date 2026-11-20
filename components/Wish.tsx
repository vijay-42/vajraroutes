"use client";

import { useState } from "react";
import Icon from "./Icon";

/** Heart toggle on cards (kept in this tab only). */
export default function Wish() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={`tcard__wish ${on ? "is-on" : ""}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOn(!on); }}
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Icon name="heart" />
    </button>
  );
}
