'use client';

interface Props {
  states: string[];
}

export default function StatesRenderComponent({ states }: Props) {
  return (
    <section>
      <h3 className="text-xl font-semibold">📌 States</h3>
      <ul className="list-disc list-inside">
        {states.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  );
}
