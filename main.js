function isNotLogin(){
  $('#app').hide()
  $('#form-register').hide()
}

$(document).ready(() => {
  isNotLogin()

  $('#form-login').on('submit', () => {
    event.preventDefault()
    $('#app').show()
    $('#login').hide()
  })
  $('.button-register').on('click', () => {
    $('#form-register').show()
    $('#login').hide()
    $('.button-register').hide()
    
  })
  $('.logout')

  console.log( "ready!" );
});
