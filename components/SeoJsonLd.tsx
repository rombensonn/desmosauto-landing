type SeoJsonLdProps = {
  data: unknown;
  id?: string;
};

export function SeoJsonLd({ data, id }: SeoJsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}
