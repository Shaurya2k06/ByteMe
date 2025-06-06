import { TypewriterEffect } from "./ui/typewritter-effect";

export function TypewriterEffectDemo() {
  const words = [
    { text: "A " },
    { text: "Smarter " },
    { text: "Way " },
    { text: "to " },
    { text: "Pay, " },
    { text: "Powered " },
    { text: "by " },
    {
      text: "BlockChain.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-center justify-center w-full max-w-[700px] px-4 sm:px-0">
        <TypewriterEffect words={words} />
      </div>
    </div>
  );
}
