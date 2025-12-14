const navToggle = document.querySelector('.nav-toggle')
const siteNav = document.querySelector('#site-nav')
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true'
    navToggle.setAttribute('aria-expanded', String(!expanded))
    siteNav.classList.toggle('open')
  })
}
const anchors = document.querySelectorAll('a[href^="#"]')
anchors.forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').substring(1)
    const target = document.getElementById(id)
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (siteNav) siteNav.classList.remove('open')
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false')
    }
  })
})
const scrollers = document.querySelectorAll('.card, .offer, .step')
scrollers.forEach(el => el.classList.add('animate-on-scroll'))
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible')
  })
}, { threshold: 0.12 })
scrollers.forEach(el => io.observe(el))
const form = document.querySelector('#contact-form')
const statusEl = document.querySelector('.form-status')
function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault()
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const goal = String(data.get('goal') || '').trim()
    const level = String(data.get('level') || '').trim()
    const message = String(data.get('message') || '').trim()
    const hp = String(data.get('hp') || '').trim()
    if (hp) return
    if (!name || !email || !goal || !level || !message) {
      statusEl.textContent = 'Merci de remplir tous les champs.'
      return
    }
    if (!validateEmail(email)) {
      statusEl.textContent = 'Email invalide.'
      return
    }
    const endpoint = String(form.dataset.endpoint || '')
    if (!endpoint) {
      statusEl.textContent = 'Configuration manquante. Contacte le support.'
      return
    }
    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn) submitBtn.disabled = true
    statusEl.textContent = 'Envoi en cours…'
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      })
      if (!res.ok) throw new Error('bad_status')
      statusEl.textContent = 'Demande envoyée. Nous revenons vers toi rapidement.'
      form.reset()
    } catch {
      statusEl.textContent = 'Une erreur est survenue. Réessaie plus tard.'
    } finally {
      if (submitBtn) submitBtn.disabled = false
    }
  })
}
