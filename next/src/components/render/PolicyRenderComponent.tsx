'use client';

interface Props {
  policy: Record<string, string | null>;
}

export default function PolicyRenderComponent({ policy }: Props) {
  const tableStyle = "border border-gray-600 px-3 py-1";

  return (
    <section>
      <h3 className="text-xl font-semibold">🧭 Policy</h3>
      <table className="w-1/2 border-collapse border border-gray-700 text-sm">
        <thead>
          <tr className="bg-gray-800">
            <th className={tableStyle}>State</th>
            <th className={tableStyle}>Best Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(policy).map(([s, a]) => (
            <tr key={s}>
              <td className={tableStyle}>{s}</td>
              <td className={tableStyle}>{a || '(none)'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
