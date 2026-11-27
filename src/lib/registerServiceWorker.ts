export async function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  try {
    const hadController = Boolean(navigator.serviceWorker.controller)
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || refreshing) return
      refreshing = true
      window.location.reload()
    })

    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    await registration.update()
    const checkForUpdate = () => {
      if (document.visibilityState === 'visible') void registration.update().catch(() => undefined)
    }
    document.addEventListener('visibilitychange', checkForUpdate)
    window.addEventListener('focus', checkForUpdate)
  } catch {
    // PWA installation is an enhancement; the website remains usable if registration fails.
  }
}
