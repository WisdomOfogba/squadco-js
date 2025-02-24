import { fileURLToPath } from "node:url";
import { build } from 'esbuild';
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const base = (str: string) => fileURLToPath(new URL(str, import.meta.url));
// tsc --declaration index.ts --emitDeclarationOnly --outDir ./dist

// const [esmBuild, cjsBuild] =
await Promise.allSettled([
    build({
        entryPoints: [base("../src/index.ts")],
        outfile: base('../dist/esm/index.mjs'),
        format: "esm",
        minify: true,
        bundle: true,
        platform: 'node',
    }),
    build({
        entryPoints: [base("../src/index.ts")],
        outfile: base('../dist/cjs/index.cjs'),
        format: "cjs",
        minify: true,
        bundle: true,
        platform: 'node',
    }),
    build({
        entryPoints: [base("../src/nip.ts")],
        outfile: base('../dist/esm/nip.mjs'),
        format: "esm",
        minify: true,
        bundle: true,
        platform: 'node',
    }),
    build({
        entryPoints: [base("../src/nip.ts")],
        outfile: base('../dist/cjs/nip.cjs'),
        format: "cjs",
        minify: true,
        bundle: true,
        platform: 'node',
    }),
])
