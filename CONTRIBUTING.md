# Contributing to Yay or Nay

🎉 Thank you for your interest in contributing to **Yay or Nay**!

This project is an open-source, self-hostable tool designed to collect structured feedback on conference contributions such as talks, workshops, and panels.

We welcome contributions of all kinds — whether it's fixing bugs, proposing features, improving documentation, or helping with project management.

> [!NOTE]
> Make sure to read the [What Yay or Nay Is and What it Isn't](https://docs.yay-or-nay.com/what-is-yay-or-nay) page of the docs before contributing.
>
> This is an opinionated project, and not all improvements and/or feature requests will get approved. If in doubt,
> feel free to [open an issue](https://github.com/mocdaniel/yay-or-nay/issues/new).

---

## 🛠 Prerequisites

To get started, you'll need:

- [Bun](https://bun.sh) – JavaScript runtime and dependency management
- [Docker + Docker Compose](https://docs.docker.com/compose/) – for running supporting services

---

## 🧑‍💻 Local Development Setup

Follow these steps to get the project running locally:

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-org/yay-or-nay.git
   cd yay-or-nay

   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start supporting services**

   ```bash
   docker compose -f compose.dev.yaml up -d
   ```

4. **Start the development server**

   ```bash
   bun --bun run dev
   ```

---

## 🧹 Code Style & Linting

This project uses:

- [ESLint](https://eslint.org) for linting
- [Prettier](https://prettier.io) for formatting
- [Husky](https://typicode.github.io/husky) for pre-commit checks. These check:
  - Adherence to [conventional commits](https://conventionalcommits.org)
  - Uniform linting and formatting

---

## 🧾 Documentation

Documentation lives in the [`docs/`](./docs/) folder and is powered by [MkDocs](https://squidfunk.github.io/mkdocs-material).

Please follow the existing structure when adding or updating documentation.

---

## 🚀 Contribution Process

1. Start with an Issue or Discussion

   - For bugs or feature ideas, open a [GitHub Issue](https://github.com/mocdaniel/yay-or-nay/issues/new).
   - For proposals or open-ended ideas, use [GitHub Discussions](https://github.com/mocdaniel/yay-or-nay/discussions).

2. Fork the Repository and Create a Branch

   - Base your branch on `main`
   - Use a descriptive branch name like:

     ```bash
     feature/add-survey-export
     fix/missing-footer-links
     ```

3. Make Changes and Commit

   - Your changes will be checked for conformance with the linting and formatting rules automatically.
   - Write atomic and descriptive commits using the [Conventional Commits](https://conventionalcommits.org) style.

4. Open a Pull Request

   - Submit your PR against the main branch.
   - Link to relevant issues or discussions in the PR description.

---

## 📬 Bugs and Feature Requests

Use [GitHub Issues](https://github.com/mocdaniel/yay-or-nay/issues/new) to:

- Report bugs
- Suggest features
- Track enhancements and regressions

---

## 💬 Communication

If you want to connect with the community or project maintainers:

- Use [GitHub Discussions](https://github.com/mocdaniel/yay-or-nay/discussions)
- Or [open an Issue](https://github.com/mocdaniel/yay-or-nay/issues/new)

---

## 📜 License

This project is licensed under the MIT License.
See the [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE) files for details.

---

Thanks again for helping make Yay or Nay better! 💛
