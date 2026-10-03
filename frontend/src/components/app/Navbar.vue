<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { gsap } from 'gsap'
import { useTheme } from '../../composables/useTheme'
import SpecularButton from '../ui/SpecularButton.vue'

type NavigationLink = {
  label: string
  href?: string
  to?: RouteLocationRaw
}

defineProps<{
  brand: {
    name: string
    href: string
    mark: string
    ariaLabel: string
  }
  links: NavigationLink[]
}>()

const { theme, toggleTheme } = useTheme()
const mobileOpen = ref(false)
const navHighlightStates = ref<Record<string, 'entering' | 'active' | 'exiting'>>({})
let mobileMenuTween: gsap.core.Tween | null = null

const prepareMobileMenu = (element: Element) => {
  gsap.set(element.querySelectorAll('.mobile-menu-eyebrow, .mobile-menu-link'), { autoAlpha: 0, y: 26 })
}

const animateMobileMenu = (element: Element) => {
  mobileMenuTween?.kill()
  const items = element.querySelectorAll('.mobile-menu-eyebrow, .mobile-menu-link')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  mobileMenuTween = gsap.fromTo(items,
    { autoAlpha: 0, y: 26 },
    {
      autoAlpha: 1,
      y: 0,
      duration: reducedMotion ? 0.01 : 0.75,
      stagger: reducedMotion ? 0 : 0.19,
      ease: 'power3.out',
      clearProps: 'opacity,visibility,transform',
    },
  )
}

const setNavHighlight = (href: string, state: 'entering' | 'exiting') => {
  navHighlightStates.value = { ...navHighlightStates.value, [href]: state }
}

const finishNavHighlight = (href: string, event: AnimationEvent) => {
  if (event.animationName === 'nav-highlight-enter') {
    navHighlightStates.value = { ...navHighlightStates.value, [href]: 'active' }
  } else if (event.animationName === 'nav-highlight-exit') {
    const { [href]: _, ...remainingStates } = navHighlightStates.value
    navHighlightStates.value = remainingStates
  }
}

let savedScrollY = 0
watch(mobileOpen, (open) => {
  if (typeof document === 'undefined') return
  if (open) {
    savedScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflowY = 'scroll'
  } else {
    mobileMenuTween?.kill()
    mobileMenuTween = null
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflowY = ''
    window.scrollTo(0, savedScrollY)
  }
})

const closeMobile = () => { mobileOpen.value = false }
</script>

