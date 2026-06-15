from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np


OUT = Path(__file__).resolve().parents[1] / "assets" / "tutorials" / "04"


plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 12,
    "axes.titlesize": 15,
    "figure.titlesize": 15,
})


def draw_grid(ax, data, title, cmap="Blues", vmin=None, vmax=None, highlight=None):
    data = np.asarray(data)
    ax.imshow(data, cmap=cmap, vmin=vmin, vmax=vmax)
    ax.set_title(title, pad=8)
    ax.set_xticks(np.arange(-0.5, data.shape[1], 1), minor=True)
    ax.set_yticks(np.arange(-0.5, data.shape[0], 1), minor=True)
    ax.grid(which="minor", color="white", linewidth=1.8)
    ax.tick_params(which="both", bottom=False, left=False, labelbottom=False, labelleft=False)
    for spine in ax.spines.values():
        spine.set_visible(False)
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            val = data[i, j]
            label = f"{val:g}" if abs(val - round(val)) > 1e-9 else str(int(val))
            colour = "white" if val >= (np.nanmax(data) + np.nanmin(data)) / 2 else "black"
            ax.text(j, i, label, ha="center", va="center", color=colour, fontsize=12)
    if highlight:
        import matplotlib.patches as patches

        row, col, height, width = highlight
        ax.add_patch(
            patches.Rectangle(
                (col - 0.5, row - 0.5),
                width,
                height,
                fill=False,
                edgecolor="#d62728",
                linewidth=3,
            )
        )


def conv2d_valid(x, k, stride=1):
    out_h = (x.shape[0] - k.shape[0]) // stride + 1
    out_w = (x.shape[1] - k.shape[1]) // stride + 1
    y = np.zeros((out_h, out_w))
    for i in range(out_h):
        for j in range(out_w):
            patch = x[i * stride:i * stride + k.shape[0], j * stride:j * stride + k.shape[1]]
            y[i, j] = np.sum(patch * k)
    return y


def save_conv_mechanics():
    x = np.arange(25).reshape(5, 5)
    k = np.array([[1, 0, -1], [1, 0, -1], [1, 0, -1]])
    y = conv2d_valid(x, k)
    first_patch = x[:3, :3]
    first_value = int(np.sum(first_patch * k))

    fig, axes = plt.subplots(1, 4, figsize=(14.4, 4.0), gridspec_kw={"wspace": 0.38})
    draw_grid(axes[0], x, "input 5 x 5", cmap="Greys", highlight=(0, 0, 3, 3))
    draw_grid(axes[1], k, "kernel 3 x 3", cmap="RdBu_r", vmin=-1, vmax=1)
    draw_grid(axes[2], first_patch * k, "first patch x kernel", cmap="RdBu_r", vmin=-12, vmax=12)
    draw_grid(axes[3], y, "output 3 x 3", cmap="Blues", vmin=y.min(), vmax=y.max())
    axes[2].text(
        1,
        3.25,
        f"sum = {first_value}",
        ha="center",
        va="center",
        transform=axes[2].transData,
        fontsize=12,
    )
    fig.suptitle("Convolution as a sliding local dot product", y=0.98)
    fig.savefig(OUT / "conv-mechanics.png", dpi=180, bbox_inches="tight")
    plt.close(fig)


def save_padding_stride():
    cases = [
        ("valid convolution", 6, 3, 0, 1),
        ("same-size convolution", 6, 3, 1, 1),
        ("stride-2 downsampling", 6, 3, 0, 2),
    ]
    fig, axes = plt.subplots(2, 3, figsize=(13.5, 7.0), gridspec_kw={"hspace": 0.45, "wspace": 0.28})
    for col, (title, n, k, pad, stride) in enumerate(cases):
        padded = np.zeros((n + 2 * pad, n + 2 * pad))
        padded[pad:pad + n, pad:pad + n] = 1
        out_side = (n + 2 * pad - k) // stride + 1
        out = np.arange(out_side * out_side).reshape(out_side, out_side)

        draw_grid(axes[0, col], padded, f"{title}\ninput {n} x {n}, pad {pad}", cmap="Greys", vmin=0, vmax=1)
        draw_grid(axes[1, col], out, f"output {out_side} x {out_side}\n(n + 2p - k) // s + 1", cmap="Greens")
        axes[0, col].set_xlabel(f"k = {k}, stride = {stride}")
    fig.suptitle("Padding changes border coverage; stride changes output spacing", y=0.99)
    fig.savefig(OUT / "padding-stride.png", dpi=180, bbox_inches="tight")
    plt.close(fig)


def save_pooling_types():
    x = np.array([[1, 3, 2, 4], [5, 6, 1, 2], [3, 2, 1, 0], [1, 2, 5, 6]], dtype=float)
    max_pool = np.array([[x[:2, :2].max(), x[:2, 2:].max()], [x[2:, :2].max(), x[2:, 2:].max()]])
    avg_pool = np.array([[x[:2, :2].mean(), x[:2, 2:].mean()], [x[2:, :2].mean(), x[2:, 2:].mean()]])

    fig, axes = plt.subplots(1, 3, figsize=(12.8, 4.0), gridspec_kw={"wspace": 0.35})
    draw_grid(axes[0], x, "4 x 4 feature map", cmap="Blues", vmin=0, vmax=6)
    draw_grid(axes[1], max_pool, "2 x 2 max pooling", cmap="Blues", vmin=0, vmax=6)
    draw_grid(axes[2], avg_pool, "2 x 2 average pooling", cmap="Blues", vmin=0, vmax=6)
    fig.suptitle("Pooling with a 2 x 2 window and stride 2", y=0.98)
    fig.savefig(OUT / "pooling-types.png", dpi=180, bbox_inches="tight")
    plt.close(fig)


def save_flatten_demo():
    y, x = np.mgrid[-1:1:32j, -1:1:32j]
    image = np.zeros((32, 32, 3))
    image[..., 0] = np.exp(-((x + 0.25) ** 2 + (y + 0.1) ** 2) / 0.16)
    image[..., 1] = np.exp(-((x - 0.2) ** 2 + (y - 0.15) ** 2) / 0.12)
    image[..., 2] = np.exp(-((x) ** 2 + (y + 0.35) ** 2) / 0.22)
    image = np.clip(image + 0.12 * (x + 1)[..., None], 0, 1)
    flat = image.reshape(-1)

    fig = plt.figure(figsize=(13.5, 4.1))
    gs = fig.add_gridspec(1, 2, width_ratios=[1, 2.5], wspace=0.25)
    ax0 = fig.add_subplot(gs[0, 0])
    ax1 = fig.add_subplot(gs[0, 1])
    ax0.imshow(image, interpolation="nearest")
    ax0.set_title("32 x 32 x 3 image")
    ax0.axis("off")
    ax1.imshow(flat[np.newaxis, :], aspect="auto", cmap="viridis")
    ax1.set_title("same values after flattening to 3072 numbers")
    ax1.set_yticks([])
    ax1.set_xlabel("1-D index")
    fig.suptitle("Flattening keeps the values but removes the 2-D neighbourhood structure", y=1.03)
    fig.savefig(OUT / "flatten-loses-spatial.png", dpi=180, bbox_inches="tight")
    plt.close(fig)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    save_conv_mechanics()
    save_padding_stride()
    save_pooling_types()
    save_flatten_demo()


if __name__ == "__main__":
    main()
