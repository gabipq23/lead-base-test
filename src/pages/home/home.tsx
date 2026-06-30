import type { JSX } from "react";

export function HomePage(): JSX.Element {

  return (
    <div className=" min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="m-auto flex ">
        <img src="/leadbase.png" className=" w-64" />
      </div>
    </div>
  )
}
