$._ajax = (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      ...data,
      success: function (res) {
        resolve(res)
      },
      error: function (err) {
        reject(err.responseJSON)
      },
    })
  })
}

$.sendError = (err) => {
  const text = err.message || err.msg || '未知错误'
  layer.msg(text)
}
