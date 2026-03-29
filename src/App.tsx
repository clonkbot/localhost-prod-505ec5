import { useState, useEffect } from 'react'

function TerminalLine({ children, delay = 0, typing = false }: { children: React.ReactNode; delay?: number; typing?: boolean }) {
  const [visible, setVisible] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const text = typeof children === 'string' ? children : ''

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (visible && typing && text) {
      let i = 0
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    }
  }, [visible, typing, text])

  if (!visible) return null

  return (
    <div className="terminal-line opacity-0 animate-fadeIn" style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}>
      {typing ? displayText : children}
      {typing && displayText.length < text.length && <span className="animate-blink">_</span>}
    </div>
  )
}

function FakeProgress() {
  const [progress, setProgress] = useState(0)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 99) {
          setStuck(true)
          return 99
        }
        const increment = Math.random() * 15
        return Math.min(p + increment, 99)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const barWidth = Math.floor(progress / 5)
  const bar = '█'.repeat(barWidth) + '░'.repeat(20 - barWidth)

  return (
    <div className="font-mono">
      <span className="text-terminal-green">[{bar}]</span>
      <span className="ml-2 text-terminal-dim">{progress.toFixed(1)}%</span>
      {stuck && (
        <span className="ml-2 text-terminal-yellow animate-pulse">
          (it&apos;s been 47 years...)
        </span>
      )}
    </div>
  )
}

function GlitchText({ children }: { children: string }) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 100)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className={`relative inline-block ${glitching ? 'glitch' : ''}`}>
      {children}
      {glitching && (
        <>
          <span className="absolute inset-0 text-terminal-red translate-x-[2px] opacity-70">{children}</span>
          <span className="absolute inset-0 text-terminal-cyan -translate-x-[2px] opacity-70">{children}</span>
        </>
      )}
    </span>
  )
}

function StatusBar() {
  const [uptime, setUptime] = useState(0)
  const [memory, setMemory] = useState(69)

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(u => u + 1)
      setMemory(m => Math.min(99, m + Math.random() * 2))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-12 md:bottom-8 left-0 right-0 bg-terminal-darkgreen/80 backdrop-blur-sm border-t border-terminal-green/30 px-2 md:px-4 py-1 md:py-2 font-mono text-[10px] md:text-xs flex flex-wrap gap-2 md:gap-0 justify-between text-terminal-dim z-10">
      <span>PID: 31337</span>
      <span>UPTIME: {formatUptime(uptime)}</span>
      <span className={memory > 90 ? 'text-terminal-red animate-pulse' : ''}>
        MEM: {memory.toFixed(1)}% {memory > 90 && '(LEAKING!)'}
      </span>
      <span className="text-terminal-yellow">ENV: "production" (lol)</span>
    </div>
  )
}

