# SLAPT Task Commands

All tasks are run via [Task](https://taskfile.dev) (`Taskfile.yml` in the repo root).

Install Task: https://taskfile.dev/installation/

---

## Quick Reference

```bash
task              # list all available tasks
task run          # build and start everything (Docker)
task test:full    # start parser, run all tests, stop
task install      # install deps for all services + tests
```

---

## Docker

| Command | Description |
|---|---|
| `task run` | Build and start all services |
| `task run:d` | Build and start all services in background |
| `task stop` | Stop all running services |
| `task stop:clean` | Stop and remove volumes + local images |
| `task restart` | Stop then restart all services |
| `task ps` | Show running service containers |

---

## Logs

| Command | Description |
|---|---|
| `task logs` | Tail logs from all services |
| `task logs -- parser` | Tail logs from a specific service |
| `task logs:parser` | Tail parser logs |
| `task logs:web` | Tail web logs |

---

## Dev Mode (no Docker)

Run services individually with hot reload.

```bash
# Terminal 1 -> parser (http://localhost:3001)
task dev:parser

# Terminal 2 -> web frontend (http://localhost:3000)
task dev:web
```

---

## Install

| Command | Description |
|---|---|
| `task install` | Install deps for all services and tests |
| `task install:parser` | Install parser deps only |
| `task install:web` | Install web deps only |
| `task install:tests` | Install test deps only |

---

## Build

| Command | Description |
|---|---|
| `task build` | Build both services for production |
| `task build:parser` | Compile parser TypeScript to `dist/` |
| `task build:web` | Build web frontend for production |

---

## Tests

| Command | Description |
|---|---|
| `task test` | Run all tests (parser must be running) |
| `task test:full` | Auto-start parser in Docker, run all tests, stop |
| `task test:unit` | Run unit tests only -> no server needed |
| `task test:lexer` | Run lexer tests only |
| `task test:errors` | Run error validation tests only |
| `task test:api` | Run API integration tests (parser must be running) |

`task test:full` is the recommended way to run the full suite from a clean state.

---

## Type Checking

| Command | Description |
|---|---|
| `task check` | Type-check both services |
| `task check:parser` | Type-check parser only |
| `task check:web` | Type-check web only |

---

## Health

| Command | Description |
|---|---|
| `task health` | POST a test payload to the parse endpoint |
| `task health:parser` | Hit the parser `/health` endpoint directly |

Both require services to be running.

---

## Cleanup

| Command | Description |
|---|---|
| `task clean` | Remove build artifacts (`dist/`, `build/`, `.svelte-kit/`) |
| `task clean:deps` | Remove all `node_modules` across all services and tests |
| `task clean:all` | Remove everything -> artifacts, deps, Docker volumes |
| `task nuke` | Alias for `task stop:clean` |

---

## Full Workflow Example

```bash
# First time setup
task install

# Development
task run:d          # start in background
task logs           # watch logs
task test:full      # run all tests

# Before committing
task check          # type-check everything
task test:full      # full test run

# Clean slate
task clean:all      # wipe everything
task run            # fresh build
```