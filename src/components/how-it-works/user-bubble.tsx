export type UserBubbleProps = { text: string };

/** The visitor's request, which arrives whole. */
export function UserBubble({ text }: UserBubbleProps) {
  return (
    <div className="how-msg-in flex justify-end">
      <span className="max-w-[78%] rounded-[16px_16px_4px_16px] bg-[#24262b] px-[13px] py-2.5 text-[13px] leading-[1.45] text-fg md:px-[15px] md:py-[11px] md:text-sm">
        {text}
      </span>
    </div>
  );
}
