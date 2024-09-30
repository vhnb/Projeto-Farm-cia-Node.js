document.addEventListener('DOMContentLoaded', function(){
    const btnSwitchThemeDark = document.getElementById('btn-switch-dark')
    const btnSwitchThemeLight = document.getElementById('btn-switch-light')
    const isDarkMode = localStorage.getItem('dark-mode') === 'true'
    const header = document.querySelector('header')
    const main = document.querySelector('main')
    const dropdown = document.querySelector('.dropdown')
    const modal = document.querySelector('#exampleModal')
    const form = document.querySelector('form')
    const table = document.querySelector('table')
    const cards = document.querySelectorAll('.card')

    function updateTheme(isDarkMode){
        if (isDarkMode) {
            document.body.classList.add('dark-mode')
            if (header) header.classList.add('dark-mode')
            if (main) main.classList.add('dark-mode')
            if (dropdown) dropdown.classList.add('dark-mode')
            if (modal) modal.classList.add('dark-mode')
            if (form) form.classList.add('dark-mode')
            if (table) table.classList.add('dark-mode')
            if (cards) cards.forEach(card => card.classList.add('dark-mode'))
            localStorage.setItem('dark-mode', 'true')
        } else {
            document.body.classList.remove('dark-mode')
            if (header) header.classList.remove('dark-mode')
            if (main) main.classList.remove('dark-mode')
            if (dropdown) dropdown.classList.remove('dark-mode')
            if (modal) modal.classList.remove('dark-mode')
            if (form) form.classList.remove('dark-mode')
            if (table) table.classList.remove('dark-mode')
            if (cards) cards.forEach(card => card.classList.remove('dark-mode'))
            localStorage.setItem('dark-mode', 'false')
        }
    }

    updateTheme(isDarkMode)

    btnSwitchThemeDark.addEventListener('click', function() {
        updateTheme(true)
    })

    btnSwitchThemeLight.addEventListener('click', function() {
        updateTheme(false)
    })
})