import type { FaqGroup } from "@/lib/content";
import Icon from "./Icon";

export default function Faq({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="faqs">
      {groups.map((g, gi) => (
        <div key={g.title} className="faqs__group">
          <h3>{g.title}</h3>
          {g.items.map((f, i) => (
            <details key={f.q} className="acc" open={gi === 0 && i === 0}>
              <summary>{f.q} <Icon name="chevronDown" /></summary>
              <div className="acc__body rich" dangerouslySetInnerHTML={{ __html: f.a }} />
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