<template>
  <!-- DESKTOP NAVBAR -->
  <header class="fixed top-0 right-0 left-0 z-50 w-full px-6 pt-0">
    <div class="mx-auto w-full max-w-[1420px] overflow-hidden rounded-b-[30px] shadow-[0_1px_0_rgba(17,17,17,0.08)]">
      <!-- Announcement strip -->
      <!-- <div class="flex h-[40px] items-center justify-between bg-[#4a0035] px-6 text-white sm:px-7">
        <a href="#mulai" class="inline-flex min-w-0 items-center gap-3 no-underline" aria-label="Mulai konsultasi">
          <span class="hidden text-[20px] font-extrabold leading-none tracking-[-0.08em] text-[#fffbf0] sm:inline">rumah</span>
          <span class="truncate text-[13px] font-medium tracking-[-0.01em] text-[#f7b6f5] sm:text-[15px]">Temani perjalanan kesehatan mental Anda.</span>
        </a>
        <a href="#mulai" class="ml-4 inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#f6ed5b] no-underline transition-opacity hover:opacity-75 sm:text-[12px]">
          Mulai sekarang
          <span aria-hidden="true" class="text-[17px] leading-none">→</span>
        </a>
      </div> -->

      <nav
        class="flex h-[58px] items-center gap-2 bg-[var(--surface)] px-6 sm:px-7"
        aria-label="Navigasi utama"
      >
        <!-- Brand -->
        <RouterLink
          :to="brand.href"
          :aria-label="brand.ariaLabel"
          class="inline-flex shrink-0 items-center gap-2 pr-7 text-[var(--ink)] no-underline"
        >
          <img src="/icons/64.png" alt="" aria-hidden="true" class="h-6 w-6 object-contain" />
          <span class="text-[19px] font-bold leading-none tracking-[-0.055em]">{{ brand.name }}</span>
        </RouterLink>

        <!-- Nav links — desktop, tengah -->
        <div class="hidden items-center gap-1 md:flex" aria-label="Menu utama">
          <RouterLink
            v-for="link in links"
            :key="link.label"
            :to="link.to ?? link.href ?? '/'"
            class="nav-highlight px-3.5 py-2 text-[15px] font-normal tracking-[-0.02em] text-[var(--text)] no-underline hover:text-white"
            :class="`nav-highlight--${navHighlightStates[link.to?.toString?.() ?? link.href ?? link.label] ?? 'hidden'}`"
            @pointerenter="setNavHighlight((link.to?.toString?.() ?? link.href ?? link.label), 'entering')"
            @pointerleave="setNavHighlight((link.to?.toString?.() ?? link.href ?? link.label), 'exiting')"
            @animationend="finishNavHighlight((link.to?.toString?.() ?? link.href ?? link.label), $event)"
          >{{ link.label }}</RouterLink>
        </div>

        <!-- Actions kanan — desktop -->
        <div class="ml-auto hidden shrink-0 items-center gap-2 md:flex">
          <button
            type="button"
            class="inline-flex h-6 w-6 items-center justify-center border-none bg-transparent p-0 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            :aria-label="theme === 'light' ? 'Aktifkan dark mode' : 'Aktifkan light mode'"
            @click="toggleTheme"
          >
            <SunIcon v-if="theme === 'light'" :size="12" aria-hidden="true" />
            <MoonIcon v-else :size="12" aria-hidden="true" />
          </button>
          <RouterLink to="/form" custom v-slot="{ navigate }">
            <SpecularButton
              size="sm"
              :radius="12"
              tint="#111111"
              :tint-opacity="1"
              :blur="0"
              text-color="#ffffff"
              line-color="#ffffff"
              base-color="#111111"
              :intensity="0.7"
              :shine-size="10"
              :shine-fade="40"
              :thickness="1"
              :speed="0.35"
              follow-mouse
              :proximity="250"
              :auto-animate="false"
              class="!h-[44px] !min-w-[176px] !px-6 !py-0 !text-[14px] !font-semibold tracking-[-0.02em] whitespace-nowrap"
              @click="navigate"
            >
              Ayo Memulai 🤗
            </SpecularButton>
          </RouterLink>
        </div>

        <!-- Burger — mobile only -->
        <button
          type="button"
          class="mobile-menu-trigger ml-auto flex h-[42px] w-[42px] flex-col items-center justify-center gap-[5px] rounded-full border border-[var(--line)] bg-[var(--background)] p-0 md:hidden"
          :aria-label="mobileOpen ? 'Tutup menu' : 'Buka menu'"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
          @click="mobileOpen = true"
        >
          <span class="mobile-menu-line" aria-hidden="true" />
          <span class="mobile-menu-line" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </header>

  <!-- MOBILE MENU OVERLAY -->
  <Teleport to="body">
    <Transition name="mobile-menu" @before-enter="prepareMobileMenu" @after-enter="animateMobileMenu">
      <div v-if="mobileOpen" class="mobile-menu-backdrop" @click.self="closeMobile">
        <section id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu navigasi" class="mobile-menu-panel">
      <!-- Topbar -->
      <div class="mobile-menu-topbar">
        <RouterLink :to="brand.href" class="mobile-menu-brand" :aria-label="brand.ariaLabel" @click="closeMobile">
          <img src="/icons/64.png" alt="" aria-hidden="true" />
          <span>{{ brand.name }}</span>
        </RouterLink>
        <button
          type="button"
          class="mobile-menu-close"
          aria-label="Tutup menu"
          @click="closeMobile"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- Nav links — scrollable -->
      <nav class="mobile-menu-nav" aria-label="Menu mobile">
        <p class="mobile-menu-eyebrow">Jelajahi</p>
        <RouterLink
          v-for="link in links"
          :key="link.label"
          :to="link.to ?? link.href ?? '/'"
          class="mobile-menu-link"
          @click="closeMobile"
        ><span>{{ link.label }}</span><span aria-hidden="true">↗</span></RouterLink>
      </nav>

      <!-- Footer: theme switch + CTA -->
      <div class="mobile-menu-footer">
        <!-- Theme toggle row -->
        <div class="mobile-theme-row">
          <span class="mobile-theme-label">
            <SunIcon v-if="theme === 'light'" :size="15" aria-hidden="true" />
            <MoonIcon v-else :size="15" aria-hidden="true" />
            {{ theme === 'light' ? 'Mode Terang' : 'Mode Gelap' }}
          </span>

          <!-- Switch -->
          <button
            type="button"
            role="switch"
            :aria-checked="theme === 'dark'"
            :aria-label="theme === 'light' ? 'Aktifkan dark mode' : 'Aktifkan light mode'"
            class="mobile-theme-switch"
            :class="theme === 'dark' ? 'bg-[var(--ink)]' : 'bg-[var(--line)]'"
            @click="toggleTheme"
          >
            <span
              class="mobile-theme-knob"
              :class="theme === 'dark' ? 'translate-x-[18px]' : 'translate-x-0'"
            />
          </button>
        </div>

        <!-- CTA -->
        <RouterLink
          to="/form"
          class="mobile-menu-cta"
          @click="closeMobile"
        >Ayo Memulai 🫂</RouterLink>
      </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mobile-menu-trigger { transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease; }
