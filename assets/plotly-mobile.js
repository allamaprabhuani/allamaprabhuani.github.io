/* Keep exported Plotly figures usable inside narrow tutorial iframes. */
(function () {
  var script = document.currentScript;
  var graph = document.querySelector('.plotly-graph-div');
  if (!graph || !window.Plotly) return;

  var mobileTitle = script.dataset.mobileTitle || 'Interactive figure';
  var original = {
    title: graph.layout.title && graph.layout.title.text,
    titleSize: graph.layout.title && graph.layout.title.font && graph.layout.title.font.size,
    titleX: graph.layout.title && graph.layout.title.x,
    titleXAnchor: graph.layout.title && graph.layout.title.xanchor,
    titleY: graph.layout.title && graph.layout.title.y,
    margins: Object.assign({}, graph.layout.margin || {}),
    menu: graph.layout.updatemenus && graph.layout.updatemenus[0]
      ? Object.assign({}, graph.layout.updatemenus[0])
      : null
  };
  var narrow = window.matchMedia('(max-width: 480px)');
  var resizeTimer;

  function setModebarVisibility(hidden) {
    var modebar = graph.querySelector('.modebar-container');
    if (modebar) modebar.style.display = hidden ? 'none' : '';
  }

  function update() {
    var mobile = narrow.matches;
    var changes = mobile ? {
      'title.text': mobileTitle,
      'title.font.size': 14,
      'title.x': 0.5,
      'title.xanchor': 'center',
      'title.y': 0.98,
      'margin.l': 42,
      'margin.r': 12,
      'margin.t': 105
    } : {
      'title.text': original.title,
      'title.font.size': original.titleSize,
      'title.x': original.titleX,
      'title.xanchor': original.titleXAnchor,
      'title.y': original.titleY,
      'margin.l': original.margins.l,
      'margin.r': original.margins.r,
      'margin.t': original.margins.t
    };

    if (original.menu) {
      changes['updatemenus[0].x'] = mobile ? -0.2 : original.menu.x;
      changes['updatemenus[0].xanchor'] = mobile ? 'left' : original.menu.xanchor;
      changes['updatemenus[0].y'] = mobile ? 1 : original.menu.y;
      changes['updatemenus[0].yanchor'] = mobile ? 'bottom' : original.menu.yanchor;
      changes['updatemenus[0].pad.l'] = mobile ? 4 : ((original.menu.pad && original.menu.pad.l) || 0);
    }

    Plotly.relayout(graph, changes).then(function () {
      setModebarVisibility(mobile);
      Plotly.Plots.resize(graph);
    });
  }

  graph.setAttribute('role', 'img');
  graph.setAttribute('aria-label', mobileTitle + '. Use the slider or playback controls to explore the figure.');
  update();
  if (narrow.addEventListener) narrow.addEventListener('change', update);
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(update, 120);
  });
})();
