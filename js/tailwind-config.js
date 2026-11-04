/* Tailwind config: brand tokens + custom animations */
tailwind.config = { theme: { extend: {
  colors: { void:'#0A0A0F', cy:'#00F0FF', mg:'#FF0055', chrome:'#C9D1D9' },
  fontFamily: { head:['Orbitron','sans-serif'], body:['Space Grotesk','sans-serif'], mono:['JetBrains Mono','monospace'] },
  keyframes: { spin2:{to:{transform:'rotate(360deg)'}}, blink:{'50%':{opacity:0}} },
  animation: { spin2:'spin2 24s linear infinite', blink:'blink 1s steps(1) infinite' }
}}};
