interface AudioInitializerProps {
  children: React.ReactNode;
}

export default function AudioInitializer({ children }: AudioInitializerProps) {
  return (
    <div className="relative h-full w-full">
      {children}
    </div>
  );
}
