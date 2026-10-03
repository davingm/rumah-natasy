import { computed } from 'vue'
import { useTheme as useThemeMode } from './theme'

export type Theme = 'light' | 'dark'

const { mode, resolvedMode, setMode } = useThemeMode()
const theme = computed<Theme>(() => resolvedMode.value === 'dark' ? 'dark' : 'light')

function initializeTheme() {
  setMode(mode.value)
}

function toggleTheme() {
  setMode(theme.value === 'light' ? 'dark' : 'light')
}

export const useTheme = () => ({
  theme,
  initializeTheme,
  toggleTheme,
})
