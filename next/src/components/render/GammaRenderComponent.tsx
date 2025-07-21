'use client';

interface Props {
  gamma: number;
}

export default function GammaRenderComponent({ gamma }: Props) {
  return (
    <section>
      <h3 className="text-xl font-semibold">⚖️ Gamma</h3>
      <p>{gamma}</p>
    </section>
  );
}
