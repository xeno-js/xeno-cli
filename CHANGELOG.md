# Changelog

All notable changes to Xeno CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.0.html).

## [0.1.3] - 2026-05-27

### Added

- Enterprise code generator (`@xeno-js/cli`) to automate project scaffolding and
  architectural boundaries.
- Dedicated generators for commands, queries, and CQRS handler boilerplates.
- Interactive terminal prompts utilizing `prompts` and styled logs via
  `picocolors`.

### Fixed

- Resolved path resolution issues when scaffolding files inside nested monorepo
  structures.
- Stabilized command argument validation during template generation.
