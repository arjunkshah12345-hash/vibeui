"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type DiceHandle = {
  // Roll now. Pass a face to make it land on that number.
  roll: (face?: number) => void;
};

// Where each face sits on the cube, and how much of the light it loses.
const FACES = [
  { value: 1, place: "rotateX(90deg)", dim: 0 }, // top
  { value: 6, place: "rotateX(-90deg)", dim: 0.22 }, // bottom
  { value: 2, place: "rotateY(0deg)", dim: 0.07 }, // front
  { value: 5, place: "rotateY(180deg)", dim: 0.2 }, // back
  { value: 3, place: "rotateY(90deg)", dim: 0.15 }, // right
  { value: 4, place: "rotateY(-90deg)", dim: 0.15 }, // left
] as const;

// The cube's turn that brings each number to the top, as angles about X, Y and Z.
const UP: Record<number, [number, number, number]> = {
  1: [0, 0, 0],
  2: [90, 0, 0],
  3: [0, 0, -90],
  4: [0, 0, 90],
  5: [-90, 0, 0],
  6: [180, 0, 0],
};

// Which of the nine places on a face carry a pip.
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const turn = ([x, y, z]: [number, number, number]) =>
  `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;

/**
 * A six-sided die in real 3D. Click it and it tumbles, bounces, and settles on a number.
 *
 * It lands on a random face, or on the one you ask for. Press Space or Enter to roll from the keyboard.
 */
export function Dice({
  ref,
  size = 72,
  defaultValue = 1,
  onRoll,
  disabled,
  className,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  ref?: React.Ref<DiceHandle>;
  /** Edge length of the cube, in px. */
  size?: number;
  /** The face showing before the first roll, 1 to 6. */
  defaultValue?: number;
  /** Called with the number it landed on, once it has settled. */
  onRoll?: (value: number) => void;
}) {
  const cube = React.useRef<HTMLSpanElement>(null);
  const hop = React.useRef<HTMLSpanElement>(null);
  const shadow = React.useRef<HTMLSpanElement>(null);
  const [value, setValue] = React.useState(Math.min(6, Math.max(1, Math.round(defaultValue))));
  const [rolling, setRolling] = React.useState(false);
  const busy = React.useRef(false);

  const roll = React.useCallback(
    (face?: number) => {
      const c = cube.current;
      const h = hop.current;
      const s = shadow.current;
      if (!c || !h || !s || busy.current || disabled) return;
      const next =
        face && face >= 1 && face <= 6 ? Math.round(face) : 1 + Math.floor(Math.random() * 6);
      const from = c.dataset.at
        ? (JSON.parse(c.dataset.at) as [number, number, number])
        : UP[value];
      const to = UP[next];
      // Extra whole turns on every axis: it ends looking identical to the plain pose, but tumbles on the way.
      const spin = (i: number) =>
        to[i] + (Math.random() < 0.5 ? -1 : 1) * 360 * (1 + Math.floor(Math.random() * 2));
      const end: [number, number, number] = [spin(0), spin(1), spin(2)];
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        c.style.transform = turn(to);
        c.dataset.at = JSON.stringify(to);
        busy.current = false;
        setRolling(false);
        setValue(next);
        onRoll?.(next);
      };
      busy.current = true;
      setRolling(true);
      if (calm) {
        finish();
        return;
      }

      const T = 1350;
      const lift = size * 0.95;
      const tumble = c.animate([{ transform: turn(from) }, { transform: turn(end) }], {
        duration: T,
        easing: "cubic-bezier(0.15, 0.65, 0.25, 1)",
        fill: "forwards",
      });
      // Three bounces, each lower than the last.
      h.animate(
        [
          { transform: "translateY(0)", easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
          {
            transform: `translateY(${-lift}px)`,
            offset: 0.2,
            easing: "cubic-bezier(0.6, 0, 0.8, 0.4)",
          },
          { transform: "translateY(0)", offset: 0.43, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
          {
            transform: `translateY(${-lift * 0.3}px)`,
            offset: 0.58,
            easing: "cubic-bezier(0.6, 0, 0.8, 0.4)",
          },
          { transform: "translateY(0)", offset: 0.72, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
          {
            transform: `translateY(${-lift * 0.08}px)`,
            offset: 0.83,
            easing: "cubic-bezier(0.6, 0, 0.8, 0.4)",
          },
          { transform: "translateY(0)", offset: 0.92 },
          { transform: "translateY(0)" },
        ],
        { duration: T },
      );
      // The shadow is small and faint while the die is up and tight and dark when it lands.
      const far = "translate(-50%, 0) scale(0.55)";
      const near = "translate(-50%, 0) scale(1)";
      s.animate(
        [
          { transform: near, opacity: 0.5 },
          { transform: far, opacity: 0.18, offset: 0.2 },
          { transform: near, opacity: 0.5, offset: 0.43 },
          { transform: "translate(-50%, 0) scale(0.85)", opacity: 0.36, offset: 0.58 },
          { transform: near, opacity: 0.5, offset: 0.72 },
          { transform: near, opacity: 0.5 },
        ],
        { duration: T },
      );
      void tumble.finished.then(finish).catch(() => {
        busy.current = false;
        setRolling(false);
      });
    },
    [disabled, onRoll, size, value],
  );

  React.useImperativeHandle(ref, () => ({ roll }), [roll]);

  const r = size * 0.15;
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={`Die showing ${value}. Roll it.`}
      onClick={() => roll()}
      {...props}
      className={cn(
        "relative inline-block shrink-0 cursor-pointer select-none rounded-3xl outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-default",
        className,
      )}
      style={{ width: size * 1.9, height: size * 2, perspective: size * 9, ...props.style }}
    >
      <span
        ref={shadow}
        aria-hidden
        className="pointer-events-none absolute left-1/2 rounded-full bg-black blur-[7px]"
        style={{
          top: size * 1.32,
          width: size * 1.15,
          height: size * 0.34,
          opacity: 0.5,
          transform: "translate(-50%, 0) scale(1)",
        }}
      />
      <span ref={hop} aria-hidden className="absolute inset-0 block">
        <span
          className="absolute left-1/2 top-1/2 block [transform-style:preserve-3d]"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2 - size * 0.12,
            transform: "rotateX(-34deg) rotateY(-30deg)",
          }}
        >
          <span
            ref={cube}
            className="absolute inset-0 block [transform-style:preserve-3d]"
            style={{ transform: turn(UP[value]) }}
          >
            {FACES.map((f) => (
              <span
                key={f.value}
                className="absolute inset-0 grid grid-cols-3 grid-rows-3 place-items-center border border-line-strong bg-surface [backface-visibility:hidden]"
                style={{
                  borderRadius: r,
                  padding: size * 0.13,
                  transform: `${f.place} translateZ(${size / 2 - 0.5}px)`,
                  backgroundImage: `linear-gradient(135deg, rgb(255 255 255 / 0.5), rgb(255 255 255 / 0) 55%), linear-gradient(rgb(0 0 0 / ${f.dim}), rgb(0 0 0 / ${f.dim}))`,
                  boxShadow: `inset 0 0 ${size * 0.18}px rgb(0 0 0 / 0.1)`,
                }}
              >
                {Array.from({ length: 9 }, (_, i) =>
                  PIPS[f.value].includes(i) ? (
                    <span
                      key={i}
                      className="rounded-full bg-ink shadow-[inset_0_2px_3px_rgb(0_0_0/0.6),0_1px_0_rgb(255_255_255/0.5)]"
                      style={{ width: size * 0.17, height: size * 0.17 }}
                    />
                  ) : (
                    <span key={i} />
                  ),
                )}
              </span>
            ))}
          </span>
        </span>
      </span>
      <span className="sr-only" aria-live="polite">
        {rolling ? "Rolling" : `Rolled ${value}`}
      </span>
    </button>
  );
}
