"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import EmbeddableAnimation from '../../components/EmbeddableAnimation'

export default function EmbedPage() {
  const searchParams = useSearchParams()
  
  // Parse all possible parameters from URL query params
  const text1 = searchParams.get('text1') || undefined;
  const text2 = searchParams.get('text2') || undefined;
  const mainColor = searchParams.get('mainColor') || undefined;
  const hitColor = searchParams.get('hitColor') || undefined;
  const ballColor = searchParams.get('ballColor') || undefined;
  const paddleColor = searchParams.get('paddleColor') || undefined;
  const backgroundColor = searchParams.get('backgroundColor') || undefined;
  const ballSpeed = searchParams.get('ballSpeed') ? parseFloat(searchParams.get('ballSpeed')!) : undefined;
  const width = searchParams.get('width') || '100%';
  const height = searchParams.get('height') || '100vh';
  const showBorder = searchParams.get('showBorder') !== 'false';

  return (
    <div className="w-full h-full">
      <EmbeddableAnimation
        text1={text1}
        text2={text2}
        mainColor={mainColor}
        hitColor={hitColor}
        ballColor={ballColor}
        paddleColor={paddleColor}
        backgroundColor={backgroundColor}
        ballSpeed={ballSpeed}
        width={width}
        height={height}
        showBorder={showBorder}
      />
    </div>
  )
} 