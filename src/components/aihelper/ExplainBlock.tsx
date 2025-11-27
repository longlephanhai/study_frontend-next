'use client';

import { useState, useRef } from "react";

const ExplainableBlock = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    const text = extractText(children);
    window.dispatchEvent(
      new CustomEvent("explain_sentence", { detail: text })
    );
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <span
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            background: "#1677ff",
            color: "#fff",
            padding: "2px 4px",
            fontSize: 10,
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          🤖
        </span>
      )}
    </div>
  );
};

export default ExplainableBlock;

/** Utility: Lấy text từ ReactNode */
function extractText(node: any): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (node?.props?.children) return extractText(node.props.children);
  return "";
}
