import {strict as assert} from "node:assert"
import {describe, it} from "node:test"
import {slim} from "./html-slim.ts"

// Behaviour that comes from the HTML parser rather than from this package's
// own options. Pinned here because a parser major can change any of it, and
// the difference reaches the output silently.
describe("parser conformance", () => {
    const plain = slim({})

    it("keeps entity references in <textarea> escaped once", () => {
        assert.equal(plain(`<textarea>a &amp; b</textarea>`), `<textarea>a &amp; b</textarea>`)
        assert.equal(plain(`<textarea>a & b</textarea>`), `<textarea>a &amp; b</textarea>`)
    })

    // Processing instructions and malformed declarations parse as bogus
    // comments, so the default comment removal takes them out. Anyone
    // running server-side templates through this loses that code.
    it("drops bogus comments along with real ones", () => {
        assert.equal(plain(`<div><?php echo 1; ?></div>`), `<div></div>`)
        assert.equal(plain(`<div><?xml-stylesheet href="a.xsl"?></div>`), `<div></div>`)
        assert.equal(plain(`<div><! foo ></div>`), `<div></div>`)
    })

    // Raw text elements hold text, not markup, so a comment inside one is
    // content and survives.
    it("keeps comment-like text inside raw text elements", () => {
        assert.equal(plain(`<iframe><!-- c --></iframe>`), `<iframe><!-- c --></iframe>`)
        assert.equal(plain(`<noframes><!-- c --></noframes>`), `<noframes><!-- c --></noframes>`)
    })

    it("keeps CDATA content in foreign elements", () => {
        assert.equal(plain(`<svg><![CDATA[ x ]]></svg>`), `<svg> x </svg>`)
    })

    it("normalises <image> to <img>", () => {
        assert.equal(plain(`<div><image src="a.png"></div>`), `<div><img src="a.png"></div>`)
    })

    // Implicit closing decides the tree the selector option walks, so the
    // nesting has to stay flat here for `p p` to match nothing.
    it("closes elements implicitly rather than nesting them", () => {
        assert.equal(plain(`<p>one<p>two`), `<p>one</p><p>two</p>`)
        assert.equal(slim({selector: "p p"})(`<p>one<p>two`), `<p>one</p><p>two</p>`)
        assert.equal(plain(`<ul><li>a<li>b</ul>`), `<ul><li>a</li><li>b</li></ul>`)
    })
})
