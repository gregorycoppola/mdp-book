'use client';

interface Props {
  rewards: Record<string, Record<string, Record<string, number>>>;
}

export default function RewardsRenderComponent({ rewards }: Props) {
  const tableStyle = "border border-gray-600 px-3 py-1";

  return (
    <section>
      <h3 className="text-xl font-semibold">💰 Rewards</h3>
      {Object.entries(rewards).map(([s0, aMap]) => (
        <div key={s0} className="mb-4">
          <p className="font-bold mb-2">From: {s0}</p>
          <table className="w-full border-collapse border border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className={tableStyle}>Action</th>
                <th className={tableStyle}>Next State</th>
                <th className={tableStyle}>Reward</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(aMap).flatMap(
                ([a, s1Map]) =>
                  Object.entries(s1Map).map(([s1, r]) => (
                    <tr key={`${s0}-${a}-${s1}`}>
                      <td className={tableStyle}>{a}</td>
                      <td className={tableStyle}>{s1}</td>
                      <td className={tableStyle}>{r}</td>
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
