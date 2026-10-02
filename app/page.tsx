'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Camera,
  CameraOff,
  ChevronLeft,
  Copy,
  Download,
  FlipHorizontal2,
  Maximize2,
  MicOff,
  Plus,
  RefreshCcw,
  Sparkles,
  Star,
  Video,
  WandSparkles,
  X,
} from 'lucide-react'

type Screen = 'home' | 'room' | 'studio' | 'editor'
type Layout = 'side' | 'polaroid' | 'strip'
type Effect = 'soft' | 'pink' | 'dreamy' | 'bw' | 'vintage'
type Sticker = { id: number; glyph: string; x: number; y: number; size: number }

const stickerSets = [
  { label: 'Stickers', icon: '♡', items: ['♡', '♥', '✦', '★'] },
  { label: 'Sparkles', icon: '✦', items: ['✦', '✧', '⋆', '✩'] },
  { label: 'Bows', icon: '🎀', items: ['🎀', '୨୧', '⌒⌒'] },
  { label: 'Hearts', icon: '♥', items: ['♥', '♡', '❤', '❣'] },
  { label: 'Clouds', icon: '☁', items: ['☁', '☁︎', '☾'] },
  { label: 'Stars', icon: '★', items: ['★', '☆', '✹', '✷'] },
]

function Mascot({ small = false }: { small?: boolean }) {
  return (
    <div className={`mascot ${small ? 'mascot-small' : ''}`} aria-label="Original black bunny mascot" role="img">
      <span className="ear ear-left" /><span className="ear ear-right" />
      <span className="bunny-face"><i className="eye eye-left" /><i className="eye eye-right" /><i className="cheek cheek-left" /><i className="cheek cheek-right" /><b>⌣</b></span>
      <span className="bunny-bow">♡</span>
    </div>
  )
}

