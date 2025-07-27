import { Suspense } from "react";
import DynamicTopbar from "./DynamicTopbar";
import StaticTopbar from "./StaticTopbar";

export default function Topbar() {
  return (
    <Suspense fallback={<StaticTopbar />}>
      <DynamicTopbar />
    </Suspense>
  );
}