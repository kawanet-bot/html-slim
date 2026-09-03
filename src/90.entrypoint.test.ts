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

const source = `<p>a</p><!-- c -->`
const slimmed = `<p>a</p>`

test("import entry (.mjs)", () => {
    assert.equal(typeof m.slim, "function")
    assert.equal(m.slim({})(source), slimmed)
})

// module-sync sends this to the .mjs where require(esm) exists and to the
// minified bundle below Node 20.19; both have to answer the same way.
test("require entry", () => {
    const m = require("html-slim")
    assert.equal(typeof m.slim, "function")
    assert.equal(m.slim({})(source), slimmed)
})

// The exports map publishes no subpath, so reach the bundle by its path.
// Asserting the output is what catches a change in the export shape that
// a typeof check alone would pass.
test("minified entry (.min.js)", () => {
    const m = require(path.join(path.dirname(require.resolve("html-slim")), "html-slim.min.js"))
    assert.equal(typeof m.slim, "function")
    assert.equal(m.slim({})(source), slimmed)
})
