; ((window) => {
  if (!window.$) {
    console.warn('Jquery 未引入')
    return
  }
  function showLoading () {
    $(this).addClass('loading')
    $(this).prop('disabled', true)
    return this
  }

  function hideLoading () {
    $(this).removeClass('loading')
    $(this).prop('disabled', false)
  }

  function generateUUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  }

  function showDialog () {
    let uuid = generateUUID()
    let _this = this
    $(this).removeClass('hide').attr('data-id', uuid)
    $("body").addClass('scroll_hide')

    $(_this).on('click', '.close', function (e) {
      $(_this).hideDialog('hide')
    })

    $(_this).on('click', '.cancel', function (e) {
      $(_this).hideDialog('hide')
    })


    return this
  }

  function hideDialog (callback) {
    let _this = this
    $(_this).addClass('hide')
    $("body").removeClass('scroll_hide')
    typeof callback == 'function' && callback()
    return _this
  }

  function confirmDialog (callback) {
    let _this = this
    $('.yu_dialog').on('click', '.confirm', function (e) {
      typeof callback == 'function' && callback(_this)
    })
    return _this
  }


  function getFormData (param) {
    let _this = this
    var formArray = $(_this).serializeArray()
    var formData = {}
    $.each(formArray, function (index, item) {
      formData[item.name] = item.value
    })
    return formData
  }

  window.jQuery.prototype.showLoading = showLoading
  window.jQuery.prototype.hideLoading = hideLoading

  window.jQuery.prototype.showDialog = showDialog
  window.jQuery.prototype.hideDialog = hideDialog
  window.jQuery.prototype.confirmDialog = confirmDialog


  window.jQuery.prototype.getFormData = getFormData
})(window)