function FloatingDecor() {
  return <div className="floating-decor" aria-hidden="true"><span>✦</span><span>♡</span><span>✧</span><span>★</span><span>♡</span><span>✦</span></div>
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>('home')
  const [roomMode, setRoomMode] = useState<'create' | 'join'>('create')
  const [roomCode, setRoomCode] = useState('KURO24')
  const [joinCode, setJoinCode] = useState('')
  const [name, setName] = useState('Mochi')
  const [copied, setCopied] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [layout, setLayout] = useState<Layout>('side')
  const [effect, setEffect] = useState<Effect>('soft')
  const [frame, setFrame] = useState('pink')
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [photoTaken, setPhotoTaken] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraOn(true)
    } catch { setCameraOn(false) }
  }, [])

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), [])

  const createRoom = () => {
    setRoomCode(Math.random().toString(36).slice(2, 8).toUpperCase())
    setRoomMode('create'); setScreen('room'); startCamera()
  }
  const joinRoom = () => { setRoomMode('join'); setScreen('room') }
  const enterStudio = () => { setScreen('studio'); startCamera() }
  const takePhoto = () => {
    setCountdown(3)
    const timer = window.setInterval(() => setCountdown((value) => {
      if (value === null || value <= 1) { window.clearInterval(timer); setTimeout(() => { setCountdown(null); setPhotoTaken(true); setScreen('editor') }, 500); return null }
      return value - 1
    }), 750)
  }
  const addSticker = (glyph: string) => setStickers((current) => [...current, { id: Date.now(), glyph, x: 25 + Math.random() * 50, y: 22 + Math.random() * 55, size: 22 + Math.random() * 18 }])
  const downloadPhoto = () => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = layout === 'strip' ? 1600 : 900
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.fillStyle = frame === 'black' ? '#19151d' : frame === 'lavender' ? '#ded6ff' : frame === 'white' ? '#fff' : '#ffc7db'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f7dfeb'; ctx.fillRect(42, 42, canvas.width - 84, canvas.height - 84)
    ctx.fillStyle = '#b78eb9'; ctx.font = 'bold 42px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('KuroBooth ♡', canvas.width / 2, canvas.height - 24)
    ctx.fillStyle = '#28202d'; ctx.font = 'bold 150px sans-serif'; ctx.fillText('♡', canvas.width * .3, canvas.height * .52); ctx.fillText('✦', canvas.width * .7, canvas.height * .44)
    stickers.forEach((sticker) => { ctx.font = `${sticker.size * 3}px sans-serif`; ctx.fillText(sticker.glyph, canvas.width * sticker.x / 100, canvas.height * sticker.y / 100) })
    const link = document.createElement('a'); link.download = 'kurobooth-memory.png'; link.href = canvas.toDataURL('image/png'); link.click()
  }

  return <main className="app-shell">
    <FloatingDecor />
    <header className="topbar"><button className="brand-button" onClick={() => setScreen('home')}><span className="brand-mark">♡</span><span>KuroBooth</span></button><span className="topbar-note">online photobooth <span>✦</span></span></header>

    {screen === 'home' && <section className="home-screen page-wrap">
      <div className="hero-copy"><div className="eyebrow"><span>♡</span> made for two <span>♡</span></div><h1>KuroBooth <span>♡</span></h1><p>Take cute memories together,<br className="desktop-only" /> wherever you are.</p><div className="hero-actions"><button className="button button-dark" onClick={createRoom}>CREATE ROOM <span>→</span></button><button className="button button-outline" onClick={joinRoom}>JOIN ROOM <span>+</span></button></div><div className="availability"><span className="live-dot" /> ready when you are <span>✦</span></div></div>
      <div className="hero-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="sticker-tag tag-top">besties<br />forever ♡</div><div className="sticker-tag tag-bottom">say cheese!</div><Mascot /><div className="hero-heart">♥</div></div>
      <div className="feature-row"><div><span className="feature-icon pink">♡</span><b>Make memories</b><small>together, apart</small></div><div><span className="feature-icon purple">✦</span><b>Get playful</b><small>with cute stickers</small></div><div><span className="feature-icon black">↓</span><b>Save the moment</b><small>as a keepsake</small></div></div>
    </section>}

    {screen === 'room' && <section className="page-wrap room-screen"><button className="back-link" onClick={() => setScreen('home')}><ChevronLeft size={16} /> back home</button><div className="room-layout"><div className="room-copy"><div className="eyebrow"><span>✦</span> {roomMode === 'create' ? 'your little corner' : 'come on in'} <span>✦</span></div><h2>{roomMode === 'create' ? <>Let&apos;s make<br /><em>memories.</em></> : <>Join the<br /><em>fun.</em></>}</h2><p>{roomMode === 'create' ? 'Create a room and invite your favorite person to your private booth.' : 'Enter the secret code your friend sent you to step inside.'}</p>{roomMode === 'create' ? <div className="code-card"><label>YOUR ROOM CODE</label><div className="room-code">{roomCode}</div><button className="copy-button" onClick={() => { navigator.clipboard?.writeText(roomCode); setCopied(true); setTimeout(() => setCopied(false), 1500) }}><Copy size={15} /> {copied ? 'COPIED!' : 'COPY ROOM CODE'}</button><small>Send this code to your friend <span>♡</span></small></div> : <div className="join-card"><label>ROOM CODE</label><input autoFocus maxLength={6} value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123" /><label className="name-label">YOUR NAME</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mochi" /><button className="button button-dark full" onClick={enterStudio}>JOIN THE ROOM <span>→</span></button></div>}<button className="text-switch" onClick={() => setRoomMode(roomMode === 'create' ? 'join' : 'create')}>{roomMode === 'create' ? 'Have a code? Join a room instead' : 'Want to host? Create a room instead'} <span>→</span></button></div><div className="room-preview"><div className="preview-window"><div className="preview-top"><span className="camera-status"><span className="live-dot" /> camera preview</span><span>♡</span></div><video ref={videoRef} autoPlay muted playsInline className={cameraOn ? 'video-live' : ''} /><div className="preview-placeholder"><Mascot small /><span>{cameraOn ? 'looking cute!' : 'your camera will appear here'}</span></div><div className="preview-actions"><button onClick={() => cameraOn ? (streamRef.current?.getTracks().forEach((t) => t.stop()), setCameraOn(false)) : startCamera()}>{cameraOn ? <CameraOff size={16} /> : <Camera size={16} />} {cameraOn ? 'TURN OFF' : 'TURN ON CAMERA'}</button><button><Maximize2 size={16} /></button></div></div><div className="room-doodle">✦ made with a little magic ✦</div></div></div></section>}

    {screen === 'studio' && <section className="page-wrap studio-screen"><div className="studio-heading"><div><button className="back-link" onClick={() => setScreen('room')}><ChevronLeft size={16} /> room {roomCode}</button><h2>Ready when <em>you are.</em></h2></div><div className="connected-pill"><span className="live-dot" /> waiting for your friend</div></div><div className="camera-grid"><div className="camera-card local"><div className="camera-label"><span><span className="avatar-dot">M</span>{name}</span><span className="you-label">YOU</span></div><video ref={videoRef} autoPlay muted playsInline className={cameraOn ? 'video-live' : ''} /><div className="preview-placeholder"><Mascot small /><span>{cameraOn ? 'looking cute!' : 'camera is off'}</span></div></div><div className="camera-card friend"><div className="camera-label"><span><span className="avatar-dot friend-dot">♡</span>your friend</span><span className="waiting-label">INVITE SENT</span></div><div className="friend-placeholder"><span className="friend-heart">♡</span><b>waiting for them to join</b><small>share your room code</small><strong>{roomCode}</strong></div></div></div><div className="studio-controls"><button className="control-button" onClick={() => setCameraOn(!cameraOn)}>{cameraOn ? <CameraOff /> : <Camera />}<small>{cameraOn ? 'camera off' : 'camera on'}</small></button><button className="control-button"><MicOff /><small>mic off</small></button><button className="control-button"><FlipHorizontal2 /><small>flip camera</small></button><button className="control-button"><Maximize2 /><small>fullscreen</small></button></div><div className="take-area"><div className="layout-select"><span>PHOTO LAYOUT</span><button className={layout === 'side' ? 'selected' : ''} onClick={() => setLayout('side')}>SIDE BY SIDE</button><button className={layout === 'polaroid' ? 'selected' : ''} onClick={() => setLayout('polaroid')}>POLAROID</button><button className={layout === 'strip' ? 'selected' : ''} onClick={() => setLayout('strip')}>PHOTO STRIP</button></div><button className="shutter" onClick={takePhoto}><span>♡</span> TAKE PHOTO <span>♡</span></button></div>{countdown !== null && <div className="countdown-overlay"><div>{countdown === 0 ? '♡ CHEESE! ♡' : countdown}</div></div>}</section>}

    {screen === 'editor' && (
      <section className="page-wrap editor-screen">
        <div className="editor-heading"><div><button className="back-link" onClick={() => setScreen('studio')}><ChevronLeft size={16} /> take again</button><h2>Your little <em>masterpiece.</em></h2></div><div className="editor-actions"><button className="button button-outline" onClick={() => setScreen('studio')}><RefreshCcw size={15} /> TAKE AGAIN</button><button className="button button-dark" onClick={downloadPhoto}><Download size={15} /> DOWNLOAD PHOTO</button></div></div>
        <div className="editor-layout">
          <div className={`photo-canvas frame-${frame} effect-${effect} layout-${layout}`}><div className="photo-fill photo-one">{cameraOn && <video ref={videoRef} autoPlay muted playsInline className="editor-video" />}<span>♡</span></div>{layout !== 'side' && <div className="photo-fill photo-two"><span>✦</span></div>}{layout === 'strip' && <><div className="photo-fill photo-three"><span>♡</span></div><div className="photo-fill photo-four"><span>✦</span></div></>}<div className="canvas-brand">KuroBooth ♡</div>{stickers.map((sticker) => <button key={sticker.id} className="placed-sticker" style={{ left: `${sticker.x}%`, top: `${sticker.y}%`, fontSize: sticker.size }} onClick={() => setStickers((items) => items.filter((item) => item.id !== sticker.id))}>{sticker.glyph}</button>)}</div>
          <aside className="edit-panel"><div className="panel-section"><h3><WandSparkles size={16} /> decorate</h3><div className="sticker-tabs">{stickerSets.map((set) => <button key={set.label} onClick={() => addSticker(set.items[0])}><span>{set.icon}</span><small>{set.label}</small></button>)}</div><div className="sticker-picker">{stickerSets.flatMap((set) => set.items).map((glyph, index) => <button key={`${glyph}-${index}`} onClick={() => addSticker(glyph)}>{glyph}</button>)}</div></div><div className="panel-section"><h3><Sparkles size={16} /> effect</h3><div className="choice-row">{(['soft', 'pink', 'dreamy', 'bw', 'vintage'] as Effect[]).map((item) => <button key={item} className={effect === item ? 'active' : ''} onClick={() => setEffect(item)}>{item}</button>)}</div></div><div className="panel-section"><h3><Star size={16} /> frame</h3><div className="frame-row">{['pink', 'lavender', 'black', 'white', 'candy'].map((item) => <button key={item} aria-label={`${item} frame`} className={`frame-swatch swatch-${item} ${frame === item ? 'active' : ''}`} onClick={() => setFrame(item)} />)}</div></div><p className="tip"><span>✦</span> tap a sticker on your photo to remove it</p></aside>
        </div>
      </section>
    )}

    <footer className="site-footer"><span>KUROBOOTH 2024</span><span>private little moments <b>♡</b></span><span>made for two <b>✦</b></span></footer>
  </main>
}