function App() {
  const [showSecret, setShowSecret] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [easterEgg, setEasterEgg] = useState(false)

  const handleSecretClick = () => {
    setClicks(c => c + 1)
    if (clicks >= 6) {
      setEasterEgg(true)
    }
  }

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green font-terminal p-3 md:p-6 lg:p-8 relative overflow-hidden">
      {/* CRT Effects */}
      <div className="pointer-events-none fixed inset-0 bg-scanlines opacity-10 z-50" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 z-40" />
      <div className="pointer-events-none fixed inset-0 animate-flicker opacity-[0.02] bg-white z-50" />

      {/* Fake cursor glow */}
      <div className="pointer-events-none fixed w-64 md:w-96 h-64 md:h-96 bg-terminal-green/5 rounded-full blur-3xl top-1/4 left-1/4 animate-float z-0" />

      <div className="relative z-10 max-w-4xl mx-auto pb-20 md:pb-16">
        {/* Header */}
        <header className="mb-6 md:mb-8 border border-terminal-green/30 p-3 md:p-4 relative">
          <div className="absolute -top-3 left-4 bg-terminal-black px-2 text-terminal-dim text-xs">
            localhost:3000
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
            <GlitchText>$ LOCALHOST</GlitchText>
            <span className="animate-blink">_</span>
          </h1>
          <p className="text-terminal-dim text-sm md:text-base">
            Welcome to the world&apos;s first production localhost deployment
          </p>
        </header>

        {/* Main Terminal Output */}
        <main className="space-y-3 md:space-y-4 text-xs md:text-sm lg:text-base">
          <TerminalLine delay={100}>
            <span className="text-terminal-cyan">$</span> npm run dev
          </TerminalLine>

          <TerminalLine delay={400}>
            <span className="text-terminal-dim">{'>'}</span> vite@latest
          </TerminalLine>

          <TerminalLine delay={700}>
            <span className="text-terminal-dim">{'>'}</span> Local: <span className="text-terminal-yellow underline">http://localhost:3000</span>
          </TerminalLine>

          <TerminalLine delay={1000}>
            <span className="text-terminal-dim">{'>'}</span> Network: <span className="text-terminal-red">use --host to expose</span> <span className="text-terminal-dim">(but we did anyway lmao)</span>
          </TerminalLine>

          <div className="my-4 md:my-6 p-3 md:p-4 border border-terminal-yellow/50 bg-terminal-yellow/5">
            <TerminalLine delay={1300}>
              <span className="text-terminal-yellow">WARNING:</span> You are viewing localhost in production.
            </TerminalLine>
            <TerminalLine delay={1600}>
              <span className="text-terminal-dim">This is not a drill. This is not a test.</span>
            </TerminalLine>
            <TerminalLine delay={1900}>
              <span className="text-terminal-dim">This is peak web development.</span>
            </TerminalLine>
          </div>

          <TerminalLine delay={2200}>
            <span className="text-terminal-cyan">$</span> deploying localhost to the cloud...
          </TerminalLine>

          <div className="ml-2 md:ml-4">
            <TerminalLine delay={2500}>
              <FakeProgress />
            </TerminalLine>
          </div>

          <div className="my-4 md:my-6 p-3 md:p-4 border border-terminal-red/50 bg-terminal-red/5">
            <TerminalLine delay={4000}>
              <span className="text-terminal-red">ERROR:</span> ENOENT: no such file or directory
            </TerminalLine>
            <TerminalLine delay={4200}>
              <span className="text-terminal-dim">at Object.openSync (fs.js:462:3)</span>
            </TerminalLine>
            <TerminalLine delay={4400}>
              <span className="text-terminal-dim">at &apos;./node_modules/.pnpm/everything&apos;</span>
            </TerminalLine>
            <TerminalLine delay={4600}>
              <span className="text-terminal-green">jk it&apos;s fine, we caught it with try/catch</span>
            </TerminalLine>
          </div>

          <TerminalLine delay={5000}>
            <span className="text-terminal-cyan">$</span> checking deployment status...
          </TerminalLine>

          <div className="ml-2 md:ml-4 space-y-1 md:space-y-2">
            <TerminalLine delay={5300}>
              <span className="text-terminal-green">✓</span> DNS propagated (after 48 hours)
            </TerminalLine>
            <TerminalLine delay={5500}>
              <span className="text-terminal-green">✓</span> SSL certificate (expired but who&apos;s checking)
            </TerminalLine>
            <TerminalLine delay={5700}>
              <span className="text-terminal-green">✓</span> CORS headers (disabled for convenience)
            </TerminalLine>
            <TerminalLine delay={5900}>
              <span className="text-terminal-green">✓</span> Environment variables (.env committed to git)
            </TerminalLine>
            <TerminalLine delay={6100}>
              <span className="text-terminal-green">✓</span> Database connection (using root:root)
            </TerminalLine>
            <TerminalLine delay={6300}>
              <span className="text-terminal-yellow">~</span> Tests (we don&apos;t have those)
            </TerminalLine>
          </div>

          <div className="mt-6 md:mt-8 p-4 md:p-6 border-2 border-terminal-green bg-terminal-green/5 relative">
            <div className="absolute -top-3 left-4 bg-terminal-black px-2 text-terminal-green text-xs">
              ACHIEVEMENT UNLOCKED
            </div>
            <TerminalLine delay={6800}>
              <div className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
                <GlitchText>LOCALHOST IS NOW LIVE!</GlitchText>
              </div>
            </TerminalLine>
            <TerminalLine delay={7200}>
              <p className="text-terminal-dim text-sm md:text-base">
                Congratulations! You&apos;ve successfully deployed localhost to production.
              </p>
            </TerminalLine>
            <TerminalLine delay={7500}>
              <p className="text-terminal-dim text-sm md:text-base">
                Your DevOps team is crying. Your security team has resigned.
              </p>
            </TerminalLine>
          </div>

          {/* Interactive Section */}
          <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
            <TerminalLine delay={8000}>
              <span className="text-terminal-cyan">$</span> Available commands:
            </TerminalLine>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="px-3 md:px-4 py-2 md:py-2 border border-terminal-green/50 hover:bg-terminal-green/20 hover:border-terminal-green transition-all text-xs md:text-sm touch-manipulation"
              >
                {showSecret ? '[ HIDE SECRET ]' : '[ REVEAL SECRET ]'}
              </button>
              <button
                onClick={handleSecretClick}
                className="px-3 md:px-4 py-2 md:py-2 border border-terminal-dim/50 hover:bg-terminal-green/10 transition-all text-terminal-dim hover:text-terminal-green text-xs md:text-sm touch-manipulation"
              >
                [ DO NOT CLICK ]
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-3 md:px-4 py-2 md:py-2 border border-terminal-red/50 hover:bg-terminal-red/20 hover:text-terminal-red transition-all text-xs md:text-sm touch-manipulation"
              >
                [ SUDO RM -RF / ]
              </button>
            </div>

            {showSecret && (
              <div className="p-3 md:p-4 border border-terminal-cyan/50 bg-terminal-cyan/5 animate-fadeIn">
                <p className="text-terminal-cyan text-sm md:text-base">SECRET REVEALED:</p>
                <p className="text-terminal-dim mt-2 text-sm md:text-base">
                  The real localhost was the friends we made along the way.
                </p>
                <p className="text-terminal-dim mt-1 text-xs md:text-sm opacity-50">
                  Also, your API key is: sk-proj-REDACTED-nice-try
                </p>
              </div>
            )}

            {easterEgg && (
              <div className="p-3 md:p-4 border border-terminal-magenta/50 bg-terminal-magenta/10 animate-fadeIn">
                <p className="text-terminal-magenta text-sm md:text-base">EASTER EGG FOUND!</p>
                <p className="text-terminal-dim mt-2 text-sm md:text-base">
                  You clicked the forbidden button {clicks} times.
                </p>
                <p className="text-terminal-magenta mt-2 text-xs md:text-sm">
                  You&apos;re exactly the kind of dev who would deploy localhost to prod.
                </p>
              </div>
            )}
          </div>

          {/* Server Logs */}
          <div className="mt-6 md:mt-8">
            <TerminalLine delay={8500}>
              <span className="text-terminal-cyan">$</span> tail -f server.log
            </TerminalLine>
            <div className="mt-2 p-3 md:p-4 bg-terminal-darkgreen/30 border border-terminal-green/20 max-h-32 md:max-h-40 overflow-hidden relative">
              <div className="space-y-1 animate-scrollLogs text-[10px] md:text-xs">
                <p className="text-terminal-dim">[INFO] Request from 127.0.0.1 - GET /</p>
                <p className="text-terminal-dim">[INFO] Request from 192.168.1.69 - GET /api/v1/secrets</p>
                <p className="text-terminal-yellow">[WARN] Memory usage at 420MB</p>
                <p className="text-terminal-dim">[INFO] User tried to access admin panel</p>
                <p className="text-terminal-red">[ERROR] Uncaught exception: undefined is not a function</p>
                <p className="text-terminal-dim">[INFO] Fixed with console.log debugging</p>
                <p className="text-terminal-green">[SUCCESS] Deployed without testing</p>
                <p className="text-terminal-dim">[INFO] npm install --save-dev *</p>
                <p className="text-terminal-yellow">[WARN] Package.json has 847 dependencies</p>
                <p className="text-terminal-dim">[INFO] left-pad installed successfully</p>
                <p className="text-terminal-red">[ERROR] left-pad was unpublished, npm is broken</p>
                <p className="text-terminal-green">[SUCCESS] Rebuilt internet from scratch</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-terminal-darkgreen/80 to-transparent" />
            </div>
          </div>
        </main>

        <StatusBar />

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 py-2 md:py-3 text-center text-[10px] md:text-xs text-terminal-dim/50 bg-terminal-black/80 backdrop-blur-sm z-20">
          Requested by @0xPaulius · Built by @clonkbot
        </footer>
      </div>
    </div>
  )
}

export default App