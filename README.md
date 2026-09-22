<div align="center">
  <img src="logo/logo.png" alt="Xeno CLI Logo" width="140" />

  <h1>Xeno CLI</h1>

  <p><em>Enterprise-grade scaffolding and CLI toolkit for Xeno projects</em></p>

  <p>
    <a href="https://github.com/xeno-js/xeno-js">
      <img src="https://img.shields.io/badge/Powered%20by-Xeno-blueviolet?style=flat-square" alt="Powered by Xeno" />
    </a>
    <a href="https://github.com/xeno-js/xeno-cli/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@xeno-js/cli?style=flat-square" alt="License: ISC" />
    </a>
    <a href="https://www.npmjs.com/package/@xeno-js/cli">
      <img src="https://img.shields.io/npm/v/@xeno-js/cli?style=flat-square" alt="NPM Version" />
    </a>
    <a href="https://buymeacoffee.com/xenojs">
      <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFdd00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
    </a>
  </p>
</div>

---

## What is Xeno CLI?

**Xeno CLI** (`@xeno-js/cli`) is the official command-line interface designed to
initialize, configure, and manage projects based on the Xeno framework. It
automates infrastructural scaffolding to enforce **Domain-Driven Design (DDD)**
and **Command Query Responsibility Segregation (CQRS)** patterns seamlessly,
eliminating boilerplate for both Node.js backend environments (`@xeno-js/core`)
and frontend applications (`@xeno-js/vue`).

---

## 💡 Why Choose Xeno CLI?

- **Interactive Configuration**: Launch your project creation through guided
  prompts that automatically install essential dependencies tailored to your
  choices (e.g., Zod, Supabase, Drizzle ORM, Pino, Sentry, Pinia, and Tailwind
  CSS).
- **CQRS Architectural Scaffolding**: With a single command, dynamically
  generate Controllers, Handlers, Commands/Queries, dedicated modules, Vue
  composables, and interconnected Zod or DB schemas.
- **Target Agnosticism**: Natively handles project structures for both Backend
  (pure TypeScript) and Frontend (Vue.js), autonomously setting up key files
  like `tsconfig.json`, `vite.config.ts`, `.env`, and infrastructure
  bootstrappers.
- **CI/CD & Git Ready**: Instantly initializes Git repositories and triggers NPM
  installations, providing a "ready-to-code" ecosystem from the very first
  second.

---

## 📖 Documentation & Getting Started

The CLI interacts directly with Xeno's explicit Inversion of Control (IoC)
container. To explore the architecture and programmatic configurations, read the
full technical manuals:

- **[Framework Documentation Repository](https://www.xeno-js.it/cli/overview)**

---

## 📦 Installation

Install the CLI globally via npm or run it on-demand using `npx`:

```bash
# Global installation
npm install -g @xeno-js/cli

# On-demand execution
npx xeno-js new my-xeno-app

```

---

## 🚀 Usage Guide & Commands

### 1. Create a New Project

Bootstrap the complete architecture:

```bash
xeno-js new <name> [--vue | --core]

```

- `<name>`: The name of your target project directory.

- `[--vue | --core]`: Select the target environment. If omitted, it defaults to
  `--core`.

- `--core`: Initializes a Backend project (Node.js/TS).

- `--vue`: Initializes a Frontend project (Vue.js).

### 2. Generate CQRS Components

Dynamically generate folders and infrastructural files for read or write
operations:

```bash
xeno-js generate <type> <Name> [--vue | --core] [--output <path>]

# Recommended alias:
xeno-js g <type> <Name> [-o <path>]

```

- `<type>`: Component type to generate (`command` or `query`).

- `<Name>`: The name of the domain or entity in PascalCase or camelCase (e.g.,
  `UserCreate`).

- `[--vue | --core]`: Target context. Defaults to `--core`.

- `--core`: Generates Controller, Handler, Command/Query, Module, Zod schemas,
  and DB schema.

- `--vue`: Generates frontend-specific files like abstract Commands/Queries,
  Models, and Presentation Composables.

- `[--output | -o | --o]`: Custom destination path inside the `src/` directory.
  Defaults to `src/<name-in-lowercase>`.

### 3. Help & Guide

Display the quick command guide and supported aliases directly in your terminal:

```bash
xeno-js --help

# Alias:
xeno-js -h
xeno-js --h
```

---

## 🤝 For Contributors

We welcome contributions to Xeno CLI! To maintain the highest code quality and
stability for the generated scaffolding, **direct pushes to the `main` and
`develop` branches are strictly prohibited**. Please follow the same Git Flow as
the core framework:

1. **Branch off from `develop**`:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/add-new-generator

```

2. **Local Development**: Ensure your scaffolding changes do not break tests or
   builds:

```bash
npm run check

```

3. **Commit Standards**: We enforce
   [Conventional Commits](https://www.conventionalcommits.org/?utm_source=gemini).
   Husky will automatically verify your commit message format:

```bash
feat(cli): add interactive prompt for Drizzle setup
fix(generator): resolve output path bug in Vue scaffold

```

4. **Submit a Pull Request (PR)**: Push your branch to GitHub and open a Pull
   Request targeting the **`develop`** branch.

### Maintenance Scripts

| Command                       | Description                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| `npm run build`               | Compiles the TypeScript CLI source code into the `dist/` directory. |
| `npm run dev`                 | Runs the CLI in development mode using `tsx`.                       |
| `npm run typecheck`           | Checks types without emitting files (`tsc`).                        |
| `npm run lint`                | Runs ESLint to ensure no blocking formatting defects exist.         |
| `npm run format`              | Automatically formats codebase files using Prettier.                |
| `npm run test`                | Executes the Vitest test suite.                                     |
| `npm run test:coverage`       | Runs tests and generates a detailed coverage                        |
| report using the v8 provider. |

---

## 🌱 Support & Appreciation

Designing, integrating, and maintaining a CLI toolkit like Xeno requires massive
engineering effort. If the decoupled patterns generated by this CLI save you
countless hours of initial setup, please consider supporting its open-source
development.

**[Read our support guidelines and find out how to help](https://www.xeno-js.it/support-us)**

Thank you for being part of this decoupled open-source journey!

<amp-bounce>
</amp-bounce>
<a href="https://www.buymeacoffee.com/xenojs" target="_blank">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="42" style="height: 42px !important;" />
</a>

---

## 🛡️ Powered by Xeno

If you scaffolded your architecture using this CLI, let the world know by adding
our badge to your repository:

```html
<a
  href="[https://github.com/xeno-js/xeno-js](https://github.com/xeno-js/xeno-js)"
  target="_blank"
>
  <img
    src="[https://img.shields.io/badge/Powered%20by-Xeno-black?style=flat-square](https://img.shields.io/badge/Powered%20by-Xeno-black?style=flat-square)"
    alt="Powered by Xeno"
    height="20"
  />
</a>
```

## 📄 License

Copyright (c) 2026 Xeno. Licensed under the
[ISC License](https://www.google.com/search?q=LICENSE&utm_source=gemini).
