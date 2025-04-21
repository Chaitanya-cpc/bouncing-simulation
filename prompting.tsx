"use client"

import React, { useEffect, useRef, useState } from "react"
import { useSettings } from './context/SettingsContext'
import { PIXEL_MAP } from './utils/pixelMap'

// Constants for spacing
const LETTER_SPACING = 1
const WORD_SPACING = 3

// Interfaces for type safety
interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
}

// Add logging for ball events
const logBallEvent = (message: string) => {
  // Check if the logger is available
  if (typeof window !== 'undefined' && (window as any).actionLogger) {
    (window as any).actionLogger.addLog(message);
  }
};

export function PromptingIsAllYouNeed({ 
  isEmbedded = false 
}: { 
  isEmbedded?: boolean 
}) {
  const { settings } = useSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 })
  const paddleRef = useRef<Paddle | null>(null)
  const scaleRef = useRef(1)
  const isZoomingRef = useRef(false)
  // Game states: 'idle', 'playing', 'gameOver'
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle')
  const [score, setScore] = useState(0)
  const [lastScore, setLastScore] = useState(0)

  // Only log events if not embedded
  const logBallEventIfNotEmbedded = (message: string) => {
    if (isEmbedded) return; // Skip logging when embedded
    logBallEvent(message);
  };

  // Handle keyboard shortcuts for zoom to prevent game reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for cmd/ctrl + '+' or '-' (zoom shortcuts)
      if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '-' || e.key === '+')) {
        isZoomingRef.current = true;
        // We don't prevent default as we want the browser to zoom
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '-' || e.key === '+')) {
        // Set a small timeout to let the zoom finish before enabling resize handler
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Mouse move handler for paddle
    const handleMouseMove = (e: MouseEvent) => {
      if (!paddleRef.current) return
      if (gameState !== 'playing') return
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      // Clamp paddle within canvas
      paddleRef.current.x = Math.max(0, Math.min(mouseX - paddleRef.current.width / 2, canvas.width - paddleRef.current.width))
    }

    const resizeCanvas = () => {
      if (isZoomingRef.current) return;
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000)
      initializeGame()
    }

    const initializeGame = () => {
      const scale = scaleRef.current
      const LARGE_PIXEL_SIZE = 8 * scale
      const SMALL_PIXEL_SIZE = 4 * scale
      const BALL_SPEED = settings.ballSpeed * scale
      pixelsRef.current = []
      const words = [settings.text.line1, settings.text.line2]

      const calculateWordWidth = (word: string, pixelSize: number) => {
        return (
          word.split("").reduce((width, letter) => {
            const letterWidth = PIXEL_MAP[letter]?.length ?? 0
            return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
          }, 0) -
          LETTER_SPACING * pixelSize
        )
      }

      const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE)
      const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
        return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0)
      }, 0)
      const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
      const scaleFactor = (canvas.width * 0.8) / totalWidth

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

      const largeTextHeight = 5 * adjustedLargePixelSize
      const smallTextHeight = 5 * adjustedSmallPixelSize
      const spaceBetweenLines = 5 * adjustedLargePixelSize
      const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

      let startY = (canvas.height - totalTextHeight) / 2

      words.forEach((word, wordIndex) => {
        const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize
        const totalWidth =
          wordIndex === 0
            ? calculateWordWidth(word, adjustedLargePixelSize)
            : words[1].split(" ").reduce((width, w, index) => {
                return (
                  width +
                  calculateWordWidth(w, adjustedSmallPixelSize) +
                  (index > 0 ? WORD_SPACING * adjustedSmallPixelSize : 0)
                )
              }, 0)

        let startX = (canvas.width - totalWidth) / 2

        if (wordIndex === 1) {
          word.split(" ").forEach((subWord) => {
            subWord.split("").forEach((letter) => {
              const pixelMap = PIXEL_MAP[letter]
              if (!pixelMap) return

              for (let i = 0; i < pixelMap.length; i++) {
                for (let j = 0; j < pixelMap[i].length; j++) {
                  if (pixelMap[i][j]) {
                    const x = startX + j * pixelSize
                    const y = startY + i * pixelSize
                    pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
                  }
                }
              }
              startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
            })
            startX += WORD_SPACING * adjustedSmallPixelSize
          })
        } else {
          word.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter]
            if (!pixelMap) return

            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < pixelMap[i].length; j++) {
                if (pixelMap[i][j]) {
                  const x = startX + j * pixelSize
                  const y = startY + i * pixelSize
                  pixelsRef.current.push({ x, y, size: pixelSize, hit: false })
                }
              }
            }
            startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
          })
        }
        startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0
      })

      // Initialize ball position near the top center
      const ballStartX = canvas.width / 2
      const ballStartY = canvas.height * 0.2
      ballRef.current = {
        x: ballStartX,
        y: ballStartY,
        dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        dy: BALL_SPEED,
        radius: LARGE_PIXEL_SIZE / 2,
      }
      // Single bottom paddle
      const paddleWidth = 10 * LARGE_PIXEL_SIZE
      const paddleHeight = LARGE_PIXEL_SIZE
      paddleRef.current = {
        x: (canvas.width - paddleWidth) / 2,
        y: canvas.height - paddleHeight * 2,
        width: paddleWidth,
        height: paddleHeight,
        targetY: 0,
        isVertical: false,
      }
    }

    const startGame = () => {
      initializeGame()
      setScore(0)
      setGameState('playing')
    }

    const updateGame = () => {
      if (gameState !== 'playing') return
      const ball = ballRef.current
      const paddle = paddleRef.current
      if (!paddle) return
      ball.x += ball.dx
      ball.y += ball.dy
      // Wall collisions (top, left, right)
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy
        ball.y = ball.radius
        logBallEventIfNotEmbedded(`Ball hit top wall`);
      }
      if (ball.x - ball.radius < 0) {
        ball.dx = -ball.dx
        ball.x = ball.radius
        logBallEventIfNotEmbedded(`Ball hit left wall`);
      }
      if (ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx
        ball.x = canvas.width - ball.radius
        logBallEventIfNotEmbedded(`Ball hit right wall`);
      }
      // Paddle collision (bottom paddle only)
      if (
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.dy > 0
      ) {
        ball.dy = -ball.dy
        // Optional: add some angle based on where it hits the paddle
        const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2)
        ball.dx += hitPos * 0.5 * settings.ballSpeed
        setScore((prev) => prev + 1)
        logBallEventIfNotEmbedded(`Ball hit bottom paddle`);
      }
      // Game over if ball touches bottom
      if (ball.y - ball.radius > canvas.height) {
        setGameState('gameOver')
        setLastScore(score)
        logBallEventIfNotEmbedded(`Game Over: Ball missed paddle`);
      }
      // Pixel collisions (unchanged)
      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true
          logBallEventIfNotEmbedded(`Ball hit pixel at position (${Math.floor(pixel.x)}, ${Math.floor(pixel.y)})`);
          const centerX = pixel.x + pixel.size / 2
          const centerY = pixel.y + pixel.size / 2
          if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
            ball.dx = -ball.dx
          } else {
            ball.dy = -ball.dy
          }
        }
      });
    }

    const drawGame = () => {
      if (!ctx) return
      ctx.fillStyle = settings.colors.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? settings.colors.hit : settings.colors.main
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })
      ctx.fillStyle = settings.colors.ball
      ctx.beginPath()
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2)
      ctx.fill()
      // Draw bottom paddle
      if (paddleRef.current) {
        ctx.fillStyle = settings.colors.paddle
        ctx.fillRect(paddleRef.current.x, paddleRef.current.y, paddleRef.current.width, paddleRef.current.height)
      }
      // Draw score (top left)
      ctx.font = `bold 24px Arial, sans-serif`
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'left'
      ctx.fillText(`Score: ${score}`, 24, 40)
    }

    let animationId: number
    const gameLoop = () => {
      updateGame()
      drawGame()
      if (gameState === 'playing') {
        animationId = requestAnimationFrame(gameLoop)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    canvas.addEventListener("mousemove", handleMouseMove)
    if (gameState === 'playing') {
      gameLoop()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [settings, isEmbedded, gameState, score])

  // UI overlays for game state
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        aria-label="Interactive Animation"
        style={{ zIndex: 1 }}
      />
      {/* Overlay UI */}
      {gameState === 'idle' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
          <h1 style={{ color: '#fff', fontSize: 48, marginBottom: 24 }}>NameBounce Game</h1>
          <button onClick={() => { setScore(0); setGameState('playing'); }} style={{ fontSize: 24, padding: '16px 48px', borderRadius: 8, background: '#08a281', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 16 }}>Start Game</button>
          <div style={{ color: '#fff', fontSize: 20, marginTop: 16, opacity: 0.8 }}>Move your mouse left/right to control the paddle.<br/>Keep the ball from falling!</div>
        </div>
      )}
      {gameState === 'gameOver' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
          <h1 style={{ color: '#fff', fontSize: 48, marginBottom: 24 }}>Game Over</h1>
          <div style={{ color: '#fff', fontSize: 32, marginBottom: 16 }}>Final Score: {lastScore}</div>
          <button onClick={() => { setScore(0); setGameState('playing'); }} style={{ fontSize: 24, padding: '16px 48px', borderRadius: 8, background: '#08a281', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 16 }}>Restart</button>
          <button onClick={() => setGameState('idle')} style={{ fontSize: 18, padding: '10px 32px', borderRadius: 8, background: '#073779', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8 }}>Back to Menu</button>
        </div>
      )}
    </div>
  )
}

export default PromptingIsAllYouNeed
