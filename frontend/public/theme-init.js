(function () {
  try {
    const stored = localStorage.getItem('rumah-nafasy-theme')
    const preferred =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'

    document.documentElement.dataset.theme = preferred
    document.documentElement.style.backgroundColor =
      preferred === 'dark' ? '#000000' : '#ffffff'
  } catch (error) {
    document.documentElement.dataset.theme = 'light'
    document.documentElement.style.backgroundColor = '#ffffff'
  }
})()
