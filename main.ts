// Two-Sentence Horror — make.fun entry
//
// The program writes exactly one horror story, in exactly two sentences,
// to entry.txt inside the output directory named by MAKEFUN_OUTPUT_DIR
// (or "out" when that variable is not set). The text is fixed: the same
// bytes are written on every run, with no clock, no randomness, no input
// and no network access anywhere in this file.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The story. A quiet domestic setup, reframed by the second sentence:
// a child draws her mother accurately, though her mother died before
// she was born — so the mother is present, and so is the tall man.
const STORY =
  "My daughter drew our family on the fridge: me, her mother, and the " +
  "tall man who stands behind us at dinner. " +
  "Her mother died before she was born.";

const MIN_CHARS = 1;
const MAX_CHARS = 400;
const EXPECTED_SENTENCES = 2;

function countCodePoints(text: string): number {
  return [...text].length;
}

function countSentences(text: string): number {
  const parts = text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  return parts.length;
}

function validateStory(text: string): void {
  const chars = countCodePoints(text);
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `story must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("story must not be only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("story must not have leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("story must not contain a newline");
  }
  const sentences = countSentences(text);
  if (sentences !== EXPECTED_SENTENCES) {
    throw new Error(
      `story must be exactly ${EXPECTED_SENTENCES} sentences, got ${sentences}`,
    );
  }
}

function main(): void {
  validateStory(STORY);
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, "entry.txt");
  writeFileSync(target, STORY, "utf8");
  // Read the file back and confirm the bytes on disk are exactly the
  // validated story, so a partial or altered write fails loudly here
  // instead of reaching the gate.
  const written = readFileSync(target, "utf8");
  if (written !== STORY) {
    throw new Error("entry.txt on disk does not match the validated story");
  }
  validateStory(written);
}

main();
