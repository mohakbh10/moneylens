type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      {subtitle && (
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}