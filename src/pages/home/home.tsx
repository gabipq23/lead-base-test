import type { JSX } from "react";

export function HomePage(): JSX.Element {

  return (
    <div className=" min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="m-auto flex ">
        <img src="/leadbase_logo.svg" className=" w-68" />
      </div>
    </div>
  )
}
