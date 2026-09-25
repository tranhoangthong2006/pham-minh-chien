import React, { useEffect, useRef } from 'react';

interface FloatingElement {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayRange: number;
  swayAngle: number;
  rotation: number;
  rotSpeed: number;
  flipAngle: number;
  flipSpeed: number;
  alpha: number;
  baseAlpha: number;
  type: 'flower' | 'petal' | 'pollen';
  petalsCount?: number;
  colorScheme: {
    petal1: string;
    petal2: string;
    center: string;
    glow: string;
  };
}

export function LuxuryAmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isTabVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Bảng màu hoa lụa & hoa đào mùa xuân cao cấp
    const colorPalettes = [
      {
        petal1: 'rgba(244, 63, 94,',   // Rose Silk
        petal2: 'rgba(253, 164, 175,', // Soft Sakura Pink
        center: 'rgba(245, 158, 11,',  // Gold Pistil
        glow: 'rgba(244, 63, 94,',
      },
      {
        petal1: 'rgba(251, 113, 133,', // Coral Blush
        petal2: 'rgba(254, 205, 211,', // Champagne Rose
        center: 'rgba(251, 191, 36,',  // Amber Gold
        glow: 'rgba(251, 113, 133,',
      },
      {
        petal1: 'rgba(225, 29, 72,',   // Velvet Camellia
        petal2: 'rgba(251, 113, 133,', // Deep Blossom
        center: 'rgba(252, 211, 77,',  // Bright Stamen
        glow: 'rgba(225, 29, 72,',
      },
      {
        petal1: 'rgba(245, 158, 11,',  // Champagne Gold
        petal2: 'rgba(254, 243, 199,', // Cream Petal
        center: 'rgba(225, 29, 72,',   // Rose Center
        glow: 'rgba(245, 158, 11,',
      },
    ];

    // Số lượng hoa và cánh hoa cân đối hoàn hảo
    const ELEMENT_COUNT = Math.min(width < 768 ? 24 : 42, 48);

    const createFloatingElement = (initialY?: number): FloatingElement => {
      const rand = Math.random();
      let type: 'flower' | 'petal' | 'pollen';
      if (rand < 0.40) {
        type = 'flower'; // 40% Đóa hoa nở rộ trọn vẹn trôi bồng bềnh
      } else if (rand < 0.88) {
        type = 'petal'; // 48% Cánh hoa bay lượn rơi chầm chậm
      } else {
        type = 'pollen'; // 12% Hạt phấn hoa ánh kim
      }

      const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      
      // Kích thước chuẩn thị giác
      let size: number;
      if (type === 'flower') {
        size = Math.random() * 12 + 12; // 12px - 24px (đóa hoa rõ nét)
      } else if (type === 'petal') {
        size = Math.random() * 8 + 8;  // 8px - 16px (cánh hoa bay)
      } else {
        size = Math.random() * 2 + 1.2; // 1.2px - 3.2px (hạt phấn hoa)
      }

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size,
        speedY: type === 'flower' 
          ? Math.random() * 0.14 + 0.08  // Đóa hoa lơ lửng, rơi cực kỳ chậm rãi
          : type === 'petal'
          ? Math.random() * 0.18 + 0.12  // Cánh hoa rơi chầm chậm, lượn êm
          : Math.random() * 0.10 + 0.06, // Phấn hoa bay nhẹ
        speedX: (Math.random() - 0.5) * 0.08,
        swaySpeed: Math.random() * 0.007 + 0.003, // Đung đưa rất chậm và tự nhiên
        swayRange: Math.random() * 25 + 15,
        swayAngle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.004, // Xoay chậm nhẹ
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1), // Lật cánh 3D từ tốn
        alpha: Math.random() * 0.35 + 0.45,
        baseAlpha: Math.random() * 0.35 + 0.45,
        type,
        petalsCount: Math.random() > 0.3 ? 5 : 6,
        colorScheme: palette,
      };
    };

    const elements: FloatingElement[] = Array.from({ length: ELEMENT_COUNT }, () => createFloatingElement());

    let mouseX = -1000;
    let mouseY = -1000;
    let smoothMouseX = -1000;
    let smoothMouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX - 225}px, ${e.clientY - 225}px, 0)`;
        spotlightRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Tự động tạm dừng animation khi người dùng chuyển tab để tiết kiệm 100% CPU/Pin
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 1. Hàm vẽ Đóa Hoa Nở Rộ 5-6 Cánh Mềm Mại với Chi Tiết Tự Nhiên
    const drawBloomingFlower = (el: FloatingElement) => {
      const { x, y, size, rotation, flipAngle, alpha, colorScheme, petalsCount = 5 } = el;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Độ nghiêng 3D lượn sóng nhẹ nhàng
      const flipScaleY = Math.abs(Math.cos(flipAngle)) * 0.45 + 0.55;
      ctx.scale(1, flipScaleY);

      const petalAngleStep = (Math.PI * 2) / petalsCount;

      // Hào quang dịu dàng quanh đóa hoa
      const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
      auraGrad.addColorStop(0, `${colorScheme.glow} ${alpha * 0.22})`);
      auraGrad.addColorStop(1, `${colorScheme.glow} 0)`);
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Vẽ các cánh hoa nhiều lớp xếp tầng
      for (let i = 0; i < petalsCount; i++) {
        const angle = i * petalAngleStep;
        ctx.save();
        ctx.rotate(angle);

        // Lớp gradient chuyển màu cánh hoa từ cuống ra mép
        const petalGrad = ctx.createLinearGradient(0, 0, 0, -size);
        petalGrad.addColorStop(0, `${colorScheme.petal1} ${alpha * 0.95})`);
        petalGrad.addColorStop(0.65, `${colorScheme.petal2} ${alpha * 0.85})`);
        petalGrad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.7})`);

        ctx.fillStyle = petalGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Đường cong cánh hoa mềm mại
        ctx.bezierCurveTo(-size * 0.52, -size * 0.35, -size * 0.48, -size * 0.88, 0, -size);
        ctx.bezierCurveTo(size * 0.48, -size * 0.88, size * 0.52, -size * 0.35, 0, 0);
        ctx.closePath();
        ctx.fill();

        // Gân cánh hoa mảnh nhẹ
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(size * 0.05, -size * 0.5, 0, -size * 0.8);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.restore();
      }

      // Tâm hoa & Nhụy vàng óng ánh (Golden Stamen & Pistil)
      const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.32);
      centerGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.98})`);
      centerGrad.addColorStop(0.45, `${colorScheme.center} ${alpha * 0.92})`);
      centerGrad.addColorStop(1, `${colorScheme.petal1} ${alpha * 0.4})`);

      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Các chấm nhụy hoa nhỏ li ti xung quanh
      for (let s = 0; s < 5; s++) {
        const sAngle = (s * Math.PI * 2) / 5;
        const sx = Math.cos(sAngle) * (size * 0.16);
        const sy = Math.sin(sAngle) * (size * 0.16);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // 2. Hàm vẽ Cánh Hoa Rơi Uốn Lượn 3D Tự Nhiên (Falling Petal)
    const drawFloatingPetal = (el: FloatingElement) => {
      const { x, y, size, rotation, flipAngle, alpha, colorScheme } = el;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Hiệu ứng lật cánh hoa 3D mềm mại
      const flipScale = Math.cos(flipAngle);
      ctx.scale(flipScale, 1);

      const petalGrad = ctx.createLinearGradient(-size * 0.5, -size, size * 0.5, size);
      petalGrad.addColorStop(0, `${colorScheme.petal1} ${alpha * 0.9})`);
      petalGrad.addColorStop(0.6, `${colorScheme.petal2} ${alpha * 0.8})`);
      petalGrad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.65})`);

      ctx.fillStyle = petalGrad;
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.15);
      ctx.bezierCurveTo(size * 0.75, -size * 0.6, size * 0.65, size * 0.7, 0, size);
      ctx.bezierCurveTo(-size * 0.65, size * 0.7, -size * 0.75, -size * 0.6, 0, -size * 1.15);
      ctx.closePath();
      ctx.fill();

      // Đường gân cánh hoa chính
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.9);
      ctx.quadraticCurveTo(size * 0.08, 0, 0, size * 0.7);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.restore();
    };

    // 3. Hàm vẽ Hạt Phấn Hoa Ánh Kim Phát Sáng (Golden Pollen)
    const drawPollen = (el: FloatingElement) => {
      const { x, y, size, alpha, colorScheme } = el;
      ctx.save();

      const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.8);
      glowGrad.addColorStop(0, `${colorScheme.center} ${alpha * 0.95})`);
      glowGrad.addColorStop(1, `${colorScheme.glow} 0)`);

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.98})`;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      if (!isTabVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Cập nhật vị trí trỏ chuột mượt mà (Tạo làn gió đẩy nhẹ hoa)
      if (mouseX > 0 && mouseY > 0) {
        if (smoothMouseX === -1000) {
          smoothMouseX = mouseX;
          smoothMouseY = mouseY;
        } else {
          smoothMouseX += (mouseX - smoothMouseX) * 0.12;
          smoothMouseY += (mouseY - smoothMouseY) * 0.12;
        }
      }

      // Cập nhật và kết xuất từng phần tử hoa & cánh hoa
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];

        el.swayAngle += el.swaySpeed;
        const swayX = Math.sin(el.swayAngle) * (el.swayRange * 0.025);
        el.x += el.speedX + swayX;
        el.y += el.speedY;

        el.rotation += el.rotSpeed;
        el.flipAngle += el.flipSpeed;

        // Lực gió nhẹ từ trỏ chuột
        if (smoothMouseX > 0 && smoothMouseY > 0) {
          const dx = smoothMouseX - el.x;
          const dy = smoothMouseY - el.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = ((150 - dist) / 150) * 0.55;
            el.x -= (dx / dist) * force;
            el.y -= (dy / dist) * force * 0.4;
          }
        }

        // Tái tạo lại hoa khi rơi hết màn hình
        if (el.y > height + 40) {
          Object.assign(el, createFloatingElement(-40));
        }
        if (el.x < -40) el.x = width + 40;
        if (el.x > width + 40) el.x = -40;

        if (el.type === 'flower') {
          drawBloomingFlower(el);
        } else if (el.type === 'petal') {
          drawFloatingPetal(el);
        } else {
          drawPollen(el);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. LỚP VÂN LƯỚI TẠP CHÍ CAO CẤP */}
      <div 
        className="absolute inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(225, 29, 72, 0.08) 1px, transparent 0),
            linear-gradient(to right, rgba(245, 158, 11, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(225, 29, 72, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 120px 120px, 120px 120px',
        }}
      />

      {/* 2. CÁC QUẦNG SÁNG AURORA LỤA MỀM MẠI CỐ ĐỊNH NHẸ NHÀNG */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-300/20 via-amber-300/12 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] -left-44 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-rose-500/15 via-rose-300/8 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[60%] right-[5%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-amber-400/14 via-rose-400/8 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 left-[15%] w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-rose-600/14 via-amber-300/10 to-transparent blur-[150px] pointer-events-none" />

      {/* 3. VÙNG HÀO QUANG THEO DẤU CHUỘT (CẬP NHẬT TRỰC TIẾP QUA TRANSFORM KHÔNG GÂY RE-RENDER) */}
      <div 
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-radial from-rose-300/15 via-amber-300/10 to-transparent blur-[90px] opacity-0 pointer-events-none will-change-transform transition-opacity duration-300"
      />

      {/* 4. CANVAS ĐÓA HOA NỞ RỘ VÀ CÁNH HOA LƠ LỬNG 60 FPS */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 5. ĐƯỜNG CHỈ VIỀN VÂN METALLIC ĐẦU TRANG */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-300/60 to-transparent shadow-sm shadow-rose-400/20" />
    </div>
  );
}


