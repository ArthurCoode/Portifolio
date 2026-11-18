/* ================= CENA 3D DO HERO (Three.js) =================
   Carregada como módulo, depois do conteúdo — não bloqueia a renderização
   nem o LCP. Pausa quando o hero sai da tela ou a aba fica oculta. */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const host = document.getElementById("hero3d");

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

async function start() {
  if (!host || reduce || !webglOk()) return;

  const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");

  const LIME = 0xc8f136;
  const isSmall = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 9, 22);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  /* ---- núcleo: icosaedro facetado + casca em wireframe ---- */
  const core = new THREE.Group();
  scene.add(core);

  const solid = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, 1),
    new THREE.MeshStandardMaterial({ color: 0x0b0d06, roughness: 0.35, metalness: 0.85, flatShading: true })
  );
  core.add(solid);

  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.6, 1)),
    new THREE.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.55 })
  );
  core.add(wire);

  // vértices brilhantes na casca
  const shellPts = new THREE.Points(
    new THREE.IcosahedronGeometry(2.6, 1),
    new THREE.PointsMaterial({ color: LIME, size: 0.09, sizeAttenuation: true })
  );
  core.add(shellPts);

  // anéis orbitais
  const ringMat = new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.35 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.012, 8, 160), ringMat);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.008, 8, 160), ringMat.clone());
  ring2.material.opacity = 0.18;
  ring1.rotation.x = Math.PI / 2.4;
  ring2.rotation.x = Math.PI / 1.8;
  ring2.rotation.y = 0.5;
  core.add(ring1, ring2);

  // pequenos "satélites" (cubos) orbitando
  const sats = [];
  const satGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(
      satGeo,
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0xffffff : LIME, roughness: 0.3, metalness: 0.4, emissive: i % 2 ? 0x111111 : 0x2a3308 })
    );
    m.userData = { r: 3.6 + (i % 2) * 0.6, speed: 0.25 + i * 0.07, phase: (i / 5) * Math.PI * 2, tilt: 0.4 + i * 0.25 };
    sats.push(m);
    scene.add(m);
  }

  /* ---- campo de partículas ao fundo ---- */
  const COUNT = isSmall ? 450 : 1100;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 6 + Math.random() * 12;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.6;
    pos[i * 3 + 2] = r * Math.cos(p) - 4;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.55, sizeAttenuation: true })
  );
  scene.add(stars);

  /* ---- luzes ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const key = new THREE.PointLight(LIME, 60, 30);
  key.position.set(4, 3, 6);
  const rim = new THREE.PointLight(0xffffff, 30, 30);
  rim.position.set(-5, -2, 3);
  scene.add(key, rim);

  /* ---- tamanho / layout ---- */
  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // em telas largas o núcleo fica à direita; em telas pequenas, centralizado e menor
    const wide = w > 1024;
    core.position.x = wide ? 5.2 : 0;
    core.position.y = wide ? -0.4 : 1.4;
    core.scale.setScalar(wide ? 1 : 0.75);
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---- interação: mouse + scroll ---- */
  const target = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  window.addEventListener(
    "pointermove",
    (e) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    },
    { passive: true }
  );

  let scrollK = 0;
  window.addEventListener(
    "scroll",
    () => {
      scrollK = Math.min(window.scrollY / window.innerHeight, 1.5);
    },
    { passive: true }
  );

  /* ---- loop (só roda com o hero visível) ---- */
  let running = false;
  let visible = true;
  const clock = new THREE.Clock();

  function frame() {
    if (!running) return;
    const t = clock.getElapsedTime();

    smooth.x += (target.x - smooth.x) * 0.05;
    smooth.y += (target.y - smooth.y) * 0.05;

    core.rotation.y = t * 0.18 + smooth.x * 0.8 + scrollK * 1.4;
    core.rotation.x = Math.sin(t * 0.3) * 0.15 + smooth.y * 0.5 + scrollK * 0.6;
    wire.rotation.y = -t * 0.08;
    ring1.rotation.z = t * 0.25;
    ring2.rotation.z = -t * 0.18;
    core.position.z = -scrollK * 3;

    const pulse = 1 + Math.sin(t * 1.6) * 0.025;
    solid.scale.setScalar(pulse);

    sats.forEach((m) => {
      const d = m.userData;
      const a = t * d.speed + d.phase;
      m.position.set(
        core.position.x + Math.cos(a) * d.r * core.scale.x,
        core.position.y + Math.sin(a) * d.r * Math.sin(d.tilt) * core.scale.x,
        core.position.z + Math.sin(a) * d.r * Math.cos(d.tilt) * core.scale.x
      );
      m.rotation.x = t * 1.2 + d.phase;
      m.rotation.y = t * 0.9;
    });

    stars.rotation.y = t * 0.02 + smooth.x * 0.15;
    stars.rotation.x = smooth.y * 0.1;

    camera.position.x = smooth.x * 1.2;
    camera.position.y = -smooth.y * 0.8 - scrollK * 1.2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) {
      clock.getDelta();
      requestAnimationFrame(frame);
    }
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    setRunning(visible && !document.hidden);
  }).observe(host);

  document.addEventListener("visibilitychange", () => setRunning(visible && !document.hidden));

  setRunning(true);
  requestAnimationFrame(() => host.classList.add("ready"));
}

// espera a página carregar e o navegador ficar ocioso
function boot() {
  const go = () => start().catch(() => {});
  if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 1500 });
  else setTimeout(go, 400);
}
if (document.readyState === "complete") boot();
else window.addEventListener("load", boot, { once: true });
