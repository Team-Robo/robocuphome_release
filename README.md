# Team Robo Release Documentation Site

Release catalog and architecture documentation for Team Robo's RoboCup@Home software.

## Local development

From the repository root, set up Python 3.12 and preview the site.

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
zensical serve
```

Run the same build and link checks as CI from the repository root.

```bash
zensical build --strict
python scripts/check_site.py
```

MkDocs previews also work with `mkdocs serve`.

## Release catalog

`docs/projects.md` catalogs all 24 `Team-Robo/public-*` repositories plus our 3 public ICRA BARN
Challenge repositories (`mlda-barn-2024`, `mlda-barn-2025`, `the_barn_challenge_robo`). Architecture
and reuse guides live under `docs/stack.md`, `docs/hri.md`, `docs/grasping.md`, `docs/navigation.md`,
and `docs/tools.md`. For team news and competition info, see the
[official team website](https://robo-eee-web.vercel.app/).

## GitHub Pages

Pull requests and pushes to `main` run the site checks. To enable deployment on an eligible
repository, select **GitHub Actions** in **Settings → Pages** and set the repository Actions
variable `PAGES_ENABLED` to `true`. The next successful build on `main` publishes the site.

`site_url` in `mkdocs.yml` uses the default project URL. Update it if the site moves to a custom
domain. Actions builds from the public source repository include page edit links.
