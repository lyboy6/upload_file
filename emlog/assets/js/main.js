$('.yu_mobile_nav').on('click', function (e) {
  e.stopPropagation()
  $("body").removeClass('scroll_hide')
  let classList = Array.from(e.target.classList)
  if (classList.includes('yu_mobile_nav')) {
    $('.yu_mobile_nav').removeClass('left')
    $('.mobile_nav_subnav').removeClass('left')
  }
})

$('.mobile_nav  .icon-caidan').on('click', function (e) {
  $('.yu_mobile_nav').addClass('left')
  $('.mobile_nav_subnav').addClass('left')
  $("body").addClass('scroll_hide')
})

$('.yublog_login').on('click', function (e) {
  $('.yu_login_dialog').showDialog()
})

$("#yu_login_form").on('submit', function (e) {
  e.preventDefault()
  $('#yu_login_form .yu_button').showLoading()
  var formData = $("#yu_login_form").getFormData()
  for (const key in formData) {
    let map = {
      'user': '用户名',
      'pw': '密码',
      'login_code': '密码'
    }
    if (!formData[key]) {
      $('#yu_login_form .yu_button').hideLoading()
      layer.msg(map[key] + '不能为空')
      return
    }
  }

  $.ajax({
    method: "POST",
    url: BLOG_URL + "admin/account.php?action=dosignin",
    contentType: "application/x-www-form-urlencoded;",
    data: { ...formData, resp: 'json' },
    success: function (res) {
      console.log(res)
      $('#yu_login_form .yu_button').hideLoading()
      if (!res.code && res.code != 0) return getuserInfo('你已经登录', '/?ucenter')
      layer.msg('登录成功！')
      window.location.reload()
    },
    error: function (err) {
      $('#yu_login_form .yu_button').hideLoading()
      $('.getimg_code input[name=login_code]').val('')
      $('.getimg_code img').attr('src', BLOG_URL + 'include/lib/checkcode.php?time=' + new Date().getTime())
      layer.msg(err.responseJSON.msg || '登录失败')
    }
  })
})

$('#yu_register_form').on('submit', function (e) {
  e.preventDefault()
  $('#yu_register_form .yu_button').showLoading()
  var formData = $("#yu_register_form").getFormData()
  for (const key in formData) {
    let map = {
      'mail': '邮箱',
      'password': '密码',
      'repasswd': '重复密码',
      'login_code': '验证码'
    }
    if (!formData[key]) {
      $('#yu_register_form .yu_button').hideLoading()
      layer.msg(map[key] + '不能为空')
      return
    }
  }

  $.ajax({
    method: "POST",
    url: BLOG_URL + "/admin/account.php?action=dosignup",
    contentType: "application/x-www-form-urlencoded;",
    data: { ...formData, resp: 'json' },
    success: function (res) {
      console.log(res)
      if (res.code && res.code != 0) return layer.msg(res.msg || '注册失败')
      layer.msg('注册成功！')
      $('#yu_login_form').removeClass('hide')
      $('#yu_register_form').addClass('hide')
      $('.yu_login_dialog .yu_dialog_header-title').html('登录')
    },
    error: function (err) {
      $('#yu_login_form .yu_button').hideLoading()
      $('.getimg_code input[name=login_code]').val('')
      $('.getimg_code img').attr('src', BLOG_URL + 'include/lib/checkcode.php?time=' + new Date().getTime())
      layer.msg(err.responseJSON.msg || '注册失败')
    }
  })
})


function getuserInfo (msg, path) {
  $.ajax({
    method: "POST",
    url: BLOG_URL + "/?rest-api=userinfo",
    contentType: "application/x-www-form-urlencoded;",
    success: function (res) {
      console.log(res)
      if (path && msg && res.code == 0) {
        layer.msg(msg)
        setTimeout(() => {
          window.location.href = path
        }, 1000)
        window.localStorage.setItem('userInfo', JSON.stringify(res.data))
      }
    }
  })
}

$('#yu_login_form .yu_login_dialog-register a').on('click', function (e) {
  $('#yu_login_form').addClass('hide')
  $('#yu_register_form').removeClass('hide')
  $('.yu_login_dialog .yu_dialog_header-title').html('注册')
})
$('#yu_register_form .yu_login_dialog-login a').on('click', function (e) {
  $('#yu_login_form').removeClass('hide')
  $('#yu_register_form').addClass('hide')
  $('.yu_login_dialog .yu_dialog_header-title').html('登录')
})

$('.getimg_code').on('click', 'img', function (e) {
  $(this).attr('src', BLOG_URL + 'include/lib/checkcode.php?time=' + new Date().getTime())
})


$('.mobile_login').on('click', function (e) {
  $('.yu_mobile_nav').removeClass('left')
  $('.mobile_nav_subnav').removeClass('left')
  setTimeout(() => {
    $('.yu_login_dialog').showDialog()
  }, 300)
})
// 轮播图
$('.swiper_button_prev').on('click', function (e) {
  mySwiper.slidePrev()
})

$('.swiper_button_next').on('click', function (e) {
  mySwiper.slideNext()
})

var mySwiper = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,
  autoplay: true,
  grabCursor: true,
  // 如果需要分页器
  pagination: {
    el: '.swiper-pagination',
  },
})

// 搜索
$('#serarch').on('focus', function (e) {
  $('.search_input').addClass('focus')
})
$('#serarch').on('blur', function (e) {
  $('.search_input').removeClass('focus')
})

