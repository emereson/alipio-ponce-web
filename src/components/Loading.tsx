import { Spinner } from "@heroui/react";

// components/Skeleton.tsx
export default function Loading() {
  return (
    <div className="fixed w-screen h-screen bg-black/70 top-0 left-0 z-100 flex flex-col gap-2 items-center justify-center ">
      <Spinner color="warning" label="Cargando" labelColor="warning" />
    </div>
  );
}
