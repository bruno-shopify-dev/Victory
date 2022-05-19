// Constantes
const navBarHeight = 64;

function formatCurrency(value, fractionDigits = 2) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: fractionDigits }).format(value);
}

function scrollTo(top, left = 0, time = 50) {
    setTimeout(
        () => {
          document.querySelector('main').scrollTo({
            top,
            left,
            behavior:'smooth'
          })
        }, time
    )
}