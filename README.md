<div align="center">
  <img src="logo/logo.png" alt="Xeno CLI Logo" width="140" />

  <h1>Xeno CLI</h1>

  <p><strong>Start with the architecture. Not the scaffolding.</strong></p>

  <p>
    Scaffold and generate TypeScript applications around explicit
    application boundaries, CQRS, dependency injection, and Xeno's
    application architecture.
  </p>

  <p>
    <a href="https://www.npmjs.com/package/@xeno-js/cli">
      <img src="https://img.shields.io/npm/v/@xeno-js/cli?style=flat-square" alt="npm version" />
    </a>
    <a href="https://github.com/xeno-js/xeno-cli">
      <img src="https://img.shields.io/github/stars/xeno-js/xeno-cli?style=flat-square" alt="GitHub stars" />
    </a>
    <a href="https://github.com/xeno-js/xeno-cli/blob/develop/LICENSE">
      <img src="https://img.shields.io/npm/l/@xeno-js/cli?style=flat-square" alt="License: MIT" />
    </a>
    <a href="https://buymeacoffee.com/xenojs">
      <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFdd00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
    </a>    
  </p>
</div>

---

## What is Xeno CLI?

**Xeno CLI** (`@xeno-js/cli`) is the command-line entry point for creating and
generating Xeno projects.

It helps you start with an explicit application structure instead of rebuilding
the same architecture by hand.

Use it to:

- create a new Xeno backend project;
- create a Xeno Vue project;
- generate commands and queries;
- choose the infrastructure modules your project needs;
- generate the initial configuration and composition files.

The goal is simple:

> **Start coding the application, not the scaffolding.**

---

# Start in seconds

Create a Xeno backend project:

```bash
npx @xeno-js/cli new my-app --core
```

Create a Vue project:

```bash
npx @xeno-js/cli new my-app --vue
```

The CLI guides you through the project options and generates the initial
structure for you.

---

# Generate a use case

Once your project exists, generate application components without manually
rebuilding the same structure.

```bash
npx @xeno-js/cli g command CreateUser --core
```

or:

```bash
npx @xeno-js/cli g query FindUser --core
```

For Vue:

```bash
npx @xeno-js/cli g command CreateUser --vue
```

The `g` alias is available for faster iteration:

```bash
xeno-js g command CreateUser --core
```

---

# What the CLI creates

Xeno CLI is built around the architecture used by the Xeno ecosystem.

A new project starts from explicit building blocks such as:

```text
Application
├── composition root
├── configuration
├── registry
├── CQRS
├── domain contracts
└── infrastructure boundaries
```

The exact generated files depend on the project type and the modules you select.

The important part is the boundary:

```text
Transport
    ↓
Application
    ↓
Domain
    ↓
Infrastructure
```

The CLI gives you the starting structure.

Your application defines the business behavior.

---

# Backend projects

The Core scaffold can configure modules for areas such as:

- database access;
- Redis;
- authentication;
- HTTP clients;
- resilience;
- logging;
- validation;
- application pipelines.

The generated project uses `@xeno-js/core` as its application runtime.

Example:

```text
my-app/
├── src/
│   ├── bootstrap.ts
│   ├── main.ts
│   └── registry.ts
├── package.json
├── tsconfig.json
└── .env
```

The purpose is not to hide the architecture.

The purpose is to give you a clear place to continue building it.

---

# Vue projects

Xeno CLI can also scaffold Vue applications around `@xeno-js/vue`.

```bash
npx @xeno-js/cli new my-app --vue
```

The generated project can include the pieces you choose for your application,
such as:

- Xeno frontend bootstrap;
- Vue configuration;
- application registry;
- routing;
- Pinia;
- authentication;
- HTTP data sources;
- validation;
- logging;
- styling.

The UI remains the presentation layer.

Application behavior remains outside the component whenever the architecture
requires it.

---

# Why use the CLI?

