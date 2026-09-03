import type * as declared from "html-slim"
import {strict as assert} from "node:assert"
import {createRequire} from "node:module"
import path from "node:path"
import {test} from "node:test"
import * as m from "./html-slim.ts"

const require = createRequire(import.meta.url)

// tsc fails here when a name declared in the published .d.ts is missing
// from the runtime entry -- the surface check derives from the declarations.
const runtime: typeof declared = m
void runtime

test("import entry (.mjs)", () => {
    assert.equal(typeof m.slim, "function")
})

// module-sync sends this to the .mjs where require(esm) exists and to the
// minified bundle below Node 20.19.
test("require entry", () => {
    const m = require("html-slim")
    assert.equal(typeof m.slim, "function")
})

// The exports map publishes no subpath, so reach the bundle by its path.
test("minified entry (.min.js)", () => {
    const m = require(path.join(path.dirname(require.resolve("html-slim")), "html-slim.min.js"))
    assert.equal(typeof m.slim, "function")
})
