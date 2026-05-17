# notebooks

Source `.ipynb` files for the tutorials at https://allamaprabhuani.github.io/tutorials/

## Workflow for adding a new tutorial

1. Write the notebook here, e.g. `notebooks/01-ml-training.ipynb`.
2. Render it to standalone HTML so the static site can embed it:

   ```bash
   # Execute first so cell outputs are present, then render with the
   # `basic` template (lab/classic produce full HTML docs that don't
   # include cleanly into a Jekyll page).
   jupyter nbconvert --to notebook --execute --inplace \
     notebooks/01-ml-training.ipynb
   jupyter nbconvert --to html --template basic \
     --output-dir notebooks \
     notebooks/01-ml-training.ipynb
   ```

   (Produces `notebooks/01-ml-training.html`.)
3. Edit the matching tutorial page in `_tutorials/` and set:

   ```yaml
   status: published
   notebook: notebooks/01-ml-training.ipynb
   ```

   (Do **not** set `rendered:` with a `../` path — Jekyll's `include_relative`
   blocks parent-directory paths for security and the build will fail. The
   `rendered:` field in the layout is reserved for future use when the
   notebook lives in the same directory as the tutorial markdown.)

4. The tutorial markdown is the curated long-form: write framing prose,
   embed key PNG/GIF figures from `assets/tutorials/NN/`, and if there is
   an interactive HTML demo, embed it via the `tutorial-interactive`
   iframe pattern (see `_tutorials/01-ml-training-basics.md`).

5. Commit `.ipynb`, `.html`, and the updated `_tutorials/*.md`. Push.

## Why both `.ipynb` and `.html`?

- `.ipynb` is the source of truth, lives in `git log`, and is what Colab/Binder load via the buttons.
- `.html` is the pre-rendered version served instantly to the static site (no Python at request time).
