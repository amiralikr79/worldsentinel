'use client';
// ─────────────────────────────────────────────────────────────────────────────
//  Globe — Three.js r128 interactive 3D earth.
//  Imported dynamically from page.tsx with { ssr: false } to avoid
//  server-side rendering issues (Three.js requires a DOM).
//
//  Props:
//   markers  — array of GlobeMarker to render as pulsing dots
//   spinning — whether the globe auto-rotates
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useCallback } from 'react';
import type { GlobeMarker } from '@/lib/types';

// Three.js is loaded from CDN in the HTML prototype, but here we npm import it.
import * as THREE from 'three';

const MARKER_COLORS: Record<string, number> = {
  quake:    0xff6633,
  disaster: 0xffaa00,
  conflict: 0xff3355,
  economy:  0x00d4ff,
  health:   0x00ff88,
};

interface GlobeProps {
  markers:  GlobeMarker[];
  spinning: boolean;
}

export default function Globe({ markers, spinning }: GlobeProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const stateRef    = useRef({
    scene:    null as THREE.Scene    | null,
    camera:   null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    earth:    null as THREE.Mesh    | null,
    markerGrp:null as THREE.Group   | null,
    pulseGrp: null as THREE.Group   | null,
    animId:   0,
    drag:     false,
    lastX:    0,
    lastY:    0,
    rotX:     0,
    rotY:     0,
  });

  // Convert lat/lng to unit-sphere XYZ
  const latLngToVec3 = (lat: number, lng: number, r = 1.01): THREE.Vector3 => {
    const phi   = (90 - lat)  * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(Math.sin(phi) * Math.cos(theta)) * r,
       Math.cos(phi)                     * r,
       Math.sin(phi) * Math.sin(theta)   * r,
    );
  };

  const buildScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;

    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    // ── Renderer ────────────────────────────────────────────────────────────
    s.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    s.renderer.setSize(W, H, false);
    s.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── Scene + camera ───────────────────────────────────────────────────────
    s.scene  = new THREE.Scene();
    s.camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
    s.camera.position.z = 2.55;

    // ── Stars ────────────────────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(6000);
    for (let i = 0; i < 6000; i++) starPos[i] = (Math.random() - 0.5) * 400;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    s.scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18 })));

    // ── Earth sphere ─────────────────────────────────────────────────────────
    const earthGeo = new THREE.SphereGeometry(1, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color:     0x0a1d38,
      emissive:  0x071428,
      specular:  0x00d4ff,
      shininess: 12,
      wireframe: false,
    });
    s.earth = new THREE.Mesh(earthGeo, earthMat);
    s.scene.add(s.earth);

    // ── Grid wireframe overlay ───────────────────────────────────────────────
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.06 });
    s.scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.001, 24, 24), gridMat));

    // ── Atmosphere glow (two layers) ─────────────────────────────────────────
    [[1.08, 0x00d4ff, 0.04], [1.18, 0x0044aa, 0.015]].forEach(([r, c, o]) => {
      const g = new THREE.SphereGeometry(r as number, 32, 32);
      const m = new THREE.MeshBasicMaterial({ color: c as number, transparent: true, opacity: o as number, side: THREE.BackSide });
      s.scene.add(new THREE.Mesh(g, m));
    });

    // ── Lighting ─────────────────────────────────────────────────────────────
    s.scene.add(new THREE.AmbientLight(0x112244, 1.2));
    const sun = new THREE.DirectionalLight(0x00d4ff, 0.6);
    sun.position.set(5, 3, 5);
    s.scene.add(sun);

    // ── Marker + pulse groups ────────────────────────────────────────────────
    s.markerGrp = new THREE.Group();
    s.pulseGrp  = new THREE.Group();
    s.earth.add(s.markerGrp);
    s.earth.add(s.pulseGrp);
  }, []);

  // Build markers from props
  const rebuildMarkers = useCallback((markers: GlobeMarker[]) => {
    const s = stateRef.current;
    if (!s.markerGrp || !s.pulseGrp) return;
    s.markerGrp.clear();
    s.pulseGrp.clear();

    markers.forEach((m) => {
      const color = MARKER_COLORS[m.type] ?? 0x00d4ff;
      const pos   = latLngToVec3(m.lat, m.lng);

      // Dot
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(0.012 + (m.magnitude ?? 1) * 0.003, 8),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
      );
      dot.position.copy(pos);
      dot.lookAt(new THREE.Vector3(0, 0, 0));
      dot.userData = m;
      s.markerGrp!.add(dot);

      // Pulse ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.015, 0.025, 16),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
      );
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      ring.userData = { birth: Date.now() };
      s.pulseGrp!.add(ring);
    });
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const s = stateRef.current;
    s.animId = requestAnimationFrame(animate);
    if (!s.renderer || !s.scene || !s.camera || !s.earth) return;

    if (spinning && !s.drag) {
      s.earth.rotation.y += 0.0015;
    }

    // Animate pulse rings — scale up then remove
    if (s.pulseGrp) {
      const now = Date.now();
      s.pulseGrp.children.slice().forEach((ring) => {
        const age = (now - (ring.userData.birth ?? now)) / 1800;
        if (age > 1) {
          ring.userData.birth = now;   // restart
          const m = ring.material as THREE.MeshBasicMaterial;
          m.opacity = 0.7;
          ring.scale.setScalar(1);
        } else {
          ring.scale.setScalar(1 + age * 2);
          const m = ring.material as THREE.MeshBasicMaterial;
          m.opacity = 0.7 * (1 - age);
        }
      });
    }

    s.renderer.render(s.scene, s.camera);
  }, [spinning]);

  // Mouse / touch drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const s     = stateRef.current;
    s.drag      = true;
    s.lastX     = e.clientX;
    s.lastY     = e.clientY;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.drag || !s.earth) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.earth.rotation.y += dx * 0.005;
    s.earth.rotation.x += dy * 0.005;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
  }, []);

  const onPointerUp = useCallback(() => { stateRef.current.drag = false; }, []);

  // Init once
  useEffect(() => {
    buildScene();
    animate();
    const s = stateRef.current;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !s.renderer || !s.camera) return;
      const W = canvas.clientWidth, H = canvas.clientHeight;
      s.renderer.setSize(W, H, false);
      s.camera.aspect = W / H;
      s.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(s.animId);
      window.removeEventListener('resize', handleResize);
      s.renderer?.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers when data changes
  useEffect(() => {
    rebuildMarkers(markers);
  }, [markers, rebuildMarkers]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  );
}