/**
 * input 获取焦点
 * */
$('input').on('focus', function (e) {
  $(this).parent().addClass('active')
})

$('input').on('blur', function (e) {
  $(this).parent().removeClass('active')
})

/**
 * 评论
 * 逻辑复杂 必要的时候需优化
 * TODO 点击回复显示表单优化 提交表单优化 验证优化
 * */

let captcha = null

let data = null

$('.comment_textarea textarea').on('focus', function (e) {
  $('.comment_textarea').addClass('focus')
})
$('.comment_textarea textarea').on('blur', function (e) {
  $('.comment_textarea').removeClass('focus')
})

function reply_link (cid, e) {
  $('input[name=pid]').val(cid)
  $('#cancel_reply').addClass('show')

  let html = ''
  html = $('#comment_form').html()
  const reply_form = $(
    `<div class='yublog_comment_form reply_form' id='reply_form${cid}'></div>`
  )

  $(reply_form).append(html)
  console.log($(e).parent())
  $('.comment_reply_link').parent().find('.reply_form').remove()
  $(e).parent().append(reply_form)

  $('#comment_form').addClass('hide')

  // 重新监听 initGeetest4
  if (captcha) {
    $('#reply_form' + cid + ' #comment_submit').on('click', function (e) {
      console.log(e)
      e.preventDefault()
      captcha.showCaptcha() //显示验证码
      data = fromToJson($('#reply_form' + cid + ' form'))
      e.stopPropagation()
    })
  }
}

function reply_seover (cid, _this, e) {
  $('.comment_reply_link').hide()
  $('#reply_link' + cid).show()

  e.stopPropagation()
}

function reply_seout (cid, _this, e) {
  $('.comment_reply_link').hide()
  e.stopPropagation()
}

function cancel_comment (e) {
  $('input[name=pid]').val(0)
  $('.reply_form').hide()
  $('#comment_form').removeClass('hide')
  $('#cancel_reply').removeClass('show')
}

//从from获取数据，转为对象
function fromToJson (form) {
  var result = {}
  var fieldArray = $(form).serializeArray()
  for (var i = 0; i < fieldArray.length; i++) {
    var field = fieldArray[i]
    if (field.name in result) {
      result[field.name] += ',' + field.value
    } else {
      result[field.name] = field.value
    }
  }
  return result
}

$.ajax({
  type: 'get',
  url: '?yu-api=get_gt4',
  dataType: 'json',
  success: function (res) {
    if (!res.data.gtid) return
    // 初始化 initGeetest4
    initGeetest4(
      {
        captchaId: res.data.gtid,
        product: 'bind',
      },
      function (captchaObj) {
        captcha = captchaObj
        captchaObj
          .onReady(function () {
            //验证码ready之后才能调用showCaptcha方法显示验证码
          })
          .onSuccess(function () {
            //your code,结合您的业务逻辑重置验证码
            data['resp'] = 'json'

            $.ajax({
              type: 'post',
              url: '/index.php?action=addcom',
              data: data,
              dataType: 'json',
              success: function (res) {
                console.log(res)
                if (res.code != 0) return layer.msg(res.msg)
                layer.msg('发布成功')
                window.location.reload()
              },
              error: function (err) {
                console.log(err)
                layer.msg(err.responseJSON.msg)
              },
            })
            captchaObj.reset()
          })
          .onError(function () {
            //your code
          })

        // 检测验证码是否ready, 验证码的onReady是否执行

        $('.yublog_comment_form').on('click', function (e) {
          if (e.target.id == 'comment_submit') {
            e.preventDefault()
            captchaObj.showCaptcha() //显示验证码
            data = fromToJson($('#comment_form form'))

            e.stopPropagation()
          }
        })
      }
    )
  },
})

/**
 * 全局底部侧边栏
 * */

$(window).scroll(function () {
  if ($(window).scrollTop() > 100) {
    $('.bottom-sidebar').fadeIn(200)
  } else {
    $('.bottom-sidebar').fadeOut(200)
  }
})

// 返回顶部
function backToTop () {
  $('body,html').animate(
    {
      scrollTop: 0,
    },
    500
  )
}

/**
 * 登录
 * */
// $('#login').on('click', function () {
//   window.location.href = '/admin'
// })

/**
 * 外链优化
 * */
$('a').attr('href', function (index, _href = '') {
  const reg = new RegExp(BLOG_URL)
  if (!reg.test(_href)) {
    $(this).attr('rel', 'noopener noreferrer')
  }
})

$('.yublog_article_content a').attr('target', function (_index, target = '') {
  $(this).attr('target', '_blank')
})

// 图层预览
$('.yublog_article_content img').attr('src', function (_index, src = '') {
  let title = '文章图' + ++_index
  if ($(this).attr('alt')) title = $(this).attr('alt')
  //  为了防止图片有多个父元素 a
  if (!$(this).parent('a').length) {
    $(this).wrap(
      `<a href=${src} data-fancybox='gallery' data-caption="${title}" title="${title}">  </a>`
    )
  } else {
    $(this).parent('a').attr('data-fancybox', 'gallery')
  }
})

// 代码高亮
if ($('pre').length) {
  $('pre').addClass(
    'prettyprint highlight linenums  module-radius line-numbers'
  )
}

//  lazyload 懒加载
let images = document.querySelectorAll('.lazyload')
lazyload(images)
