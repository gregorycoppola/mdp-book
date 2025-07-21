'use client';

interface Props {
  actions: Record<string, string[]>;
}

export default function ActionsRenderComponent({ actions }: Props) {
  return (
    <section>
      <h3 className="text-xl font-semibold">🎯 Actions</h3>
      {Object.entries(actions).map(([state, acts]) => (
        <div key={state}>
          <p className="font-bold">{state}</p>
          <ul className="list-disc list-inside ml-4">
            {acts.map((a) => (
              <li key={a}>{a}</li>
            ))}
            {acts.length === 0 && <li>(none)</li>}
          </ul>
        </div>
      ))}
    </section>
  );
}
