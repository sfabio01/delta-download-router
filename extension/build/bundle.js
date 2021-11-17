
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.43.2 */

    const { Object: Object_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i][0];
    	child_ctx[3] = list[i][1];
    	return child_ctx;
    }

    // (16:16) {#each Object.entries(urlToFolderObj) as [key, value]}
    function create_each_block(ctx) {
    	let div1;
    	let span0;
    	let t0_value = /*key*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = /*value*/ ctx[3] + "";
    	let t2;
    	let t3;
    	let div0;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let button1;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			button0 = element("button");
    			img0 = element("img");
    			t4 = space();
    			button1 = element("button");
    			img1 = element("img");
    			attr_dev(span0, "class", "item-title svelte-pvx9bh");
    			add_location(span0, file, 17, 24, 539);
    			attr_dev(span1, "class", "item-subtitle svelte-pvx9bh");
    			add_location(span1, file, 18, 24, 601);
    			if (!src_url_equal(img0.src, img0_src_value = "./../icons/edit.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "edit");
    			add_location(img0, file, 21, 33, 806);
    			attr_dev(button0, "class", "item-btn btn btn-primary btn-sm svelte-pvx9bh");
    			add_location(button0, file, 20, 28, 725);
    			if (!src_url_equal(img1.src, img1_src_value = "./../icons/delete.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "delete");
    			add_location(img1, file, 27, 33, 1101);
    			attr_dev(button1, "class", "item-btn btn btn-danger btn-sm svelte-pvx9bh");
    			add_location(button1, file, 26, 28, 1021);
    			attr_dev(div0, "class", "item-btn-group svelte-pvx9bh");
    			add_location(div0, file, 19, 24, 668);
    			attr_dev(div1, "class", "row-item svelte-pvx9bh");
    			add_location(div1, file, 16, 20, 492);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(span0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, span1);
    			append_dev(span1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, img0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(button1, img1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(16:16) {#each Object.entries(urlToFolderObj) as [key, value]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div8;
    	let div5;
    	let h20;
    	let t3;
    	let div1;
    	let t4;
    	let div0;
    	let input0;
    	let t5;
    	let input1;
    	let t6;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t7;
    	let h21;
    	let t9;
    	let div4;
    	let div3;
    	let span0;
    	let t11;
    	let span1;
    	let t13;
    	let div2;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let t14;
    	let button2;
    	let img2;
    	let img2_src_value;
    	let t15;
    	let div7;
    	let h22;
    	let t17;
    	let div6;
    	let each_value = Object.entries(/*urlToFolderObj*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Settings";
    			t1 = space();
    			div8 = element("div");
    			div5 = element("div");
    			h20 = element("h2");
    			h20.textContent = "URL to folder";
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			button0 = element("button");
    			img0 = element("img");
    			t7 = space();
    			h21 = element("h2");
    			h21.textContent = "Filetype to folder";
    			t9 = space();
    			div4 = element("div");
    			div3 = element("div");
    			span0 = element("span");
    			span0.textContent = "Images (png, jpg, svg)";
    			t11 = space();
    			span1 = element("span");
    			span1.textContent = "downloads/images";
    			t13 = space();
    			div2 = element("div");
    			button1 = element("button");
    			img1 = element("img");
    			t14 = space();
    			button2 = element("button");
    			img2 = element("img");
    			t15 = space();
    			div7 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Rules priority";
    			t17 = space();
    			div6 = element("div");
    			add_location(h1, file, 10, 4, 263);
    			add_location(h20, file, 13, 12, 348);
    			attr_dev(input0, "class", "form-control form-control-sm item-title svelte-pvx9bh");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "https://example.com/foo");
    			add_location(input0, file, 36, 20, 1433);
    			attr_dev(input1, "class", "form-control form-control-sm item-subtitle svelte-pvx9bh");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "path/to/destination/folder");
    			add_location(input1, file, 41, 20, 1653);
    			if (!src_url_equal(img0.src, img0_src_value = "./../icons/add.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "add");
    			add_location(img0, file, 47, 25, 1952);
    			attr_dev(button0, "class", "item-btn btn btn-primary btn-sm svelte-pvx9bh");
    			add_location(button0, file, 46, 20, 1879);
    			attr_dev(div0, "class", "row-item svelte-pvx9bh");
    			add_location(div0, file, 35, 16, 1390);
    			attr_dev(div1, "class", "box svelte-pvx9bh");
    			add_location(div1, file, 14, 12, 383);
    			add_location(h21, file, 51, 12, 2079);
    			attr_dev(span0, "class", "item-title svelte-pvx9bh");
    			add_location(span0, file, 54, 20, 2196);
    			attr_dev(span1, "class", "item-subtitle svelte-pvx9bh");
    			add_location(span1, file, 55, 20, 2271);
    			if (!src_url_equal(img1.src, img1_src_value = "./../icons/edit.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "edit");
    			add_location(img1, file, 58, 29, 2473);
    			attr_dev(button1, "class", "item-btn btn btn-primary btn-sm svelte-pvx9bh");
    			add_location(button1, file, 57, 24, 2396);
    			if (!src_url_equal(img2.src, img2_src_value = "./../icons/delete.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "delete");
    			add_location(img2, file, 64, 29, 2744);
    			attr_dev(button2, "class", "item-btn btn btn-danger btn-sm svelte-pvx9bh");
    			add_location(button2, file, 63, 24, 2668);
    			attr_dev(div2, "class", "item-btn-group svelte-pvx9bh");
    			add_location(div2, file, 56, 20, 2343);
    			attr_dev(div3, "class", "row-item svelte-pvx9bh");
    			add_location(div3, file, 53, 16, 2153);
    			attr_dev(div4, "class", "box svelte-pvx9bh");
    			add_location(div4, file, 52, 12, 2119);
    			attr_dev(div5, "class", "col1 svelte-pvx9bh");
    			add_location(div5, file, 12, 8, 317);
    			add_location(h22, file, 74, 12, 3042);
    			attr_dev(div6, "class", "box svelte-pvx9bh");
    			add_location(div6, file, 75, 12, 3078);
    			attr_dev(div7, "class", "col2 svelte-pvx9bh");
    			add_location(div7, file, 73, 8, 3011);
    			attr_dev(div8, "class", "container svelte-pvx9bh");
    			add_location(div8, file, 11, 4, 285);
    			attr_dev(main, "class", "svelte-pvx9bh");
    			add_location(main, file, 9, 0, 252);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div8);
    			append_dev(div8, div5);
    			append_dev(div5, h20);
    			append_dev(div5, t3);
    			append_dev(div5, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t5);
    			append_dev(div0, input1);
    			append_dev(div0, t6);
    			append_dev(div0, button0);
    			append_dev(button0, img0);
    			append_dev(div5, t7);
    			append_dev(div5, h21);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, span0);
    			append_dev(div3, t11);
    			append_dev(div3, span1);
    			append_dev(div3, t13);
    			append_dev(div3, div2);
    			append_dev(div2, button1);
    			append_dev(button1, img1);
    			append_dev(div2, t14);
    			append_dev(div2, button2);
    			append_dev(button2, img2);
    			append_dev(div8, t15);
    			append_dev(div8, div7);
    			append_dev(div7, h22);
    			append_dev(div7, t17);
    			append_dev(div7, div6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, urlToFolderObj*/ 1) {
    				each_value = Object.entries(/*urlToFolderObj*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let urlToFolderObj = {
    		"https://webeep.polimi.it/course/view.php?id=921": "downloads/uni/analisi",
    		"https://webee.polimi.it/chimica": "downloads/uni/chimica"
    	};

    	let filetypeToFolderObj = {};
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ urlToFolderObj, filetypeToFolderObj });

    	$$self.$inject_state = $$props => {
    		if ('urlToFolderObj' in $$props) $$invalidate(0, urlToFolderObj = $$props.urlToFolderObj);
    		if ('filetypeToFolderObj' in $$props) filetypeToFolderObj = $$props.filetypeToFolderObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [urlToFolderObj];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
