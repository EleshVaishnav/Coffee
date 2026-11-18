import React, { useState, useRef, useEffect } from 'react';
import { X, Disc } from 'lucide-react';
import confetti from 'canvas-confetti';

const ANTHROPIC_PALETTE = [
  '#D46238', // Terracotta
  '#3D7A5A', // Sage
  '#D97706', // Honey / Ochre
  '#8C8273', // Warm Stone
  '#6366F1', // Indigo Slate
  '#C1532B', // Burnt Orange
  '#4E9A70', // Olive
  '#A05A48', // Clay
  '#55514B', // Charcoal Warm
  '#D99B6A', // Sand
];

export default function SpinWheelModal({
  isOpen,
  onClose,
  pendingMembers,
  onSelectWinner,
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const canvasRef = useRef(null);
  const currentRotation = useRef(0);

  const candidates = pendingMembers.length > 0 ? pendingMembers : [];

  useEffect(() => {
    if (!isOpen || candidates.length === 0) return;
    drawWheel(currentRotation.current);
  }, [isOpen, candidates]);

  const drawWheel = (angle) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const arcSize = (2 * Math.PI) / candidates.length;

    candidates.forEach((member, i) => {
      const sliceAngle = angle + i * arcSize;

      // Draw Slice
      ctx.beginPath();
      ctx.fillStyle = ANTHROPIC_PALETTE[i % ANTHROPIC_PALETTE.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sliceAngle, sliceAngle + arcSize);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FAF8F5';
      ctx.stroke();

      // Draw Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(sliceAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
      const displayName = member.name.length > 13 ? member.name.substring(0, 12) + '…' : member.name;
      ctx.fillText(displayName, radius - 24, 4);
      ctx.restore();
    });

    // Center pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#FAF8F5';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#D46238';
    ctx.stroke();

    ctx.fillStyle = '#1F1E1D';
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☕', centerX, centerY);
  };

  const handleSpin = () => {
    if (isSpinning || candidates.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    const extraSpins = 6 + Math.random() * 4;
    const randomStop = Math.random() * (2 * Math.PI);
    const targetRotation = currentRotation.current + extraSpins * 2 * Math.PI + randomStop;

    const startTime = performance.now();
    const duration = 4000;
    const startRot = currentRotation.current;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startRot + (targetRotation - startRot) * ease;

      currentRotation.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const arcSize = (2 * Math.PI) / candidates.length;
        const pointerAngle = (3 * Math.PI) / 2;
        let relativeAngle = (pointerAngle - normalizedAngle) % (2 * Math.PI);
        if (relativeAngle < 0) relativeAngle += 2 * Math.PI;

        const winningIndex = Math.floor(relativeAngle / arcSize) % candidates.length;
        const chosen = candidates[winningIndex];
        setWinner(chosen);

        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D46238', '#E8A87C', '#3D7A5A', '#B0A595'],
        });
      }
    };

    requestAnimationFrame(animate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-500/60 backdrop-blur-sm">
      <div className="bg-parchment-100 dark:bg-obsidian-200 border border-parchment-300 dark:border-obsidian-100 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-warm-lg relative text-center transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-parchment-500 hover:text-parchment-800 dark:text-parchment-400 dark:hover:text-parchment-100 bg-parchment-200/50 hover:bg-parchment-200 dark:bg-obsidian-100 dark:hover:bg-obsidian-50 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-1">
          <Disc className="w-4 h-4 text-terracotta-500" />
          <h3 className="text-xl font-serif font-normal text-parchment-900 dark:text-parchment-50">
            Candidate Roulette of Destiny
          </h3>
        </div>
        <p className="text-xs text-parchment-600 dark:text-parchment-400 mb-5 leading-relaxed">
          Arbitration mechanism: Resolves deadlock among the {candidates.length} pending fellows.
        </p>

        {candidates.length < 2 ? (
          <div className="py-8 text-parchment-500 font-serif italic text-sm">
            At least two pending candidates are required to convene the roulette.
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Pointer */}
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-terracotta-500 -mb-2 z-10 drop-shadow-sm" />

            {/* Canvas Wheel */}
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="rounded-full shadow-warm-md border-4 border-parchment-200 dark:border-obsidian-100 bg-parchment-50"
            />

            {/* Winner Display */}
            {winner && (
              <div className="mt-5 p-4 rounded-2xl bg-terracotta-50 dark:bg-terracotta-950/40 border border-terracotta-200 dark:border-terracotta-800 w-full animate-in fade-in zoom-in duration-200 flex flex-col items-center">
                {winner.photo ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-terracotta-400 mb-2 shadow-warm-sm">
                    <img src={winner.photo} alt={winner.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-parchment-100 dark:bg-obsidian-200 flex items-center justify-center text-2xl mb-2">
                    {winner.avatar || '☕'}
                  </div>
                )}
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-terracotta-600 dark:text-terracotta-400">
                  Designated Host by Fate
                </span>
                <h4 className="text-xl font-serif font-medium text-parchment-900 dark:text-parchment-50 mt-0.5">
                  {winner.name}
                </h4>
                <p className="text-xs text-parchment-600 dark:text-parchment-300 mt-1">
                  The wheel has spoken. Today's tab at Better Coffee is assigned to {winner.name}.
                </p>
                <button
                  onClick={() => {
                    onSelectWinner(winner.id);
                    onClose();
                  }}
                  className="mt-3 w-full py-2 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs shadow-warm transition-all"
                >
                  Record This Outing Now
                </button>
              </div>
            )}

            {/* Spin Button */}
            {!winner && (
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="mt-5 w-full py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-medium text-xs sm:text-sm shadow-warm transition-all transform active:scale-98 disabled:opacity-50"
              >
                {isSpinning ? 'Executing Rotational Fate...' : 'Spin the Candidate Roulette'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
