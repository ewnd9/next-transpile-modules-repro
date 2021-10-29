# `next-transpile-modules-repro`

With the following import graph:

```
app -> node_modules/a-1 (transpiled) -> node_modules/a-2 (transpiled) -> node_modules/a-3 (not transpiled, `{ "type": "module" }`)
```

`a-2` is tread as async import inside `a-1` and returns promise, but importing from the app directly works correctly.

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
a2 inside node_modules {
  default: Promise {
    <pending>,
    [Symbol(webpack exports)]: Object [Module] {},
    [Symbol(webpack then)]: [Function (anonymous)]
  }
}
a3 inside node_modules [Module: null prototype] {  }
a1 inside src {}
a2 inside src Object [Module] {}

# in the other terminal
$ curl localhost:3000
```

## Webpack

```sh
$ rm -rf dist && node ./webpack-build && node dist/bundle
a3 inside node_modules Object [Module] {}
a2 inside node_modules Object [Module] {}
a1 {}
a2 Object [Module] {}
```

## Notes

https://github.com/vercel/next.js/discussions/27876
