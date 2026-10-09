export type UserBubbleProps = {
  text: string;
  /** How many characters of `text` are typed so far. */
  typed: number;
  caretOn: boolean;
};

/** The visitor's request, typing out at a human pace with a blinking caret. */
export function UserBubble({ text, typed, caretOn }: UserBubbleProps) {
  return (
    <div className="how-msg-in flex justify-end">
      <span className="max-w-[78%] rounded-[16px_16px_4px_16px] bg-[#24262b] px-[13px] py-2.5 text-[13px] leading-[1.45] text-fg md:px-[15px] md:py-[11px] md:text-sm">
        {text.slice(0, typed)}
        <span
          className={`ml-0.5 inline-block h-4 w-0.5 bg-amber align-[-3px] ${caretOn ? "opacity-100" : "opacity-0"}`}
        />
      </span>
    </div>
  );
}
