$('.sidebar-menu li').on('click', function (e) {
  $('.sidebar-menu li').removeClass('active')
  $(this).addClass('active')

  $('.user_form_item').hide()
  $('.' + $(this).attr('id')).show()
})


$('.yublog_avatar').on('click', 'img', function (e) {
  $('.yublog_avatar input').click()
})

$('.yublog_avatar input').on('change', function (e) {
  let file = e.target.files[0]
  let fd = new FormData()
  fd.append('file', file)

  const type = file.type
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    const blob = new Blob([file], { type })
    const blobURL = window.URL.createObjectURL(blob)
    $('.yublog_avatar img').attr('src', blobURL)
  }


  return

})

$('.user_info_form').submit(async function (e) {
  e.preventDefault()
  try {
    $('.update_user_button').showLoading()
    let src = $('.yublog_avatar img').attr('src')
    let avtar = src.split(BLOG_URL)[1]
    if (src.search('blob') != -1) {
      let retFile = await httpRequest(src)
      let uploadRet = await uploadFile(retFile)
      avtar = uploadRet.data.file_info.file_path.split('./')[1]
    }
    if (avtar.search('admin/views/images/avatar.svg') != -1) {
      avtar = 'admin/views/images/avatar.svg'
    }

    let data = $('.user_info_form').getFormData()
    data['photo'] = avtar
    $.ajax({
      method: "POST",
      url: BLOG_URL + "?yu-api=update_user",
      contentType: "application/x-www-form-urlencoded;",
      data: data,
      success: function (res) {
        $('.update_user_button').hideLoading()
        console.log(res)
        if (res.code != 0) return layer.msg(res.msg)
        layer.msg('更新成功！')
      },
      error: function (err) {
        $('.update_user_button').hideLoading()
      }
    })
  } catch (error) {
    console.log(error)
    $('.update_user_button').hideLoading()
    layer.msg('保存失败')
  }
})

function uploadFile (file) {
  return new Promise((resolve, reject) => {
    let formData = new FormData()
    formData.append('file', file)
    $.ajax({
      method: 'post',
      url: BLOG_URL + '?yu-api=upload',
      contentType: false,
      processData: false,
      data: formData,
      success: function (res) {
        console.log(res)
        if (res.code != 0) reject(res.msg)
        resolve(res)
      },
      error: function (err) { reject(err) }
    })
  })
}


function httpRequest (src) {
  let that = this
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', src, true)
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      if (this.status == 200) {
        let myBlob = this.response
        console.log(myBlob)
        let map = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/svg+xml': 'svg',
          'image/gif': 'gif'
        }
        let suffix = map[myBlob.type] || ''
        if (!suffix) reject(false)
        let files = new window.File([myBlob], 'avatar.' + map[myBlob.type], { type: myBlob.type }) // myBlob.type 自定义文件名
        resolve(files)
      } else {
        reject(false)
      }
    }
    xhr.send()
  })
}

$('#post_form').on('submit', function (e) {
  e.preventDefault()
  let data = $('#post_form').getFormData()
  if (!data.title) return layer.msg('标题不能为空')
  let content = editor.getHtml()
  let contentText = editor.getText()
  if (!contentText) return layer.msg('内容不能为空')
  data['content'] = content

  $.ajax({
    method: "POST",
    url: BLOG_URL + "?rest-api=article_post",
    contentType: "application/x-www-form-urlencoded;",
    data: data,
    success: function (res) {
      console.log(res)
      if (res.code != 0) return layer.msg('发布失败')
      $('.title input').val('')
      $('.sort_id .yu_select').val('-1')
      editor.setHtml('')
      layer.msg('发布成功')
    },
    error: function (err) {
      layer.msg('发布失败')
    }
  })


})

$('.mailcode').on('click', function (e) {
  let time = 60
  let timeInterval = null
  let that = this

  let mail = $('.mail input').val()
  if (!mail) return layer.msg('邮箱不合法')
  if ($(this).attr('data-mail') == 1) {
    $.ajax({
      method: "POST",
      url: "?yu-api=send_mail",
      contentType: "application/x-www-form-urlencoded;",
      data: { mail, resp: 'json' },
      success: function (res) {
        console.log(res)
        if (res.code != 0) return layer.msg(res.msg)
        layer.msg('发送成功')
        $(that).attr('data-mail', 0)
        timeInterval = setInterval(() => {
          $(that).html(`${time} 秒后获取`)
          time--
          if (time <= 0) {
            time = 60
            clearInterval(timeInterval)
            $(that).html('获取验证码')
            $(that).attr('data-mail', 1)
          }
        }, 1000)

      },
      error: function (err) {
        layer.msg(err.responseJSON.msg || '修改失败')
      }
    })
  }


})

$('.update_pass_form').on('submit', function (e) {
  e.preventDefault()
  let data = $('.update_pass_form').getFormData()
  $.ajax({
    method: "POST",
    url: "/admin/account.php?action=doreset2",
    contentType: "application/x-www-form-urlencoded;",
    data: data,
    success: function (res) {
      console.log(res)
      if (res.code != 0) return layer.msg(res.msg)
      layer.msg('修改成功,请重新登录')
      setTimeout(() => {
        window.location.href = '/admin/account.php?action=logout'
      }, 1000)
    },
    error: function (err) {
      console.log(err)
      layer.msg(err.responseJSON.msg || '修改失败')
    }
  })
})