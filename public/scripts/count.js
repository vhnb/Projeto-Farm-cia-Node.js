const btnLess = document.getElementById('btnLess')
const btnMore = document.getElementById('btnMore')
const count = document.getElementById('count')
const quantidadeInput = document.getElementById('quantidade')

let currentCount = 0

btnMore.addEventListener('click', function() {
    currentCount ++
    count.textContent = currentCount
    quantidadeInput.value = currentCount
})

btnLess.addEventListener('click', function() {
    if(currentCount > 0) {
        currentCount --
        count.textContent = currentCount
        quantidadeInput.value = currentCount
    }
})