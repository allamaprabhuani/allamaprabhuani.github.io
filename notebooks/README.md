# notebooks

Source `.ipynb` files for the tutorials at https://allamaprabhuani.github.io/tutorials/

## Workflow for adding a new tutorial

1. Write the notebook here, e.g. `notebooks/01-ml-training.ipynb`.
2. Render it to standalone HTML so the static site can embed it:

   ```bash
   jupyter nbconvert --to html --template lab \
     --output-dir notebooks \
     notebooks/01-ml-training.ipynb
   ```

   (Produces `notebooks/01-ml-training.html`.)
3. Edit the matching tutorial page in `_tutorials/` and set:

   ```yaml
   status: published
   notebook: notebooks/01-ml-training.ipynb
   rendered: ../notebooks/01-ml-training.html
   ```

4. Commit `.ipynb`, `.html`, and the updated `_tutorials/*.md`. Push.

## Why both `.ipynb` and `.html`?

- `.ipynb` is the source of truth, lives in `git log`, and is what Colab/Binder load via the buttons.
- `.html` is the pre-rendered version served instantly to the static site (no Python at request time).
