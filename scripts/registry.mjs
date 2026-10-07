#!/usr/bin/env node
import { writeRegistry } from "../agent/lib.mjs";

const reg = writeRegistry();
console.log(`Wrote ${reg.count} components → registry/components.json`);