.mobile-menu-trigger:hover { border-color: var(--ink); background: var(--surface); }
.mobile-menu-trigger:active { transform: scale(0.96); }
.mobile-menu-line { display: block; width: 17px; height: 1.5px; border-radius: 2px; background: var(--ink); }
.mobile-menu-backdrop { position: fixed; inset: 0; z-index: 9999; display: flex; justify-content: flex-end; background: rgb(0 0 0 / 42%); backdrop-filter: blur(3px); }
.mobile-menu-panel { display: flex; flex-direction: column; width: min(88vw, 390px); height: 100%; height: 100dvh; overflow: hidden; padding: max(12px, env(safe-area-inset-top)) 24px max(18px, env(safe-area-inset-bottom)); border-left: 1px solid var(--line); background: var(--background); color: var(--text); box-shadow: -20px 0 60px rgb(0 0 0 / 14%); transform: translateX(0); }
.mobile-menu-topbar { display: flex; flex: 0 0 60px; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
.mobile-menu-brand { display: inline-flex; align-items: center; gap: 9px; color: var(--ink); font-size: 17px; font-weight: 700; letter-spacing: -0.05em; text-decoration: none; }
.mobile-menu-brand img { width: 29px; height: 29px; object-fit: contain; }
.mobile-menu-close { display: grid; width: 40px; height: 40px; place-items: center; border: 1px solid var(--line); border-radius: 50%; background: var(--surface); color: var(--text); cursor: pointer; transition: background-color 150ms ease, transform 150ms ease; }
.mobile-menu-close:hover { background: var(--line); }
.mobile-menu-close:active { transform: scale(0.95); }
.mobile-menu-nav { flex: 1; overflow-y: auto; padding: 32px 0; }
.mobile-menu-eyebrow { margin: 0 0 10px; color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
.mobile-menu-link { display: flex; min-height: 66px; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); color: var(--text); font-size: 22px; font-weight: 500; letter-spacing: -0.045em; text-decoration: none; transition: color 150ms ease, padding 150ms ease; }
.mobile-menu-link:first-of-type { border-top: 1px solid var(--line); }
.mobile-menu-link > span:last-child { color: var(--muted); font-size: 17px; }
.mobile-menu-link:hover { padding-left: 5px; color: var(--accent); }
.mobile-menu-footer { display: flex; flex: 0 0 auto; flex-direction: column; gap: 18px; padding-top: 18px; border-top: 1px solid var(--line); }
.mobile-theme-row { display: flex; align-items: center; justify-content: space-between; }
.mobile-theme-label { display: inline-flex; align-items: center; gap: 9px; color: var(--muted); font-size: 14px; }
.mobile-theme-switch { position: relative; width: 44px; height: 26px; flex-shrink: 0; border: 0; border-radius: 999px; cursor: pointer; transition: background-color 200ms ease; }
.mobile-theme-knob { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: var(--background); box-shadow: 0 1px 4px rgb(0 0 0 / 18%); transition: transform 200ms ease; }
.mobile-menu-cta { display: flex; min-height: 52px; align-items: center; justify-content: space-between; padding: 0 18px; border-radius: 4px; background: var(--ink); color: var(--inverse-text); font-size: 15px; font-weight: 650; letter-spacing: -0.02em; text-decoration: none; transition: opacity 150ms ease, transform 150ms ease; }
.mobile-menu-cta::after { content: '→'; font-size: 20px; }
.mobile-menu-cta:hover { opacity: 0.88; }
.mobile-menu-cta:active { transform: scale(0.99); }
.mobile-menu-enter-active, .mobile-menu-leave-active { transition: background-color 220ms ease; }
.mobile-menu-enter-active .mobile-menu-panel, .mobile-menu-leave-active .mobile-menu-panel { transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1); }
.mobile-menu-enter-from, .mobile-menu-leave-to { background: rgb(0 0 0 / 0%); }
.mobile-menu-enter-from .mobile-menu-panel, .mobile-menu-leave-to .mobile-menu-panel { transform: translateX(100%); }
@media (prefers-reduced-motion: reduce) {
  .mobile-menu-enter-active, .mobile-menu-leave-active,
  .mobile-menu-enter-active .mobile-menu-panel, .mobile-menu-leave-active .mobile-menu-panel { transition-duration: 1ms; }
}

.nav-highlight {
  position: relative;
  isolation: isolate;
}

.nav-highlight::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: #48008c;
  content: '';
}

.nav-highlight--hidden::before {
  clip-path: inset(0 0 0 100%);
}

.nav-highlight--entering::before {
  animation: nav-highlight-enter 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.nav-highlight--active::before,
.nav-highlight:focus-visible::before {
  clip-path: inset(0);
}

.nav-highlight--exiting::before {
  animation: nav-highlight-exit 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes nav-highlight-enter {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0); }
}

@keyframes nav-highlight-exit {
  from { clip-path: inset(0); }
  to { clip-path: inset(0 0 0 100%); }
}

@media (prefers-reduced-motion: reduce) {
  .nav-highlight--entering::before,
  .nav-highlight--exiting::before {
    animation-duration: 1ms;
  }
}
</style>
