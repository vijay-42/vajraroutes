/** Dropdowns drop the trailing "from Bangalore" to keep entries short. */
export const short = (t: string) => t.replace(/\s*from Bangalore\b/i, "").trim();

/** Package entries show just "<Place> Tour Package": durations, inclusions and taglines are dropped. */
export const pkgName = (t: string) => {
  let s = short(t).replace(/\b(complete|all[- ]inclusive)\s+/gi, "");
  const upto = s.match(/^(.*?\bpackage)\b/i);
  if (upto) s = upto[1];
  s = s.replace(/\d+\s*nights?\s*\/?\s*\d+\s*days?/gi, " ");
  const parts = s.split(/\s+[|–—-]\s+|\s+[|–—-]\s*$/).map((x) => x.trim()).filter(Boolean);
  s = parts.find((x) => /package/i.test(x)) ?? parts[0] ?? s;
  return s.replace(/\s+(with|including)\s+flights.*$/i, "").replace(/\s{2,}/g, " ").trim();
};

/** Destination cards show just the place: "Kashmir Tour package from Bangalore" → "Kashmir". */
export const destName = (t: string) =>
  short(t)
    .split(/\s+I\s+/).slice(0, 2).join(" · ")   // "Puri Jagannath I Bhubaneshwar I …" → first two stops
    .replace(/\s+(with|including)\s+flights\b/gi, "")
    .replace(/\s*\b(tour\s+)?packages?\b/gi, "")
    .replace(/\s+[-–|]\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