Starting an application usually creates the same decisions again:

Where should the application bootstrap live?

Where should dependencies be registered?

Where do commands and queries belong?

How should infrastructure connect to the application?

How should the project evolve without putting everything into controllers,
routes, or components?

Xeno CLI turns those decisions into a repeatable starting structure.

> **You still design the application. You do not have to rebuild its
> foundation** **every time.**

---

# CLI and Xeno

The CLI is one part of the Xeno ecosystem.

```text
@xeno-js/shared
    defines domain primitives
    and application contracts

          ↓

@xeno-js/core
    executes the application architecture

          ↓

@xeno-js/vue
    brings the model to the browser

          ↓

@xeno-js/cli
    creates the starting structure
```

A useful mental model is:

> **Shared defines the language.** **Core executes the architecture.** **Vue
> hosts the architecture in the browser.** **CLI gets you started.**

---

# Use it on new projects

The CLI is designed to make the first project setup explicit and repeatable.

```bash
npx @xeno-js/cli new my-app --core
```

Then:

```bash
cd my-app
npm run start
```

The generated application can then be extended with the components and
infrastructure your project actually needs.

---

# Generate inside an existing project

The generator can also be used after the project already exists.

For example:

```bash
npx @xeno-js/cli g command CreateOrder --core
```

This is useful when a project already has its application structure and you want
to add another command or query without rebuilding the surrounding files
manually.

---

# Commands

## Create a project

```bash
xeno-js new <name> [--core | --vue]
```

### Options

- `--core` — create a backend project using `@xeno-js/core`
- `--vue` — create a frontend project using `@xeno-js/vue`

---

## Generate a command or query

```bash
xeno-js generate <command | query> <Name> [--core | --vue]
```

Alias:

```bash
xeno-js g <command | query> <Name> [--core | --vue]
```

Optional output path:

```bash
xeno-js g command CreateUser --core --output src/features/users
```

---

## Help

```bash
xeno-js --help
```

Aliases:

```bash
xeno-js -h
xeno-js --h
```

---

# Installation

You can run the CLI on demand:

```bash
npx @xeno-js/cli --help
```

Or install it globally:

```bash
npm install -g @xeno-js/cli
```

Then:

```bash
xeno-js --help
```

---

# Node.js

Xeno CLI currently targets:

```text
Node.js 20+
```

---

# Relationship with the Xeno architecture

Xeno CLI does not replace your transport framework.

It does not try to own HTTP routing.

It does not define your business rules.

It gives you a consistent starting point for the application layer that sits
between transport and infrastructure.

```text
HTTP / CLI / Worker
        ↓
   Application
        ↓
      Domain
        ↓
  Infrastructure
```

That boundary is what the rest of Xeno is designed to execute.

---

# Read the architecture

The CLI is easier to understand when you see the architecture it generates.

Start with:

- Xeno Core
- Xeno Shared
- Xeno Vue
- Xeno architecture documentation

Documentation:

https://www.xeno-js.it/docs/introduction

Core:

https://github.com/xeno-js/xeno-js

Shared:

https://github.com/xeno-js/xeno-shared

Vue:

https://github.com/xeno-js/xeno-fe

---

# Contributing

Contributions are welcome.

Development happens from feature branches targeting `develop`.

```bash
git checkout develop
git pull origin develop
git checkout -b feat/your-feature

npm install
npm run check
```

Before opening a pull request:

```bash
npm run check
```

We use Conventional Commits:

```text
feat(cli): add generator
fix(generator): correct scaffold output
refactor(dispatcher): simplify command dispatch
docs(readme): improve getting started
```

---

## Support

If Xeno is useful to you, you can support the project through the community and
sponsorship channels documented on the website:

**[Support Xeno](https://www.xeno-js.it/docs/support-us)**

---

## License

Copyright (c) 2026 Xeno.

Licensed under the [MIT License](LICENSE).
