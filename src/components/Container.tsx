import React from "react";

export default function Container({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
