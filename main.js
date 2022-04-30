const baseUrl = "https://challengep2.herokuapp.com/";

function isNotLogin() {
  localStorage.clear();
  $("#app, #detail-movie, #sidebar-2").hide();
  $("input#email-login").val("");

  $("#password-login").val("");
  $("#form-register, #form-add-movie, #form-register, #form-edit-movie").hide();
  $("#login, .button-register").show();
  $(".google-signin").empty();
  $(".google-signin").append(`
  <div class="g-signin2" data-onsuccess="onSignIn"></div>
  <script src="https://apis.google.com/js/platform.js" async defer></script>
  <script>
    function onSignIn(googleUser) {
      $('.g-signin2').on('click', (event) => {
        let profile = googleUser.getBasicProfile();
        let id_token = googleUser.getAuthResponse().id_token;
        $.ajax({
          method:'POST',
          url: baseUrl + 'users/login-google',
          data: {
            token: id_token
          }
        })
        .done(res => {
  
        })
        .fail(err => {
          console.log(err);
        })

      })
    }
  </script>
  `);
}

function isLogin() {
  $("#app").show();
  $("#login, #form-register, #form-edit-movie, #sidebar-2").hide();
  $(".button-register, #form-add-movie, #detail-movie").hide();

  $.ajax({
    url: baseUrl + "movies",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((res) => {
      $(".read-movies").empty();
      res.data.forEach((el) => {
        $(".read-movies").append(`
    <tr>
    <td>${el.title}</td>
    <td>${el.synopsis}</td>
    <td>${el.trailerUrl}</td>
    <td><img src="${el.imgUrl}" style="width:125px"></td>
    <td>${el.rating}</td>
    <td>${el.GenreId}</td>
    <td>${el.UserId}</td>
    <td>
      <div>
      <button onclick="movieEditGet(${el.id})"><span class="badge bg-success"><content>Edit</content></span></button>
      </div>
    </td>
    <td>
    <button onclick="movieDelete(${el.id})" class="delete-movies"><span class="badge bg-success"><content>Delete</content></span></button>
  </td>
  <td>
  <button onclick="movieDetail(${el.id})" class="delete-movies"><span class="badge bg-success">Detail</span></button>
</td>
  </tr>
  `);
      });
    })
    .fail((err) => {
      swal(`${err.responseJSON.statusCode}`, `${err.responseJSON.message}`);
    });
}

function movieDetail(id) {
  $.ajax({
    url: `${baseUrl}movies/${id}`,
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((res) => {
      $("#detail-movie").empty();
      $("#app, #login, #form-register").hide();
      $("#form-add-movie, #form-register, #form-edit-movie").hide();
      $("#detail-movie").show();
      $("#detail-movie").append(`
      <div  onclick="isLogin()">
      <button><h2>Hacktiv CMS</h2></button><br><br><br>
      </div>
      <h1>Detail Movie</h1>
      <img src="${res.data.imgUrl}" style="width:120px;">
      <p>title: ${res.data.title}</p>
      <p>synopsis: ${res.data.synopsis}</p>
      <p>trailerUrl: ${res.data.trailerUrl}</p>
      <p>rating: ${res.data.rating}</p>
      <p>genre: ${res.data.Genre.name}</p>
      <p>user: ${res.data.User.username}</p>
    `);
    })
    .fail((err) => {
      swal(`${err.responseJSON.statusCode}`, `${err.responseJSON.message}`);
    });
}

function addMovie(event) {
  event.preventDefault();
  const title = $("#title-add").val();
  const synopsis = $("#synopsis-add").val();
  const trailerUrl = $("#trailer-add").val();
  const imgUrl = $("#image-add").val();
  const rating = $("#rating-add").val();
  const GenreId = $("#genre-add").val();

  $.ajax({
    url: baseUrl + `movies/add`,
    method: "POST",
    data: {
      title,
      synopsis,
      trailerUrl,
      imgUrl,
      rating,
      GenreId,
    },
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((res) => {
      isLogin();
    })
    .fail((err) => {
      swal(`${err.responseJSON.statusCode}`, `${err.responseJSON.message}`);
    });
}

function movieDelete(id) {
  $.ajax({
    url: `${baseUrl}movies/${id}/delete`,
    method: "DELETE",
    data: {
      id,
    },
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((res) => {
      isLogin();
    })
    .fail((err) => {
      swal(`${err.responseJSON.statusCode}`, `${err.responseJSON.message}`);
    });
}

function movieEditGet(id) {
  $.ajax({
    url: `${baseUrl}movies/${id}`,
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((res) => {
      const title = res.data.title;
      const synopsis = res.data.synopsis;
      const trailerUrl = res.data.trailerUrl;
      const imgUrl = res.data.imgUrl;
      const rating = res.data.rating;
      const GenreId = res.data.GenreId;
      localStorage.setItem("movie_id", res.data.id);

      $("#title-edit").val(`${title}`);
      $("#synopsis-edit").val(`${synopsis}`);
      $("#trailer-edit").val(`${trailerUrl}`);
      $("#image-edit").val(`${imgUrl}`);
      $("#rating-edit").val(`${rating}`);
      $("#genre-edit").val(`${GenreId}`);
      $("#form-edit-movie, #sidebar-2").show();
      $("#login, #form-register, #app, #detail-movie").hide();
      $(".button-register, #form-add-movie").hide();
    })
    .fail((err) => {
      swal(`${err.responseJSON.statusCode}`, `${err.responseJSON.message}`);
    });
}

function movieEditPut(event) {
  event.preventDefault();
  const title = $("#title-edit").val();
  const synopsis = $("#synopsis-edit").val();
  const trailerUrl = $("#trailer-edit").val();
  const imgUrl = $("#image-edit").val();
  const rating = $("#rating-edit").val();
  const GenreId = $("#genre-edit").val();
  const MovieId = localStorage.getItem("movie_id");
  $.ajax({
    url: `${baseUrl}movies/${MovieId}/edit`,
    method: "PUT",
    data: {
      title,
      synopsis,
      trailerUrl,
      imgUrl,
      rating,
      GenreId,
    },
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done(() => {
      event.preventDefault();
      localStorage.removeItem("movie_id");
      isLogin();
    })
    .fail((err) => {
      swal(`${err.responseJSON.statusCode}`, `${err.responseJSON.message}`);
    });
}

$(document).ready(() => {
  if (localStorage.getItem("access_token")) {
    isLogin();
  } else {
    isNotLogin();
  }

  $(".logo").on("click", (event) => {
    event.preventDefault()
    isLogin();
  });

  $("#button-add-movie").on("click", (event) => {
    event.preventDefault();
    $("#title-add").val("");
    $("#synopsis-add").val("");
    $("#trailer-add").val("");
    $("#image-add").val("");
    $("#rating-add").val("");
    $("#genre-add").val("");
    $("#form-add-movie, #sidebar-2").show();
    $("#app, #detail-movie").hide();
    $("#login").hide();
    $(".button-register").hide();
    $("#form-register").hide();
  });

  $("#add-movie").on("click", addMovie);

  $("#form-register").on("submit", (event) => {
    event.preventDefault();
    const username = $("#username-register").val();
    const email = $("#email-register").val();
    const password = $("#password-register").val();
    const phoneNumber = $("#phoneNumber-register").val();
    const address = $("#address-login").val();

    $.ajax({
      url: baseUrl + "users/register",
      method: "POST",
      data: {
        username,
        email,
        password,
        phoneNumber,
        address,
      },
    })
      .done((res) => {
        isNotLogin();
      })
      .fail((err) => {
        swal(`${err.responseJSON.statusCode}`, `${err.responseJSON.message}`);
      });
  });

  $("#form-login").on("submit", (event) => {
    event.preventDefault();
    const email = $("input#email-login").val();
    const password = $("#password-login").val();
    $.ajax({
      url: `${baseUrl}users/login`,
      method: "POST",
      data: {
        email,
        password,
      },
    })
      .done((res) => {
        localStorage.setItem("access_token", res.access_token);
        isLogin();
      })
      .fail((err) => {
        swal(`${err.responseJSON.statusCode}`, `${err.responseJSON.message}`);
      });
  });

  $(".button-register").on("click", () => {
    $("#form-register").show();
    $("#login, #detail-movie, #sidebar-2").hide();
    $(".button-register").hide();
  });

  $(".logout").on("click", (event) => {
    event.preventDefault();
    isNotLogin();
  });

  $("#edit-movie").on("click", movieEditPut);
});
