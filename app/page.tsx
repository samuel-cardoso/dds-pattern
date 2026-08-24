import Link from "next/link";

const DEMOS = [
  { href: "/dds/image", label: "Imagem", description: "Confirma após tempo mínimo visível na tela" },
  { href: "/dds/video", label: "Vídeo", description: "Confirma ao assistir até o fim (sem pular a barra)" },
  { href: "/dds/pdf", label: "PDF", description: "Confirma ao rolar o documento até o final" },
  { href: "/dds/text", label: "Texto", description: "Confirma ao rolar o conteúdo até o final" },
  { href: "/dds/all", label: "Tudo junto", description: "Os quatro tipos numa única declaração de ciência" },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Padrão DDS — Declaração de Ciência</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Cada página abaixo testa isoladamente uma regra de &quot;visualizado&quot; para um tipo de conteúdo.
        </p>
      </header>

      <nav className="flex flex-col gap-3">
        {DEMOS.map((demo) => (
          <Link
            key={demo.href}
            href={demo.href}
            className="flex flex-col gap-1 rounded-lg border border-neutral-200 px-4 py-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <span className="text-sm font-medium">{demo.label}</span>
            <span className="text-xs text-neutral-500">{demo.description}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
