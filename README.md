# @timkendrick/benchmark-cli
[![npm version](https://img.shields.io/npm/v/@timkendrick/benchmark-cli.svg)](https://www.npmjs.com/package/@timkendrick/benchmark-cli)
![Stability](https://img.shields.io/badge/stability-stable-brightgreen.svg)

> Command-line performance benchmarking for JavaScript

Simple command-line tool for running performance benchmark suites, providing direct speed comparison between related tests. Based on [Benchmark.js](https://www.npmjs.com/package/benchmark).

# Installation

Within a project:

```bash
npm install @timkendrick/benchmark-cli --save-dev
```

As a system-wide tool:

```bash
npm install -g @timkendrick/benchmark-cli
```

# Usage

```bash
benchmark suite1.js [suite2.js] [...suite3.js]
```

…where the input files are CommonJS modules that export one of the following:

- An anonymous test function
- A key/value object with test names as keys and test functions as values
- An array whose items are of one of the above

Named tests within the same key/value object will be run against each other for comparison of results.

Inline scripts can also be passed via the command line using the `-e` argument:

```bash
benchmark -e "() => { new Array(1000).fill('a'); }" -e "() => { for (let i = 0, arr = []; i < 1000; i++) { arr.push('a') } }"
```

Inline scripts must conform to the same rules as the permitted CommonJS module export formats.

# Example output

```
Running benchmarks.js #1 (1 of 3):
✔ Native map/filter/slice (100 items) x 13,357 ops/sec ±1.67% (82 runs sampled)
✔ Transducer map/filter/slice (100 items) x 19,000 ops/sec ±1.70% (81 runs sampled)
Transducer map/filter/slice (100 items) is 42.24% faster

Running benchmarks.js #2 (2 of 3):
✔ Native map/filter/slice (1000 items) x 1,355 ops/sec ±1.36% (84 runs sampled)
✔ Transducer map/filter/slice (1000 items) x 5,468 ops/sec ±1.93% (82 runs sampled)
Transducer map/filter/slice (1000 items) is 303.58% faster

Running benchmarks.js #3 (3 of 3):
✔ Native map/filter/slice (10000 items) x 132 ops/sec ±1.71% (70 runs sampled)
✔ Transducer map/filter/slice (10000 items) x 7,694 ops/sec ±1.71% (82 runs sampled)
Transducer map/filter/slice (10000 items) is 5723.27% faster
```
