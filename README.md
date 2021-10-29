# `next-transpile-modules-repro`

With the following import graph:

```
app -> node_modules/a-1/dist/index.js (transpiled) -> node_modules/a-1/dist/lib.js (transpiled) -> `tslib` (not transpiled, `{ "type": "module" }`)
```

Dependencies:

- `next@12.0.1`
- `next-transpile-modules@9.0.0`
- `node@14.17.3`
- `yarn@1.22.10`

## Install

```sh
$ yarn install
```

## Usage

```sh
$ rm -rf .next && yarn next build && yarn next start
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
lib import in a-1/index.js {
  default: Promise {
    <pending>,
    [Symbol(webpack exports)]: Object [Module] {},
    [Symbol(webpack then)]: [Function (anonymous)]
  }
}
a1 inside src {}
tslib import in a-1/lib.js { __rest: [Function: __rest] }

# in the other terminal
$ curl localhost:3000
```
