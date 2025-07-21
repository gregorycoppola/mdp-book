'use client';

interface Props {
  transitions: Record<string, Record<string, Record<string, number>>>;
}

export default function TransitionsRenderComponent({ transitions }: Props) {
  const tableStyle = "border border-gray-600 px-3 py-1";

  return (
    <section>
      <h3 className="text-xl font-semibold">🔁 Transitions</h3>
      {Object.entries(transitions).map(([s0, actionMap]) => (
        <div key={s0} className="mb-4">
          <p className="font-bold mb-2">From: {s0}</p>
          <table className="w-full border-collapse border border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className={tableStyle}>Action</th>
                <th className={tableStyle}>Next State</th>
                <th className={tableStyle}>Probability</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(actionMap).flatMap(
                ([a, nextMap]) =>
                  Object.entries(nextMap).map(([s1, prob]) => (
                    <tr key={`${s0}-${a}-${s1}`}>
                      <td className={tableStyle}>{a}</td>
                      <td className={tableStyle}>{s1}</td>
                      <td className={tableStyle}>{prob}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
