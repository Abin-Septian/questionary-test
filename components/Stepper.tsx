import React from "react";

type TStepper = {
  length: number;
  activeIndex: number;
};

const Stepper = ({ length, activeIndex }: TStepper) => {
  const steps = Array.from({ length }, (_, index) => index);

  return (
    <div className="flex items-center justify-between gap-1 py-4 md:gap-4">
      {steps.map((step) => (
        <div
          key={step}
          className={`flex h-1 w-full items-center justify-center rounded-full ${
            step === activeIndex
              ? "bg-purple-400"
              : step < activeIndex
                ? "bg-purple-800"
                : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default Stepper;
