'use client';

interface Props {
  V: Record<string, number>;
}

export default function ValueFunctionRenderComponent({ V }: Props) {
  const tableStyle = "border border-gray-600 px-3 py-1";

  return (
    <section>
      <h3 className="text-xl font-semibold">📈 Value Function</h3>
      <table className="w-1/2 border-collapse border border-gray-700 text-sm">
        <thead>
          <tr className="bg-gray-800">
            <th className={tableStyle}>State</th>
            <th className={tableStyle}>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(V).map(([s, v]) => (
            <tr key={s}>
              <td className={tableStyle}>{s}</td>
              <td className={tableStyle}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
