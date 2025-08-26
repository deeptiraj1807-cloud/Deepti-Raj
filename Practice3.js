
(() => {
  const svg = document.getElementById('canvas');


  const toolRectBtn = document.getElementById('tool-rect');
  const toolLineBtn = document.getElementById('tool-line');
  const strokeColor = document.getElementById('strokeColor');
  const strokeWidth = document.getElementById('strokeWidth');
  const fillColor = document.getElementById('fillColor');
  const fillToggle = document.getElementById('fillToggle');
  const clearBtn = document.getElementById('clearBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  let tool = 'rect';        
  let drawing = false;
  let start = { x: 0, y: 0 };
  let currentShape = null;


  function svgPoint(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  }


  function setTool(next) {
    tool = next;
    [toolRectBtn, toolLineBtn].forEach(b => {
      const active = b.dataset.tool === tool;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
  }
  toolRectBtn.addEventListener('click', () => setTool('rect'));
  toolLineBtn.addEventListener('click', () => setTool('line'));


  function applyStyle(el, noFill = false) {
    el.setAttribute('stroke', strokeColor.value);
    el.setAttribute('stroke-width', strokeWidth.value);
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    if (el.tagName.toLowerCase() === 'rect' && !noFill) {
      if (fillToggle.checked) {
        el.setAttribute('fill', fillColor.value);
        el.setAttribute('fill-opacity', 0.35);
      } else {
        el.setAttribute('fill', 'none');
      }
    } else {
      el.setAttribute('fill', 'none');
    }
  }


  svg.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();

    drawing = true;
    const p = svgPoint(e);
    start = { x: p.x, y: p.y };

    if (tool === 'rect') {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', start.x);
      rect.setAttribute('y', start.y);
      rect.setAttribute('width', 0);
      rect.setAttribute('height', 0);
      applyStyle(rect);
      svg.appendChild(rect);
      currentShape = rect;
    } else {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', start.x);
      line.setAttribute('y1', start.y);
      line.setAttribute('x2', start.x);
      line.setAttribute('y2', start.y);
      applyStyle(line, true);
      svg.appendChild(line);
      currentShape = line;
    }
  });

 
  window.addEventListener('mousemove', (e) => {
    if (!drawing || !currentShape) return;
    const p = svgPoint(e);

    if (tool === 'rect') {
      const x = Math.min(p.x, start.x);
      const y = Math.min(p.y, start.y);
      const w = Math.abs(p.x - start.x);
      const h = Math.abs(p.y - start.y);
      currentShape.setAttribute('x', x);
      currentShape.setAttribute('y', y);
      currentShape.setAttribute('width', w);
      currentShape.setAttribute('height', h);
    } else {
      currentShape.setAttribute('x2', p.x);
      currentShape.setAttribute('y2', p.y);
    }
  });


  window.addEventListener('mouseup', () => {
    if (!drawing) return;
    drawing = false;
    currentShape = null;
  });


  clearBtn.addEventListener('click', () => {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  });


  downloadBtn.addEventListener('click', () => {
 
    const clone = svg.cloneNode(true);
    clone.removeAttribute('id');

 
    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const vb = svg.getAttribute('viewBox') || `0 0 ${svg.clientWidth} ${svg.clientHeight}`;
    wrapper.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    wrapper.setAttribute('viewBox', vb);
    wrapper.setAttribute('width', svg.clientWidth);
    wrapper.setAttribute('height', svg.clientHeight);

    while (clone.firstChild) wrapper.appendChild(clone.firstChild);

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(wrapper);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawing.svg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });


  document.addEventListener('dragstart', e => e.preventDefault());
})();
