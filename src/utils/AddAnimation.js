let time = 200
export const antCard = ($) => {
  $(".ant-card").css({
    "margin-top": "-15px",
  })
  $(".ant-card").animate({
    marginTop: "0px",
  }, time)
}

export const antCardS = ($) => {
  $(".ant-card").css({
    "margin-top": "-30px",
  })
  $(".ant-card").animate({
    marginTop: "15px",
  }, time)
}

export const AdminSelfCard = ($) => {
  $(".admin_self_card").css({
    "margin-top": "-15px",
  })
  $(".admin_self_card").animate({
    marginTop: "0px",
  }, 400)
}